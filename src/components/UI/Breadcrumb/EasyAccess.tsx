import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

type BreadcrumbItem = {
  text: string;
  link?: string;
};

type CustomBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  goBackOnClick?: { text: string; enabled: boolean };
};

const EasyAccess: React.FC<CustomBreadcrumbProps> = ({
  items,
  className,
  goBackOnClick,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "he"; // Add other RTL languages as needed
  const navigate = useNavigate();

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (goBackOnClick?.enabled && item.text === goBackOnClick.text) {
      navigate(-1); // Go back to the previous page
    }
  };
  return (
    <Breadcrumb dir={isRtl ? "rtl" : "ltr"} className={className}>
      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        const hasLink = !!item.link;

        return (
          <React.Fragment key={index}>
            {!isRtl && index > 0 && (
              <span
                style={{
                  color: "var(--primary)",
                  fontFamily: "var(--font-primary), sans-serif",
                }}
                className="breadcrumb-separator mx-1"
              >
                {" "}
                /{" "}
              </span>
            )}
            <Breadcrumb.Item
              active={isLastItem}
              linkAs={
                hasLink &&
                (!goBackOnClick?.enabled || item.text !== goBackOnClick.text)
                  ? Link
                  : "span"
              }
              linkProps={
                hasLink &&
                (!goBackOnClick?.enabled || item.text !== goBackOnClick.text)
                  ? { to: item.link }
                  : {}
              }
              onClick={() => handleBreadcrumbClick(item)}
              style={{
                cursor: hasLink ? "pointer" : "default",
                color: "",
              }}
            >
              {item.text}
            </Breadcrumb.Item>
            {isRtl && !isLastItem && (
              <span
                className="breadcrumb-separator mx-1"
                style={{ color: "var(--primary)" }}
              >
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};

export default EasyAccess;
