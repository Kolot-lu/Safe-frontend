import { useContext } from 'react';
import { ModalContext } from './Modal';
import { X } from 'lucide-react';
import Button from '../Button';

/**
 * @component ModalCloseButton
 * @description A button to close the modal dialog.
 */
const ModalCloseButton: React.FC = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalCloseButton must be used within a Modal');

  return (
    <Button variant="outline" rounded onClick={context.closeModal} aria-label="Close modal" className="absolute top-3 right-3">
      <X aria-hidden="true" />
    </Button>
  );
};

export default ModalCloseButton;
