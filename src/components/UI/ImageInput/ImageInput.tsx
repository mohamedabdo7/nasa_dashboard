import { FC, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { deleteImage, uploadImage } from "../../../services";
// import Modal from "../../../components/UI/Modal/Modal";
import { showToast } from "../../../utils";
import { Spinner } from "react-bootstrap";
import { getIn } from "formik";
import { trash } from "../../../assets/icons";
import Modal from "../../Modal/Modal";

type ImageProp = {
  formik?: any;
  name: string;
  uploadMsg?: string;
  title?: string;
  required?: boolean;
};

const NewImage: FC<ImageProp> = ({
  name,
  formik,
  uploadMsg,
  title,
  required,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData();

  const upload = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await uploadImage(data);
      formik.setFieldValue(name, response.url);
      // const { data: payload } = await uploadImage(data);
      // console.log(payload);
      // formik.setFieldValue(name, payload.url);
    } catch (e) {
      console.error("Upload failed", e);
      // showToast("Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (data: { image: string }) => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset the value of the file input
    }

    const imageAfter = data.image.split("/uploads/")[1];
    console.log("ima", imageAfter);

    await deleteImage({ filename: imageAfter });
    formik.setFieldValue(name, "");
  };

  const fieldValue = getIn(formik.values, name); // Resolve the nested field value
  const fieldError = getIn(formik.errors, name); // Resolve the nested field error
  const isTouched = getIn(formik.touched, name); // Check if the nested field is touched

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <div
          onClick={
            !fieldValue
              ? () => {
                  if (inputRef.current) {
                    inputRef.current.value = "";
                    formik.setFieldValue(name, "");
                  }
                  inputRef.current?.click();
                }
              : () => {}
          }
          className="d-flex align-items-center justify-content-center rounded"
          style={{
            width: "70px",
            height: "70px",
            fontSize: "25px",
            backgroundColor: "transparent",
            border: ".1rem dashed var(--primary)",
          }}
        >
          {fieldValue ? (
            <div className="w-100 h-100 position-relative">
              <img
                // src={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + fieldValue}
                src={import.meta.env.VITE_NASA_URL + fieldValue}
                className="w-100 h-100 rounded"
                alt="uploaded"
                crossOrigin="anonymous"
              />
              <div
                style={{
                  top: "-15px",
                  right: "-10px",
                  cursor: "pointer",
                }}
                className="position-absolute"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <IoIosCloseCircle
                  style={{
                    color: "red",
                  }}
                />
              </div>
            </div>
          ) : (
            <>{loading ? <Spinner animation="border" /> : "+"}</>
          )}
        </div>
        <div className="d-flex flex-column align-items-start justify-content-between">
          <span style={{ color: "#7D7D7D" }}>
            {title} {required && "*"}
          </span>

          <span
            style={{
              color: "#28334A",
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
            onClick={
              !fieldValue
                ? () => {
                    if (inputRef.current) {
                      inputRef.current.value = "";
                      formik.setFieldValue(name, "");
                    }
                    inputRef.current?.click();
                  }
                : () => {}
            }
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--primary)",
              }}
            >
              {uploadMsg}
            </span>
            <input
              hidden
              ref={inputRef}
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];

                  const validTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/svg+xml",
                  ];
                  if (!validTypes.includes(file.type)) {
                    showToast("Invalid file type", "error");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    showToast("File size exceeds 5MB", "error");
                    return;
                  }
                  formData.append("file", file);
                  upload(formData);
                }
              }}
            />
          </span>
        </div>
      </div>

      {isTouched && fieldError && (
        <div className="error">
          <small style={{ color: "red" }}>{fieldError}</small>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={async () => {
          await deletePhoto({ image: fieldValue });
          setIsOpen(false);
          showToast("Photo Deleted Successfully", "success");
        }}
        modalIcon={trash}
        confirmBtnStyle="active"
        closeBtnText="Cancel"
        confirmBtnText="Delete"
        modalTitle="Delete Image"
        modalMsg="Are you sure you want to delete this image?"
      />
    </>
  );
};

export default NewImage;
