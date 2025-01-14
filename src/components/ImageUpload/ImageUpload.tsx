import React, { useState, useRef, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { IoMdCloseCircle } from "react-icons/io";
import "./ImageUpload.scss"; // Import your SCSS styles
import { deleteImage, uploadImage } from "../../services";
import Modal from "../Modal/Modal";
import { trash } from "../../assets/icons";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
  name: string; // The name for Formik or other form handling
  initialImageUrl?: string; // Prop to accept an initial image URL
  onImageChange?: (imageUrl: string | null) => void; // Optional callback when image is changed
  onChange?: (file: File | null) => void; // Add the onChange prop to handle file changes
  isEditMode?: boolean; // New prop to differentiate between edit and add modes
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  initialImageUrl,
  onImageChange,
  onChange, // Destructure the onChange prop
  isEditMode = false, // Default to add mode
}) => {
  const { t } = useTranslation();

  const [image, setImage] = useState<string | null>(initialImageUrl || null); // Use initial image URL if passed
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImage(`${import.meta.env.VITE_NASA_URL}${initialImageUrl}`); // Update image when initialImageUrl prop changes
    }
  }, [initialImageUrl]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await uploadImage(formData); // Your upload function
        const uploadedImageUrl = response.url; // Assuming response contains the URL

        if (uploadedImageUrl) {
          // Determine the image URL based on mode
          const imageUrl = isEditMode
            ? `${uploadedImageUrl}` // Edit mode doesn't prepend the base URL
            : `${import.meta.env.VITE_NASA_URL}${uploadedImageUrl}`; // Add mode prepends the base URL
          // const imageUrl = `${uploadedImageUrl}`; // Edit mode doesn't prepend the base URL

          setImage(imageUrl);

          if (onImageChange) {
            onImageChange(imageUrl); // Pass the URL to parent
          }
        }
      } catch (err) {
        setError("Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDeleteImage = async () => {
    if (image) {
      const filename = image.split("/").pop() || ""; // Extract filename

      try {
        await deleteImage({ filename });
        setImage(null); // Clear the image on successful deletion

        if (onImageChange) {
          onImageChange(null); // Notify parent component of the deletion
        }

        if (onChange) {
          onChange(null); // Notify parent component of the deleted file
        }
      } catch (err) {
        setError("Failed to delete image");
      } finally {
        setModalOpen(false);
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setModalOpen(true); // Show modal for confirming deletion
  };

  // const cancelDeleteImage = () => {
  //   setModalOpen(false);
  // };

  const handleCustomInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input click
    }
  };

  return (
    <div className="image-upload-container">
      {!image ? (
        <div className="upload-area">
          {loading ? (
            <Spinner animation="border" role="status" variant="primary" />
          ) : (
            <div className="custom-upload-div" onClick={handleCustomInputClick}>
              <GoPlus size={24} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the default file input
            name={name} // Add name attribute to input
          />
        </div>
      ) : (
        <div className="uploaded-image">
          <img
            src={image}
            alt="Uploaded"
            className="uploaded-img"
            crossOrigin="anonymous"
          />
          <button onClick={handleRemoveImage} className="remove-btn">
            <IoMdCloseCircle color="#f00" />
          </button>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {/* <Modal show={modalOpen} onHide={cancelDeleteImage}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteImage}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteImage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteImage}
        modalIcon={trash}
        closeBtnText={t("actions.cancel")}
        confirmBtnText={t("actions.delete")}
        modalTitle={t("deletsMsgs.deleteImage")}
        confirmBtnStyle="modal-confirm"
      />
    </div>
  );
};

export default ImageUpload;
