import { ReactNode, useContext } from 'react';
import { ModalContext } from './Modal';
import { cn } from '../../../utils/cn';

interface ModalTriggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * @component ModalTrigger
 * @description The trigger for opening the modal dialog.
 */
const ModalTrigger: React.FC<ModalTriggerProps> = ({ children, className }) => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalTrigger must be used within a Modal');

  return (
    <div onClick={context.openModal} className={cn('cursor-pointer', className)}>
      {children}
    </div>
  );
};

export default ModalTrigger;
