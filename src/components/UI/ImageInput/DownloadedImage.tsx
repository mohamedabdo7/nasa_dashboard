import { FC, useState } from "react";
import { HiDownload } from "react-icons/hi";

type Props = { image: string };

const DownloadedImage: FC<Props> = ({ image }) => {
  const [show, setShow] = useState(false);
  return (
    <a
      className="rounded"
      href={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + image}
      target="_blank"
      style={{
        width: "70px",
        height: "70px",
        fontSize: "25px",
        position: "relative",
        cursor: "pointer",
      }}
      download={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + image}
      title="Download"
    >
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="d-flex align-items-center justify-content-center rounded"
        style={{
          width: "70px",
          height: "70px",
          fontSize: "25px",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <img
          className="w-100 h-100 rounded"
          src={import.meta.env.VITE_ANDORA_URL_IMAGES_URL + image}
          alt="avatar"
        />

        <div
          className={`${
            show ? "d-flex" : "d-none"
          } align-items-center justify-content-center rounded`}
          style={{
            width: "70px",
            height: "70px",
            fontSize: "25px",
            position: "absolute",
            color: "white",
            backgroundColor: "#18586099",
            top: "0",
            left: "0",
          }}
        >
          <HiDownload />
        </div>
      </div>
    </a>
  );
};

export default DownloadedImage;
