import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modalTitle: string;
  modalMessage: string;
  confirmBtnText: string;
  cancelBtnText: string;
  loading?: boolean;
  Icon?: React.ReactNode; // Icon component passed as a prop
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  onConfirm,
  modalTitle,
  modalMessage,
  confirmBtnText,
  cancelBtnText,
  loading = false,
  Icon,
}) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      fullscreen="true" // Makes the modal cover the full screen
    >
      <Modal.Header closeButton>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {Icon && <span>{Icon}</span>} {/* Render the icon if provided */}
          <span style={{ fontWeight: 600, fontSize: "18px" }}>
            {modalTitle}
          </span>
        </div>
      </Modal.Header>
      <Modal.Body>{modalMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelBtnText}
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : confirmBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
