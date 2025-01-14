import type { FC } from "react";
import "./CustomSpinner.scss";

const CustomSpinner: FC<{ type?: "full" | "small" }> = ({ type = "full" }) => {
  return (
    <>
      {type === "full" ? (
        <div className="loader-container">
          <div className="loader" />
        </div>
      ) : (
        <div className="small-container">
          <span />
        </div>
      )}
    </>
  );
};

export default CustomSpinner;
