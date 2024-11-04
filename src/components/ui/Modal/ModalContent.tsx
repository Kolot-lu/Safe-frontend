import { ReactNode, useContext, useEffect, useRef } from 'react';
import { ModalContext } from './Modal';
import ModalCloseButton from './ModalCloseButton';
import { cn } from '../../../utils/cn';

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * @component ModalContent
 * @description The content area of the modal, which appears centered on the screen when open.
 * Automatically adds a close button for accessibility.
 */
const ModalContent: React.FC<ModalContentProps> = ({ children, className }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalContent must be used within a Modal');

  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!context.isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className={cn('bg-white dark:bg-dark-500 p-3 mx-3 rounded-lg shadow-lg max-w-lg w-full relative', className)}
        role="dialog"
        aria-modal="true"
      >
        <ModalCloseButton />
        {children}
      </div>
    </div>
  );
};

export default ModalContent;
