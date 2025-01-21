import { FC, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useTranslation } from "react-i18next";
// import backgroundImage from "../../assets/icons/andoramask.svg";
// import backgroundImageRight from "../../assets/icons/andoramaskright.svg";
import { useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { allPermissions, routes } from "../../constants";

import "./MainNavbar.scss";
// import NotifyBox from "../NotifyBox/NotifyBox";
// import { State } from "../../types/state";
// import Button from "../UI/Button";
// import { IoLogOutOutline } from "react-icons/io5";
// import { hasPermission } from "../../utils/hasPermission";
// import { signout } from "../../store/reducers/auth-slice";
const MainNavbar: FC = () => {
  const { t, i18n } = useTranslation();
  // const dispatch = useDispatch();
  const location = useLocation();
  // const navigate = useNavigate();
  const [place, setPlace] = useState("");

  // const { user } = useSelector((state: State) => state.auth);

  const ChangeLangHandler = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  const containerStyle = {
    // backgroundImage:
    //   i18n.language === "en"
    //     ? `url(${backgroundImage})`
    //     : `url(${backgroundImageRight})`,
    backgroundSize: "initial",
    backgroundPosition: i18n.language === "en" ? "-14% 42%" : "113% 44%",
    backgroundRepeat: "no-repeat",
    height: "74px",
    paddingLeft: "1.1rem",
    paddingRight: "1.1rem",
    zIndex: "1000",
    backgroundColor: "#FFF",
    text: "white",
  };

  const enStyle = {
    cursor: "pointer",
    color: `${i18n.language === "en" ? "var(--primary)" : "var(--primary)"}`,
  };
  const arStyle = {
    cursor: "pointer",
    color: `${i18n.language === "en" ? "var(--primary)" : "var(--primary)"}`,
  };

  useEffect(() => {
    setPlace(location.pathname.split("/")[1]);
  }, [location, i18n.language]);

  return (
    <Navbar sticky="top" style={containerStyle} className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="">
          {
            !place ? (
              <div className="fw-bold" style={{ color: "var(--primary)" }}>
                {t(`breadcrumbs.employees`)}
              </div>
            ) : (
              <div className="fw-bold" style={{ color: "var(--primary)" }}>
                {t(`breadcrumbs.${place}`)}
              </div>
            )

            // t("navbar.home")
          }
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Stack direction="horizontal" gap={3}>
            <Navbar.Text>
              <span
                style={enStyle}
                onClick={i18n.language === "ar" ? ChangeLangHandler : () => {}}
              >
                En
              </span>
              <span className="mx-2" style={{ color: "#6FCCDD" }}>
                |
              </span>
              <span
                style={arStyle}
                onClick={i18n.language === "en" ? ChangeLangHandler : () => {}}
              >
                عربى
              </span>
            </Navbar.Text>
          </Stack>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
