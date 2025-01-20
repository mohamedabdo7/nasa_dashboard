import { FC, useEffect, useRef, useState } from "react";

// import { IoIosCloseCircle } from "react-icons/io";
import edit from "./edit.svg";
import { deleteImage, uploadImage } from "../../../services";
// import Spinner from "../Spinner";
import { showToast } from "../../../utils";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
type ImageProp = { formik: any; name: string };
const NewImage: FC<ImageProp> = ({ name, formik }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  const [loading, setLoading] = useState(false);
  const [firstImage, setFirstImage] = useState(false);
  const [file, setFile] = useState(formik.values[name]);
  const { t, i18n } = useTranslation();
  // console.log("image", file, formik.values[name]);
  useEffect(() => {
    if (!firstImage && formik.values[name]) {
      setFile(formik.values[name]);
      setFirstImage(true);
    }
  }, [formik.values[name]]);
  // console.log("file", file);
  const upload = async (data: FormData) => {
    try {
      setLoading(true);
      // const { data: payload } = await uploadImage(data);
      // console.log("data", payload.url, message);
      const response = await uploadImage(data);
      formik.setFieldValue(name, response.url);

      // formik.setFieldValue(name, payload.url);
      setLoading(false);
    } catch (e) {
      console.log("err");
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (data: { image: string }) => {
    // if (inputRef.current) {
    //   inputRef.current.value = ""; // Reset the value of the file input
    // }
    const imageAfter = data.image.split("/uploads/")[1];
    console.log("ima", imageAfter);

    const { data: payload, message } = await deleteImage({
      filename: data.image.split("/uploads/")[1],
    });
    console.log("data", payload, message);

    formik.setFieldValue(name, "");
  };

  return (
    <>
      <div
        className=" rounded  position-relative "
        style={{
          width: "72px",
          height: "72px",
          backgroundColor: "var(--secondary)",
        }}
      >
        {formik.values[name] && (
          <div className="w-100 h-100 ">
            <img
              src={import.meta.env.VITE_NASA_URL + formik.values[name]}
              className="w-100 h-100 rounded"
              crossOrigin="anonymous"
            />
          </div>
        )}

        {loading && !formik.values[name] && (
          <div className="w-100 h-100 rounded d-flex justify-content-center align-items-center">
            <Spinner />
          </div>
        )}
        <div
          style={{
            width: "24px",
            height: "24px",
            top: "56px",
            left: `${i18n.language == "en" ? "54px" : "-4px"}`,
            // zIndex: 100,
            cursor: "pointer",
            // padding: "3px 5px",
            backgroundColor: "#eee",
          }}
          className="position-absolute d-flex justify-content-center align-items-center  rounded "
          onClick={async () => {
            inputRef.current?.click();
          }}
        >
          <img src={edit}></img>
        </div>
        <input
          hidden
          ref={inputRef}
          type="file"
          onChange={async (e) => {
            console.log("hello");

            if (e.target.files && e.target.files.length > 0) {
              // if (inputRef.current) {
              //   inputRef.current.value = ""; // Reset the value of the file input
              // }
              const filee = e.target.files[0];
              const validTypes = ["image/jpeg", "image/jpg", "image/png"];
              if (!validTypes.includes(filee.type)) {
                showToast(t("toasts.imageTypes"), "error");
                return;
              }
              // Check file size (5MB = 5 * 1024 * 1024 bytes)
              if (filee.size > 5 * 1024 * 1024) {
                showToast(t("toasts.imageSize"), "error");
                return;
              }
              if (formik.values[name] && file !== formik.values[name]) {
                await deletePhoto({ image: formik.values[name] });
              }
              if (formik.values[name]) {
                formik.setFieldValue(name, "");
                // await deletePhoto({ image: formik.values[name] });
              }

              formData.append("file", filee);
              upload(formData);
              // const fileUrl = URL.createObjectURL(file);
              // console.log("file", fileUrl);
              // setFile(fileUrl);
            } else {
              // formik.setFieldValue(name, file);
            }
          }}
        />
      </div>

      {!loading && formik?.touched[name] && formik?.errors[name] ? (
        <div className="error">
          <span className="text-danger">{formik?.errors[name]}</span>
        </div>
      ) : null}
      {/* <div className="error text-danger">errrrrr</div> */}
    </>
  );
};

export default NewImage;
