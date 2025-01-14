// MultiSelect.js
import React, { useState } from "react";
import Select from "react-select";
import "./MultiSelect.scss";
import { i18n } from "../../../utils";

type MultiSelectProps = {
  labelStyle?: any;
  name: string;
  labelName?: string;
  options: Array<{ value: string; label: string }>;
  formik?: any;
  style?: any;
  required?: boolean;
  isSearchable?: boolean;
  className?: string;
  isMulti?: boolean;
  customStyles?: any;
  placeholder?: string;
  value?: any;
  readOnly?: boolean;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  labelStyle,
  labelName,
  options,
  formik,
  name,
  style,
  required,
  isSearchable = true,
  className,
  isMulti = true,
  customStyles = {},
  placeholder,
  value,
  readOnly,
  ...props
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleChange = (selectedOptions: any) => {
    if (isMulti) {
      if (
        selectedOptions &&
        selectedOptions.some((option: any) => option.value === "select-all")
      ) {
        if (selectAll) {
          formik.setFieldValue(name, []);
        } else {
          formik.setFieldValue(
            name,
            options.map((option) => option.value)
          );
        }
        setSelectAll(!selectAll);
      } else {
        formik.setFieldValue(
          name,
          selectedOptions.map((option: any) => option.value)
        );
        setSelectAll(false);
      }
    } else {
      formik.setFieldValue(name, selectedOptions ? selectedOptions.value : "");
    }
  };

  const selectAllOption = {
    value: "select-all",
    label: selectAll ? "Deselect All" : "Select All",
  };

  const defaultStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: "50px",
      minHeight: "50px",
      border: `${
        formik?.touched[name] && formik?.errors[name]
          ? "1px solid red"
          : "1px solid #7D7D7D"
      }`,
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
      maxHeight: "150px",
      zIndex: "999",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
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
        backgroundColor: "var(--dark-gray)",
        color: "#fff",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    ...customStyles,
  };

  const selectedValue = isMulti
    ? formik.values[name] && Array.isArray(formik.values[name])
      ? formik.values[name]
          .map((val: string) => options.find((option) => option.value === val))
          .filter(Boolean)
      : []
    : options.find((option) => option.value === formik.values[name]);

  return (
    <div
      className={`position-relative multi-select-container my-2 ${className}`}
      style={{ ...style }}
    >
      {labelName && (
        <label
          // style={labelStyle}
          style={{
            position: "absolute",
            top: "-12px",
            // left: "10px",
            left: `${i18n.language === "en" && "10px"}`,
            right: `${i18n.language === "ar" && "10px"}`,
            backgroundColor: "var(--white-floating)",
            zIndex: "1",
            color: "var(--gray)",
          }}
          className={`rounded multi-select-label ${
            formik?.touched[name] && formik?.errors[name] && "label-error"
          }`}
        >
          <span className="mx-2">{labelName}</span>
          <span className="mt-1">{required && "*"}</span>
        </label>
      )}
      <Select
        isDisabled={readOnly}
        isMulti={isMulti}
        options={isMulti ? [selectAllOption, ...options] : options}
        // value={options.filter((option) =>
        //   formik.values[name].includes(option.value)
        // )}
        value={value ? value : selectedValue}
        onChange={handleChange}
        onBlur={formik?.handleBlur}
        isSearchable={isSearchable}
        name={name}
        className={`${
          formik?.touched[name] ||
          (formik?.errors[name] && "multi-select-error")
        } multi-select-custom`}
        styles={defaultStyles}
        placeholder={placeholder}
        {...props}
      />
      {formik?.touched[name] && formik?.errors[name] && (
        <div className="error">
          <span className="error" style={{ color: "red" }}>
            {formik?.errors[name]}
          </span>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
