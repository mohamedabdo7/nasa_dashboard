import { FC, CSSProperties } from "react";

type Props = {
  title: string;
  style?: CSSProperties; // Optional style prop
};

const SectionHeader: FC<Props> = ({ title, style }) => {
  return (
    <h4 className="fw-bold mb-4" style={{ fontSize: "22px", ...style }}>
      {title}
    </h4>
  );
};

export default SectionHeader;
