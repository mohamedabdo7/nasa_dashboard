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

const Input: React.FC<InputProps> = ({
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (type === "number" && min !== undefined && +newValue < min) {
      // Convert min to string before assigning
      const minValueAsString = String(min);
      formik
        ? formik.setFieldValue(name, minValueAsString)
        : onChange &&
          onChange({
            ...e,
            target: { ...e.target, value: minValueAsString },
          });
    } else {
      // Call the original onChange handler
      formik ? formik.handleChange(e) : onChange && onChange(e);
    }
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
          onBlur={formik?.handleBlur || onblur}
          name={name}
          style={style}
          className={`${
            formik?.touched[name] && formik?.errors[name] && "input-error"
          } ${type && type === "checkbox" ? "input-checkbox" : "input-custom"}`}
          id=""
        />
      ) : (
        <input
          onClick={onClick}
          {...props}
          type={type || "text"}
          inputMode={inputMode || "text"}
          name={name}
          value={formik?.values[name] || value}
          onChange={handleChange}
          onBlur={formik?.handleBlur}
          checked={checked}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          style={isIcon ? isIconStyle : style}
          // style={style}
          className={`${
            formik?.touched[name] && formik?.errors[name] && "input-error"
          } ${
            type && type === "checkbox" ? "input-checkbox" : "input-custom"
          } ${inputBgColor}`}
        />
      )}
      {labelName && (
        <label
          style={labelStyle}
          className={`rounded "input-label" ${
            formik?.touched[name] && formik?.errors[name] && "label-error"
          }`}
        >
          <span className="mx-2">{labelName}</span>
          <span className="mt-1">{required && "*"}</span>
        </label>
      )}
      {isIcon ? (
        <img
          className="icon"
          style={iconPosition ? { right: "3% !important" } : { left: "3%" }}
          src={icon}
          alt="icon"
          onClick={iconClick}
        ></img>
      ) : null}

      {formik?.touched[name] && formik?.errors[name] && (
        <div className="error">
          {formik?.touched[name] && formik?.errors[name] ? (
            <span
              className="error"
              style={{ color: "red", display: "flex", flexWrap: "wrap" }}
            >
              {formik?.errors[name]}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Input;
