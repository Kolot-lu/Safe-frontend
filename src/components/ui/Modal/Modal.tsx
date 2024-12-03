import React, { useState, createContext, ReactNode, useImperativeHandle, forwardRef } from 'react';
import ModalTrigger from './ModalTrigger';
import ModalContent from './ModalContent';

/**
 * @interface ModalContextProps
 * @description Defines the properties provided by the modal context.
 * @property {boolean} isOpen - Indicates whether the modal is currently open.
 * @property {() => void} openModal - Function to open the modal.
 * @property {() => void} closeModal - Function to close the modal.
 */
interface ModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * ModalContext
 * Provides state and control methods for managing the modal's visibility.
 */
export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export interface ModalHandle {
  openModal: () => void;
  closeModal: () => void;
}

interface ModalProps {
  children: ReactNode;
  className?: string;
  modalRef?: React.Ref<ModalHandle>;
}

interface ModalComponent extends React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<ModalHandle>> {
  Trigger: typeof ModalTrigger;
  Content: typeof ModalContent;
}

/**
 * @component Modal
 * @description A flexible modal component that supports programmatic control via `ref` and a structured subcomponent API.
 *
 * ### Example Usage:
 * ```tsx
 * const modalRef = useRef<ModalHandle>(null);
 *
 * return (
 *   <Modal ref={modalRef}>
 *     <Modal.Trigger>
 *       <button>Open Modal</button>
 *     </Modal.Trigger>
 *     <Modal.Content>
 *       <h2>Modal Title</h2>
 *       <p>Modal content goes here...</p>
 *     </Modal.Content>
 *   </Modal>
 * );
 * ```
 *
 * @param {children} children - The content of the modal, including subcomponents like `Modal.Trigger` and `Modal.Content`.
 * @param {string} [className] - Optional custom class names for styling the modal wrapper.
 * @param {React.Ref<ModalHandle>} [modalRef] - Optional ref to expose modal control methods.
 * @returns {JSX.Element} The modal component with its context and subcomponents.
 */
const Modal = forwardRef<ModalHandle, ModalProps>(({ children, className, modalRef }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Expose modal controls via `ref`
  useImperativeHandle(ref || modalRef, () => ({
    openModal,
    closeModal,
  }));

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      <div className={className}>{children}</div>
    </ModalContext.Provider>
  );
}) as ModalComponent;

Modal.displayName = 'Modal';

// Attach structured subcomponents to `Modal`
Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;

export default Modal;
