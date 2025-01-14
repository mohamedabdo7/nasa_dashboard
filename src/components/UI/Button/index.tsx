import type { FC, ButtonHTMLAttributes } from "react";
import "./Button.scss";
import { Stack } from "react-bootstrap";
import CustomSpinner from "../Spinner";

export type BtnStypeClass =
  | "outline"
  | "secondary"
  | "modal-confirm"
  | "dangerous"
  | "active"
  | "outline-danger"
  | "dark-gray"
  | "";

type ButtonFieldProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  loading?: boolean;
  isIconOnly?: boolean;
  icon?: string;
  styleType?: BtnStypeClass;
  classStyle?: string;
  endIcon?: any;
  startIcon?: any;
  // textStyle?:
};

const Button: FC<ButtonFieldProps> = ({
  isIconOnly,
  icon,
  text,
  styleType,
  loading,
  disabled,
  type = "button",
  classStyle,
  endIcon,
  startIcon,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`d-flex justify-content-center align-items-center btn-content ${
        styleType || ""
      } ${icon ? "no-hover" : ""} ${
        isIconOnly ? "isIconOnly" : ""
      } ${classStyle}`}
      // style={{
      //   padding: text && icon ? "4px 10px" : text ? "5px 10px" : "2px",
      // }}
      type={type}
      disabled={loading || disabled}
    >
      {loading ? (
        <CustomSpinner type="small" />
      ) : icon ? (
        <div>
          <img src={icon} alt="" />
        </div>
      ) : null}
      {/* {text && ( */}
      <Stack
        direction="horizontal"
        className={`gap-2 d-flex ${
          endIcon
            ? "justify-content-between  align-items-center"
            : "justify-content-center  align-items-center"
        } `}
      >
        {startIcon ? <span>{startIcon}</span> : null}
        {text && !loading ? <span>{text}</span> : null}
        {/* {loading ? <Spinner /> : <span>{text}</span>} */}
        {endIcon ? <span>{endIcon}</span> : null}
      </Stack>
      {/* )} */}
    </button>
  );
};

export default Button;
