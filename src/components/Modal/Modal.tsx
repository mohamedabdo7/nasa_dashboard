import { FC, useState } from "react";
import "./Modal.scss";
import Button, { BtnStypeClass } from "../UI/Button";
// import { IoCloseCircleOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";
import { danger } from "../../assets/icons";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: any) => void;
  modalIcon?: any;
  modalTitle?: string;
  modalMsg?: string;
  closeBtnText?: string;
  confirmBtnText?: string;
  confirmBtnStyle?: BtnStypeClass;
  isTextArea?: any;
  name?: string;
  labelText?: string;
  placeholderText?: string;
  visitStatus?: string;
  loading?: boolean;
  canBeDeleted?: boolean;
  canNotBeDeletedMsg?: string | null;
};

const Modal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  modalIcon,
  modalTitle,
  modalMsg,
  closeBtnText,
  confirmBtnText,
  confirmBtnStyle,
  isTextArea,
  labelText,
  placeholderText,
  name,
  visitStatus,
  loading,
  canBeDeleted = true,
  canNotBeDeletedMsg = null,
}) => {
  if (!isOpen) return null;

  const [reasonValue, setReasonValue] = useState("");
  const [hasError, setHasError] = useState(false);

  // Update the state when the textarea value changes
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasonValue(e.target.value);
    setHasError(false); // Reset error when user starts typing
  };

  // Modify the confirm callback to include the textarea value
  const handleConfirm = () => {
    if (isTextArea && reasonValue.trim() === "") {
      setHasError(true);
      return;
    }
    if (onConfirm) {
      onConfirm(reasonValue);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="main__container" onClick={(e) => e.stopPropagation()}>
        {canBeDeleted ? (
          <>
            <img src={modalIcon} width={96} alt="trash" />
            <h5 className="title text-center">{modalTitle}</h5>

            {name && visitStatus === "other" ? (
              <h5 className="msg">
                {modalMsg} {`“ ${name} “`} ?
              </h5>
            ) : (
              <h5 className="msg title">{modalMsg} </h5>
            )}

            {isTextArea && (
              <div className="reason-container">
                <textarea
                  className={`reason-input ${hasError ? "error" : ""}`}
                  name="reason"
                  onChange={handleTextareaChange}
                  placeholder={placeholderText}
                />
                <label
                  className={`reason-label ${hasError ? "error-label" : ""}`}
                  htmlFor="reason"
                >
                  {labelText}
                </label>
              </div>
            )}

            <div className="row btns-container">
              <div className="col-6">
                <Button
                  text={confirmBtnText}
                  styleType={confirmBtnStyle}
                  // onClick={onConfirm}
                  onClick={handleConfirm}
                  loading={loading}
                />
              </div>
              <div className="col">
                <Button
                  text={closeBtnText}
                  styleType="dark-gray"
                  onClick={onClose}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <img src={danger} width={96} alt="trash" />
            <h5 className="title text-center">{canNotBeDeletedMsg}</h5>
            <div
              onClick={onClose}
              style={{
                position: "absolute",
                top: "5px",
                right: "6px",
                cursor: "pointer",
              }}
            >
              <IoCloseCircleOutline style={{ fontSize: "1.5rem" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
