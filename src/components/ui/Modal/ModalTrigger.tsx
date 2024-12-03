import React, { ReactNode, useContext } from 'react';
import { ModalContext } from './Modal';
import { cn } from '../../../utils/cn';

interface ModalTriggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * @component ModalTrigger
 * @description The trigger for opening the modal dialog.
 * 
 * @param {ReactNode} children - The content to be rendered as the trigger.
 * @param {string} [className] - Additional classes to apply to the trigger.
 */
const ModalTrigger: React.FC<ModalTriggerProps> = ({ children, className }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalTrigger must be used within a Modal');

  return (
    <div
      onClick={context.openModal}
      className={cn('cursor-pointer', className)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          context.openModal();
        }
      }}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen}
    >
      {children}
    </div>
  );
};

export default ModalTrigger;
