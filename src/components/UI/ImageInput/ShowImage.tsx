import { FC } from "react";

type Props = { image: string; title: string };

const ShowImage: FC<Props> = ({ image, title }) => {
  return (
    <div className="d-flex align-items-center gap-2 mb-2 justify-content-center">
      {image && (
        <div
          className="d-flex align-items-center justify-content-center rounded"
          style={{
            width: "70px",
            height: "70px",
            fontSize: "25px",

            //   backgroundColor: "#ddd", // border: "2px dashed #28334A",
          }}
        >
          <img
            className="w-100 h-100 rounded"
            src={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + image}
            alt="avatar"
          />
        </div>
      )}
      <span
        style={{
          color: "var(--primary)",

          fontSize: "16px",

          fontWeight: "700",

          textTransform: "capitalize",
        }}
      >
        {title}
      </span>
    </div>
  );
};

export default ShowImage;
