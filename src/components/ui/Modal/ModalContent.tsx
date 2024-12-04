import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import { ModalContext } from './Modal';
import { cn } from '../../../utils/cn';
import Button from '../Button';
import { X } from 'lucide-react';

interface ModalContentProps {
  children: ReactNode;
  isCloseable?: boolean;
  className?: string;
}

/**
 * @component ModalContent
 * @description The content area of the modal. Handles accessibility, keyboard interactions, and outside clicks.
 *
 * @example
 * <ModalContent isCloseable>
 *  <h2>Modal Title</h2>
 * <p>Modal content goes here...</p>
 * </ModalContent>
 *
 * @param {boolean} [isCloseable=false] - Specifies whether or not to show the close window button.
 * @param {string} [className] - Additional custom classes to style the modal content.
 * @returns {JSX.Element} The rendered modal content area.
 */
const ModalContent: React.FC<ModalContentProps> = ({ isCloseable = false, children, className, ...props }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalContent must be used within a Modal');

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle closing the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        context.closeModal();
      }
    };

    if (context.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [context]);

  // Handle closing the modal with the Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        context.closeModal();
      }
    };

    if (context.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [context]);

  // Return null if the modal is not open
  if (!context.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" role="dialog" aria-modal="true">
      <div
        ref={modalRef}
        className={cn(
          'bg-white dark:bg-dark-500 border border-border-light dark:border-border-dark py-4 px-6 mx-3 rounded-lg shadow-lg max-w-lg w-full relative',
          className
        )}
        {...props}
      >
        {isCloseable && (
          <Button
            variant="outline"
            size="xsmall"
            rounded
            onClick={context.closeModal}
            aria-label="Close modal"
            className="absolute top-2 right-2"
          >
            <X aria-hidden="true" />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalContent;
