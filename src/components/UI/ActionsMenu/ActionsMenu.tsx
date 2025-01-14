import { Dropdown, Stack } from "react-bootstrap";
import "./actions.scss";
import { FC } from "react";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { i18n } from "../../../utils";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdEye } from "react-icons/io";

type actionProps = {
  color?: string;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  row?: any;
  style?: any;
};

const ActionsMenu: FC<actionProps> = ({
  onEdit,
  onView,
  onDelete,
  color = "var(--primary)",
  style,
}) => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        textAlign: i18n.language === "en" ? "right" : "left",
        ...style,
      }}
    >
      <Dropdown className="no-arrow bg-transparent">
        <Dropdown.Toggle id="dropdown-basic">
          <HiDotsVertical style={{ fontSize: "17px", color: color }} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {onView && (
            <Dropdown.Item onClick={onView}>
              <Stack
                direction="horizontal"
                className="align-items-center"
                gap={2}
                style={{ color: "var(--primary)" }}
              >
                <IoMdEye />
                <span>{t("actions.view")}</span>
              </Stack>
            </Dropdown.Item>
          )}
          {onEdit && (
            <Dropdown.Item onClick={onEdit}>
              <Stack
                direction="horizontal"
                className="align-items-center"
                gap={2}
                style={{ color: "var(--primary)" }}
              >
                <MdEdit />
                <span>{t("actions.edit")}</span>
              </Stack>
            </Dropdown.Item>
          )}
          {onDelete && (
            <Dropdown.Item onClick={() => onDelete && onDelete()}>
              <Stack
                direction="horizontal"
                className="align-items-center"
                gap={2}
                style={{ color: "var(--error-color)" }}
              >
                <MdDeleteForever />
                <span>{t("actions.delete")}</span>
              </Stack>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ActionsMenu;
