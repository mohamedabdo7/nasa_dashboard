import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCloseCircle } from "react-icons/io";
import { deleteImage, uploadMultibleImages } from "../../../services";
import { showToast } from "../../../utils";
import { Spinner, Stack } from "react-bootstrap"; // Import React Bootstrap components
import { trash } from "../../../assets/icons";
import Modal from "../../Modal/Modal";

type ImageProp = {
  formik?: any;
  name: string;
  isEdit: boolean;
  required?: boolean;
};

const MultiImageUpload: FC<ImageProp> = ({
  name,
  formik,
  isEdit,
  required,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData();

  useEffect(() => {
    if (!initialRender && isEdit && formik?.values[name]?.length > 0) {
      const initials = formik?.values[name]?.map((img: string) => {
        return import.meta.env.VITE_NASA_URL + img;
      });
      setImageUrls(initials);
      if (formik?.values[name]?.length > 0) {
        setInitialRender(true);
      }
    }
  }, [formik?.values[name]?.length]);

  const upload = async (data: FormData) => {
    try {
      setLoading(true);
      // const { data: payload } = await uploadMultibleImages(data);
      const payload: any = await uploadMultibleImages(data);
      const newImageUrls = payload.urls?.map((url: string) => {
        return import.meta.env.VITE_NASA_URL + url;
      });
      const newImageUrlsWithoutPrefix = payload.urls?.map((url: string) => {
        return url;
      });

      setImageUrls((prevUrls) => [...prevUrls, ...newImageUrls]);
      // Ensure formik.values[name] is an array
      formik.setFieldValue(name, [
        ...formik.values[name],
        ...newImageUrlsWithoutPrefix,
      ]);

      setLoading(false);
    } catch (e) {
      console.log("err", e);
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (image: string) => {
    if (isEdit) {
      try {
        const imageAfter = image.split("/uploads/")[1];
        setImageUrls((prevUrls) => prevUrls.filter((img) => img !== image));
        const currentImages = formik.values[name] || [];

        const newImagesArray = currentImages.filter((img: string) => {
          return img.split("/uploads/")[1] !== imageAfter;
        });

        formik.setFieldValue(name, newImagesArray);

        const deletedImagesArray = currentImages.filter((img: string) => {
          return img.split("/uploads/")[1] === imageAfter;
        });
        formik.setFieldValue("deletedImages", [
          ...formik.values.deletedImages,
          ...deletedImagesArray,
        ]);
      } catch (e) {
        console.log("err", e);
      }
    } else {
      try {
        const imageAfter = image.split("/uploads/")[1];
        setImageUrls((prevUrls) => prevUrls.filter((img) => img !== image));
        const currentImages = formik.values[name] || [];
        const newImagesArray = currentImages.filter((img: string) => {
          return img.split("/uploads/")[1] !== imageAfter;
        });
        formik.setFieldValue(name, newImagesArray);

        await deleteImage({
          filename: image.split("/uploads/")[1],
        });

        showToast("Photo Deleted Successfully", "success");
      } catch (e) {
        console.log("err", e);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
          showToast(t("toasts.imageTypes"), "error");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast(t("toasts.imageSize"), "error");
          return;
        }
        formData.append("files", file);
      });
      upload(formData);
      e.target.value = ""; // Reset the input value
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 mb-2 flex-row">
        <div
          onClick={() => inputRef.current?.click()}
          className="d-flex align-items-center justify-content-center rounded"
          style={{
            width: "70px",
            height: "70px",
            fontSize: "25px",
            backgroundColor: "transparent",
            border: ".1rem dashed var(--primary)",
            flexWrap: "wrap",
          }}
        >
          {loading ? <Spinner /> : "+"}
        </div>
        <Stack
          style={{ flexWrap: "wrap" }}
          className="align-items-center"
          direction="horizontal"
          gap={2}
        >
          {imageUrls.length > 0 ? (
            imageUrls.map((image, index) => (
              <div key={index} className="position-relative">
                <img
                  src={image}
                  alt="Image"
                  className="rounded-2"
                  style={{ width: "70px", height: "70px" }}
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
                    setImageToDelete(image);
                    setIsOpen(true);
                  }}
                >
                  <IoIosCloseCircle style={{ color: "red" }} />
                </div>
              </div>
            ))
          ) : (
            <Stack
              direction="vertical"
              gap={2}
              className="justify-content-center align-items-start"
            >
              <div style={{ color: "var(--gray", fontSize: "13px" }}>
                {t("inputs.images")} {required && "*"}
              </div>
              <div
                className="fw-bold"
                style={{ color: "var(--primary", fontSize: "14px" }}
              >
                {t("inputs.uploadImages")}
              </div>
            </Stack>
          )}
        </Stack>
      </div>
      <div
        className="d-flex flex-row align-items-start justify-content-between"
        style={{ flexWrap: "wrap" }}
      >
        <span
          style={{
            color: "#28334A",
            cursor: "pointer",
            border: "unset",
            backgroundColor: "transparent",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            hidden
            ref={inputRef}
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </span>
      </div>

      {formik?.touched[name] && formik?.errors[name] ? (
        <div className="error">
          <small style={{ color: "red" }}>{formik?.errors[name]}</small>
        </div>
      ) : null}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={async () => {
          if (imageToDelete) {
            await deletePhoto(imageToDelete);
            setIsOpen(false);
          }
        }}
        modalIcon={trash}
        closeBtnText={t("actions.cancel")}
        confirmBtnText={t("actions.delete")}
        modalTitle={t("deletsMsgs.deleteImage")}
        confirmBtnStyle="modal-confirm"
      />
    </>
  );
};

export default MultiImageUpload;
