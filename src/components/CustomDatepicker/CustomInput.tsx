import React from "react";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  readOnly?: boolean;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onClick,
  readOnly,
  placeholder,
}) => {
  return (
    <div className="custom-input-wrapper">
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly={readOnly} // To prevent typing in the input
        className="custom-input"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid var(--gray)",
          //   cursor: "pointer",
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomInput;
