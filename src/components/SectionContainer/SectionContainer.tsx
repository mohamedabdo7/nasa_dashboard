import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  header?: ReactNode; // Optional header prop
}

const SectionContainer: React.FC<ContainerProps> = ({ children, header }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#FFF",
    padding: "20px",
    borderRadius: "8px",
    // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
    position: "relative",
  };

  return (
    <div style={containerStyle}>
      {header && (
        <div
          style={{
            marginBottom: "10px",
            fontWeight: "700",
            fontSize: "22px",
            color: "var(--primary)",
          }}
        >
          {header}
        </div>
      )}
      {children}
    </div>
  );
};

export default SectionContainer;
