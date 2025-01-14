import { CSSProperties, FC } from "react";
import { Stack } from "react-bootstrap";

type infoCardProps = {
  heading: any;
  info: any;
  Icon?: any;
  image?: any;
  primary?: boolean;
  noWrap?: boolean;
  onClick?: any;
  extraContent?: string;
  underlineInfo?: boolean;
};

const InfoCard: FC<infoCardProps> = ({
  heading,
  info,
  Icon,
  image,
  primary = true,
  noWrap = true,
  onClick,
  extraContent,
  underlineInfo = false,
}) => {
  const addDesign = (): CSSProperties => {
    if (noWrap) {
      return {
        // textTransform: "lowercase",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      };
    } else {
      return {
        wordWrap: "break-word",
      };
    }
  };

  return (
    <Stack
      direction="vertical"
      className="w-100 p-3 rounded-2 justify-content-between align-items-between mb-2"
      style={{ backgroundColor: "var(--secondary)", minHeight: "80px" }}
      gap={1}
    >
      <Stack
        direction="horizontal"
        className="align-items-center justify-content-start"
        gap={2}
        style={{
          color: `${primary ? "var(--primary)" : "var(--error)"}`,
        }}
      >
        {Icon}
        {image && (
          <img
            src={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + image}
            alt="image"
            style={{ width: "18px", height: "18px", borderRadius: "50%" }}
          />
        )}
        <h6 style={{ fontSize: "14px" }} className="m-0 p-0 fw-bold ">
          {heading}
        </h6>
      </Stack>
      <div
        className="m-0"
        // style={{
        //   color: "var(--primary)",
        //   fontSize: "14px",
        // }}

        style={{
          ...addDesign(),
          maxWidth: "100%",
          fontSize: "14px",
          fontWeight: "400",
          color: "var(--primary)",
          textDecoration: `${underlineInfo ? "underline" : "none"}`,
        }}
      >
        {info}
        {extraContent && (
          <span
            style={{
              textDecorationLine: "underline",
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--secondary)",
            }}
            role="button"
            onClick={onClick}
          >
            {extraContent}
          </span>
        )}
      </div>
    </Stack>
  );
};

export default InfoCard;
