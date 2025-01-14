import React, { ChangeEvent } from "react";
import "./Input.scss";

type InputProps = {
  iconClick?: () => void;
  inputChange?: (value: string) => void;
  labelStyle?: any;
  name: string;
  placeholder?: string;
  type: string;
  labelName?: string;
  icon?: any;
  isIcon?: boolean;
  value?: string | number | null;
  className?: string;
  pattern?: string;
  disabled?: boolean;
  autoComplete?: string;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  formik?: any;
  style?: any;
  checked?: boolean;
  required?: boolean;
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
  max?: number;
  min?: number;
  isTextArea?: boolean;
  rows?: number;
  maxNumber?: number;
  inputmode?: string;
  onClick?: () => void;
  inputBgColor?: string;
  iconPosition?: boolean;
};

const InputCheckbox: React.FC<InputProps> = ({
  labelStyle,
  icon,
  isIcon,
  iconClick,
  disabled,
  inputChange,
  style,
  onChangeValue,
  checked,
  value,
  type,
  labelName,
  autoComplete,
  inputMode,
  formik,
  onChange,
  required,
  name,
  min,
  max,
  isTextArea = false,
  rows = 5,
  maxNumber,
  onClick,
  inputBgColor,
  iconPosition,
  ...props
}) => {
  const isIconStyle = {
    padding: "0 50px",
  };
  return (
    <div className="input-container">
      {isTextArea ? (
        <textarea
          onClick={onClick}
          {...props}
          rows={rows}
          value={formik?.values[name] || value}
          onChange={formik?.handleChange || onChange}
          onBlur={formik?.handleBlur}
          name={name}
          style={style}
          className={`${
            formik?.touched[name] && formik?.errors[name] && "input-error"
          } input-custom`}
        />
      ) : (
        <input
          onClick={onClick}
          {...props}
          type={type || "text"}
          inputMode={inputMode || "text"}
          name={name}
          value={formik?.values[name] || value}
          checked={
            type === "radio"
              ? formik?.values[name] === value // Check if the value matches Formik's value
              : checked
          }
          onChange={(e) => {
            if (formik) {
              formik.setFieldValue(name, value); // Explicitly set the field to this radio's value
            }
            if (onChange) {
              onChange(e);
            }
          }}
          onBlur={formik?.handleBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          style={isIcon ? isIconStyle : style}
          className={`${
            formik?.touched[name] && formik?.errors[name] && "input-error"
          } input-custom ${inputBgColor}`}
        />
      )}
      {labelName && (
        <label
          style={labelStyle}
          className={`input-label ${
            formik?.touched[name] && formik?.errors[name] && "label-error"
          }`}
        >
          <span className="mx-2">{labelName}</span>
          <span className="mt-1">{required && "*"}</span>
        </label>
      )}
      {/* {formik?.touched[name] && formik?.errors[name] && (
        <div className="error">
          <span className="error" style={{ color: "red" }}>
            {formik.errors[name]}
          </span>
        </div>
      )} */}
    </div>
  );
};

export default InputCheckbox;
