import React, { ChangeEvent, useState } from "react";
import "./Input.scss";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

type InputProps = {
  labelStyle?: any;
  inputChange?: (value: string) => void;
  name: string;
  placeholder?: string;
  labelName: string;
  icon?: string;
  value?: string | number | null;
  isIcon?: boolean;
  className?: string;
  pattern?: string;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
  onChangeValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  formik?: any;
  inputMode?:
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search"
    | undefined;
};

const InputPassword: React.FC<InputProps> = ({
  labelStyle,
  icon,
  isIcon,
  disabled,
  inputChange,
  onChangeValue,
  onChange,
  labelName,
  value,
  autoComplete,
  inputMode,
  formik,
  name,
  required,
  ...props
}) => {
  const [hide, setHide] = useState(true);

  return (
    <div className="input-container mt-2">
      {hide ? (
        <div className="icon-password" onClick={() => setHide(!hide)}>
          <FaRegEyeSlash />
        </div>
      ) : (
        <div className="icon-password" onClick={() => setHide(!hide)}>
          <FaRegEye />
        </div>
      )}

      <input
        {...props}
        inputMode={inputMode || "text"}
        name={name}
        value={formik ? formik.values[name] : value}
        onChange={formik ? formik?.handleChange : onChange}
        onBlur={formik?.handleBlur}
        type={hide ? "password" : "text"}
        disabled={disabled}
        // autoComplete={autoComplete}
        className={` ${
          formik?.touched[name] && formik?.errors[name]
            ? "input-error"
            : "input-custom"
        }`}
      />
      <label
        style={labelStyle}
        className={`"input-label" ${
          formik?.touched[name] && formik?.errors[name] && "label-error"
        }`}
      >
        <span className="mx-2">{labelName}</span>
        <span className="mt-1">{required && "*"}</span>
      </label>

      {formik?.touched[name] && formik?.errors[name] && (
        <div className="error">
          {formik?.touched[name] && formik?.errors[name] ? (
            <span className="" style={{ color: "red" }}>
              {formik?.errors[name]}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default InputPassword;
