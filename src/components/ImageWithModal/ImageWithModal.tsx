import React, { useState } from "react";
import { Modal } from "react-bootstrap";

interface ImageWithModalProps {
  imageUrl: string; // URL of the image
  name?: string; // Optional name to display beside the image
  alt?: string; // Optional alt text for the image
}

const ImageWithModal: React.FC<ImageWithModalProps> = ({
  imageUrl,
  name,
  alt,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={import.meta.env.VITE_NASA_URL + imageUrl}
        alt={alt || "Image"}
        width={80}
        height={80}
        style={{
          borderRadius: "8px",
          cursor: "pointer",
          objectFit: "cover",
        }}
        onClick={handleModalOpen}
        crossOrigin="anonymous"
      />
      {name && (
        <span
          style={{ fontSize: "16px", fontWeight: 700, color: "var(--primary)" }}
        >
          {name}
        </span>
      )}

      <Modal
        show={isModalOpen}
        onHide={handleModalClose}
        centered
        dialogClassName="large-image-modal" // Custom class for modal
      >
        <Modal.Header closeButton>
          <Modal.Title>{name || "Image Preview"}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 0,
          }}
        >
          <img
            src={import.meta.env.VITE_NASA_URL + imageUrl}
            alt={alt || "Image"}
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
      </Modal>
      <style>{`
        .large-image-modal .modal-dialog {
          width: 70vw;
          height: 70vh;
          max-width: none;
          margin: 0 auto;
          z-index: 1009;
        }
        .large-image-modal .modal-content {
          height: 100%;
        }
        .large-image-modal .modal-body {
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .show {
          z-index: 1010;
        }
      `}</style>
    </div>
  );
};

export default ImageWithModal;
