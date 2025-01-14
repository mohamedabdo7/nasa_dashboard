import { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCloseCircle } from "react-icons/io";
import { deleteImage, uploadImage } from "../../../services";
// import Spinner from "../Spinner";
import { trash } from "../../../assets/icons";
import { showToast } from "../../../utils";
import { Spinner } from "react-bootstrap";
import Modal from "../../Modal/Modal";
import get from "lodash/get";
import set from "lodash/set";

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
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const formData = new FormData();

  const upload = async (data: FormData) => {
    try {
      setLoading(true);
      // const { data: payload, message } = await uploadImage(data);
      const payload: any = await uploadImage(data);
      console.log("data", payload.url);

      // formik.setFieldValue(name, payload.url);
      set(formik.values, name, [payload.url]);
      setLoading(false);
    } catch (e) {
      console.log("err");
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (data: { image: string }) => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset the value of the file input
    }
    console.log("ima", data);
    const imageAfter = data.image.split("/uploads/")[1];
    console.log("imageAfter", imageAfter);

    await deleteImage({
      filename: imageAfter,
    });

    set(formik.values, name, "");
  };
  // const [file, setFile] = useState("");

  console.log("formik.values[name]", get(formik?.values, name, []));

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-2">
        <div
          onClick={
            !get(formik?.values, name, [])
              ? () => {
                  if (inputRef.current) {
                    inputRef.current.value = "";
                    set(formik.values, name, "");
                    // setFile(""); // Reset the value of the file input
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
          {get(formik?.values, name, []) ? (
            <div className="w-100 h-100 position-relative" onClick={() => {}}>
              <img
                src={
                  import.meta.env.VITE_NASA_URL + get(formik?.values, name, [])
                }
                className="w-100 h-100 rounded"
                crossOrigin="anonymous"
              />
              <div
                style={{
                  top: "-15px",
                  right: "-10px",
                  cursor: "pointer",
                }}
                className=" position-absolute"
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
            <>{loading ? <Spinner /> : "+"}</>
          )}
        </div>
        <div
          className=" d-flex flex-column align-items-start
         justify-content-between "
        >
          <span
            style={{
              color: "#7D7D7D",
            }}
          >
            {title} {required && "*"}
          </span>

          <span
            style={{
              color: "#28334A",
              cursor: "pointer",
              border: "unset",
              backgroundColor: "transparent",
            }}
            onClick={
              !get(formik?.values, name, [])
                ? () => {
                    if (inputRef.current) {
                      inputRef.current.value = "";
                      // formik.setFieldValue(name, "");
                      set(formik.values, name, "");

                      // setFile(""); // Reset the value of the file input
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
                    showToast(t("toasts.imageTypes"), "error");
                    return;
                  }
                  // Check file size (5MB = 5 * 1024 * 1024 bytes)
                  if (file.size > 5 * 1024 * 1024) {
                    showToast(t("toasts.imageSize"), "error");
                    return;
                  }
                  formData.append(`${"image"}`, file);
                  upload(formData);
                  // const fileUrl = URL.createObjectURL(file);
                  // console.log("file", fileUrl);
                  // setFile(fileUrl);
                }
              }}
            />
          </span>
        </div>
      </div>

      {formik?.touched[name] && formik?.errors[name] ? (
        <div className="error">
          <small style={{ color: "red" }}>{formik?.errors[name]}</small>
        </div>
      ) : null}
      {/* <div className="error text-danger">errrrrr</div> */}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={async () => {
          console.log(
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            get(formik?.values, name, [])
          );
          console.log(">>>>>>>", name);
          console.log(">>>>>>>formik?.values", formik?.values);

          await deletePhoto({ image: get(formik?.values, name, []) });
          setIsOpen(false);
          showToast("Photo Deleted Successfully", "success");
        }}
        modalIcon={trash}
        confirmBtnStyle="dangerous"
        closeBtnText={t("actions.cancel")}
        confirmBtnText={t("actions.delete")}
        modalTitle={t("image.deleteImage")}
        modalMsg={t("image.confirmDelete")}
      ></Modal>
    </>
  );
};

export default NewImage;

// import { FC, useEffect, useRef, useState } from "react";

// // import { IoIosCloseCircle } from "react-icons/io";
// import edit from "./edit.svg";
// // import { deleteImage, uploadImage } from "../../../services";
// // import Spinner from "../Spinner";
// import { showToast } from "../../../utils";
// import { useTranslation } from "react-i18next";
// import { Spinner } from "react-bootstrap";
// type ImageProp = { formik: any; name: string };
// const NewImage: FC<ImageProp> = ({ name, formik }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const formData = new FormData();
//   const [loading, setLoading] = useState(false);
//   const [firstImage, setFirstImage] = useState(false);
//   const [file, setFile] = useState(formik.values[name]);
//   const { t, i18n } = useTranslation();
//   // console.log("image", file, formik.values[name]);
//   useEffect(() => {
//     if (!firstImage && formik.values[name]) {
//       setFile(formik.values[name]);
//       setFirstImage(true);
//     }
//   }, [formik.values[name]]);
//   // console.log("file", file);
//   const upload = async (data: FormData) => {
//     try {
//       setLoading(true);
//       // const { data: payload } = await uploadImage(data);
//       console.log("data", data);

//       // formik.setFieldValue(name, payload.url);
//       setLoading(false);
//     } catch (e) {
//       console.log("err");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deletePhoto = async (data: { image: string }) => {
//     // if (inputRef.current) {
//     //   inputRef.current.value = ""; // Reset the value of the file input
//     // }
//     const imageAfter = data.image.split("/uploads/")[1];
//     console.log("ima", imageAfter);

//     // const { data: payload, message } = await deleteImage({
//     //   image: data.image.split("/uploads/")[1],
//     // });
//     // console.log("data", payload, message);

//     formik.setFieldValue(name, "");
//   };

//   return (
//     <>
//       <div
//         className=" rounded  position-relative "
//         style={{
//           width: "72px",
//           height: "72px",
//           backgroundColor: "var(--secondary)",
//         }}
//       >
//         {formik.values[name] && (
//           <div className="w-100 h-100 ">
//             <img src={formik.values[name]} className="w-100 h-100 rounded" />
//           </div>
//         )}

//         {loading && !formik.values[name] && (
//           <div className="w-100 h-100 rounded d-flex justify-content-center align-items-center">
//             <Spinner />
//           </div>
//         )}
//         <div
//           style={{
//             width: "24px",
//             height: "24px",
//             top: "56px",
//             left: `${i18n.language == "en" ? "54px" : "-4px"}`,
//             // zIndex: 100,
//             cursor: "pointer",
//             // padding: "3px 5px",
//             backgroundColor: "#eee",
//           }}
//           className="position-absolute d-flex justify-content-center align-items-center  rounded "
//           onClick={async () => {
//             inputRef.current?.click();
//           }}
//         >
//           <img src={edit}></img>
//         </div>
//         <input
//           hidden
//           ref={inputRef}
//           type="file"
//           onChange={async (e) => {
//             console.log("hello");

//             if (e.target.files && e.target.files.length > 0) {
//               // if (inputRef.current) {
//               //   inputRef.current.value = ""; // Reset the value of the file input
//               // }
//               const filee = e.target.files[0];
//               const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//               if (!validTypes.includes(filee.type)) {
//                 showToast(t("toasts.imageTypes"), "error");
//                 return;
//               }
//               // Check file size (5MB = 5 * 1024 * 1024 bytes)
//               if (filee.size > 5 * 1024 * 1024) {
//                 showToast(t("toasts.imageSize"), "error");
//                 return;
//               }
//               if (formik.values[name] && file !== formik.values[name]) {
//                 await deletePhoto({ image: formik.values[name] });
//               }
//               if (formik.values[name]) {
//                 formik.setFieldValue(name, "");
//                 // await deletePhoto({ image: formik.values[name] });
//               }

//               console.log("fet", e.target.files[0]);

//               formData.append("image", filee);
//               upload(formData);
//               // const fileUrl = URL.createObjectURL(file);
//               // console.log("file", fileUrl);
//               // setFile(fileUrl);
//             } else {
//               // formik.setFieldValue(name, file);
//             }
//           }}
//         />
//       </div>

//       {!loading && formik?.touched[name] && formik?.errors[name] ? (
//         <div className="error">
//           <span className="text-danger">{formik?.errors[name]}</span>
//         </div>
//       ) : null}
//       {/* <div className="error text-danger">errrrrr</div> */}
//     </>
//   );
// };

// export default NewImage;
