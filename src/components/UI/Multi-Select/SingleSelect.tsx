import React from "react";
import Select, { SingleValue } from "react-select";
import "./MultiSelect.scss";
import { i18n } from "../../../utils";

type SingleSelectProps = {
  name: string;
  labelName?: string;
  options: { label: string; value: string | number }[];
  formik?: any;
  style?: any;
  required?: boolean;
  isSearchable?: boolean;
  className?: string;
  customStyles?: any;
  placeholder?: string;
  value?: { label: string; value: string | number } | null;
  readOnly?: boolean;
  onChange?: (option: { label: string; value: string } | any) => void;
  labelStyle?: any;
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  labelName,
  labelStyle,
  options,
  formik,
  name,
  style,
  required,
  isSearchable = true,
  className,
  customStyles = {},
  placeholder,
  value,
  onChange,
  readOnly = false,
  ...props
}) => {
  const hasError = formik?.touched[name] && formik?.errors[name];

  const defaultStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: "50px",
      minHeight: "50px",
      border: hasError ? "1px solid red" : "1px solid #7D7D7D", // Apply red border if there's an error
      borderRadius: "8px",
      borderColor: state.isFocused ? "var(--primary)" : null,
      boxShadow: "unset",
      "&:hover": {
        borderColor: "unset",
      },
      background: "transparent",
    }),
    menu: (base: any) => ({
      ...base,
      maxHeight: "160px",
      zIndex: "999",
      padding: "4px",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
      padding: "3px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
        ? "#f8f9fa"
        : base.backgroundColor,

      color: state.isFocused ? "#000" : base.color,
      "&:hover": {
        backgroundColor: "var(--primary)",
        color: "#fff",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    ...customStyles,
  };

  return (
    <div
      className={`position-relative single-select-container ${className}`}
      // style={{ ...style }}
      style={{ margin: "0.2rem" }}
    >
      {labelName && (
        <label
          style={{
            position: "absolute",
            top: "-12px",
            left: `${i18n.language === "en" && "10px"}`,
            right: `${i18n.language === "ar" && "10px"}`,
            backgroundColor: "var(--white)",
            zIndex: "1",
            color: "var(--gray)",
            ...labelStyle,
          }}
          className={`rounded single-select-label ${
            formik?.touched[name] && formik?.errors[name] && "label-error"
          }`}
        >
          <span className="mx-2">{labelName}</span>
          <span className="mt-1">{required && "*"}</span>
        </label>
      )}
      <Select
        isDisabled={readOnly}
        options={options}
        value={value}
        // onChange={(option: SingleValue<{ label: string; value: string  }>) => {
        //   if (option) {
        //     onChange?.(option);
        //     formik.setFieldValue(name, option.value);
        //   }
        // }}
        onChange={(
          option: SingleValue<{ label: string; value: string | number }>
        ) => {
          if (option) {
            // Convert value to string if it is a number before passing to onChange
            const convertedOption = {
              ...option,
              value: option.value.toString(),
            };
            onChange?.(convertedOption);
            formik && formik.setFieldValue(name, option.value);
          }
        }}
        onBlur={formik?.handleBlur}
        isSearchable={isSearchable}
        name={name}
        className={`${
          formik?.touched[name] ||
          (formik?.errors[name] && "single-select-error")
        } single-select-custom`}
        styles={defaultStyles || style}
        placeholder={placeholder}
        {...props}
      />
      {formik?.touched[name] && formik?.errors[name] && (
        <div className="error" style={{ padding: "0.3rem" }}>
          <span className="error" style={{ color: "red" }}>
            {formik?.errors[name]}
          </span>
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
