import React, { useState, createContext, ReactNode } from 'react';
import ModalTrigger from './ModalTrigger';
import ModalContent from './ModalContent';
import ModalCloseButton from './ModalCloseButton';

interface ModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalComponent extends React.FC<{ children: ReactNode; className?: string }> {
  Trigger: typeof ModalTrigger;
  Content: typeof ModalContent;
  CloseButton: typeof ModalCloseButton;
}

const Modal: ModalComponent = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      <div className={className}>{children}</div>
    </ModalContext.Provider>
  );
};

export default Modal;

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.CloseButton = ModalCloseButton;
