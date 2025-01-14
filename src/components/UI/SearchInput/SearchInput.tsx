import React from "react";
import "./SearchInput.scss";

type InputProps = {
  iconClick?: () => void;
  inputChange?: (value: string) => void;
  name?: string;
  value: string;
  leftIcon?: any;
  rightIcon?: any;
  placeholder?: string;
  type?: string;
  labelName?: string;
  icon?: string;
  isIcon?: boolean;
  className?: string;
  onChange?: any;
  inputMode?: "text" | "search" | undefined;
};

const SearchInput: React.FC<InputProps> = ({
  icon,
  isIcon,
  iconClick,
  leftIcon,
  rightIcon,
  // disabled,
  inputChange,
  // onChangeValue,
  type,
  labelName,
  // autoComplete,
  inputMode,
  onChange,
  name,
  value,
  className,
  ...props
}) => {
  return (
    <div className="input__container">
      {leftIcon && <div className="left-icon">{leftIcon}</div>}
      <input
        {...props}
        type={type || "text"}
        inputMode={inputMode || "text"}
        name={name}
        onChange={onChange}
        value={value}
        // disabled={disabled}
        // autoComplete={autoComplete}
        className={`input ${className}`}
      />
      {labelName && <label className={`"input-label" `}>{labelName}</label>}
      {rightIcon && <div className="right-icon">{rightIcon}</div>}
    </div>
  );
};

export default SearchInput;
