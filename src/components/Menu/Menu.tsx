import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
// import { useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { useState } from "react";

import "./Menu.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { routes } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { MdSupervisorAccount } from "react-icons/md";
import { i18n } from "../../utils";
import Button from "../UI/Button";
import { useAuth } from "../../context/AuthContext";
import { logo } from "../../assets/images";

const MySidebar = () => {
  // const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActiveRoute = (route: string) => {
    const currentPathSegments = location.pathname.split("/").filter(Boolean);
    const routeSegments = route.split("/").filter(Boolean);
    return currentPathSegments[0] === routeSegments[0];
  };
  const toggleSidebar = () => setCollapsed(!collapsed);
  const isSubmenuActive = (submenuRoutes: any[]) => {
    return submenuRoutes.some((route) => isActiveRoute(route));
  };

  const menuItemStyle = (route: any, submenuRoutes: any[] = []) => ({
    fontSize: "small",
    padding: "0",
    background:
      isActiveRoute(route) || isSubmenuActive(submenuRoutes)
        ? "#0c1f38"
        : "#EBF0FF",
    color:
      isActiveRoute(route) || isSubmenuActive(submenuRoutes)
        ? "#FFF"
        : "#0c1f38",
    margin: "1rem 0",
    borderRadius: "8px",
  });

  const submenuItemStyle = (route: any) => ({
    background: isActiveRoute(route) ? "#trasparent" : "",
    fontWeight: isActiveRoute(route) ? "700" : "400",
    color: isActiveRoute(route) ? "#0c1f38" : "#568df5",
    margin: "0.5rem 0",
    borderRadius: "8px",
    padding: "0.5rem 0.4rem ",
    height: "36px",
  });

  const linkStyle = {
    padding: "40px !important",
    height: "100%",
    fontSize: "small",
    lineHeight: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const toggleStyle: any = {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: "2001",
    border: "0",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    background: "#EBF0FF",
    borderRadius: "5px",
  };
  const toggleStyleCollapsed: any = {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: "1000",
    border: "0",
    transform: "translate(-50%, -50%)",
    background: "#0c1f38",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "30px",
    height: "30px",
    borderRadius: "5px",
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/");
  };

  return (
    <div
      style={{
        background: "#FFF",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        zIndex: "1001",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        // width: "270px",
      }}
    >
      <div className="burger" style={{ position: "relative", height: "8%" }}>
        <button
          onClick={toggleSidebar}
          style={collapsed ? toggleStyle : toggleStyleCollapsed}
        >
          <GiHamburgerMenu />
        </button>
      </div>
      <div className="logo d-flex justify-content-center mt-3 ">
        <img
          src={logo}
          style={
            !collapsed
              ? {
                  width: "95px",
                  //cursor: "pointer"
                }
              : {
                  width: "65px",
                  // cursor: "pointer"
                }
          }
          alt="logo"
          // onClick={() => {
          //   navigate(routes.HOME);
          // }}
        />
      </div>
      <Sidebar
        collapsed={collapsed}
        rootStyles={{ margin: "1rem", border: "unset", fontSize: "14px" }}
      >
        <Menu rootStyles={{ background: "transparent" }}>
          {/* Employees */}
          {user.type === "Admin" && (
            <MenuItem
              icon={<MdSupervisorAccount />}
              className="no-hover-effect"
              rootStyles={menuItemStyle(routes.EMPLOYEES)}
              component={<Link to={routes.EMPLOYEES} />}
            >
              {t("sidebar.employees")}
            </MenuItem>
          )}

          {/* Contractors */}
          {user.type === "Admin" && (
            <MenuItem
              icon={<MdSupervisorAccount />}
              className="no-hover-effect"
              rootStyles={menuItemStyle(routes.CONTRACTORS)}
              component={<Link to={routes.CONTRACTORS} />}
            >
              {t("sidebar.contractors")}
            </MenuItem>
          )}

          {/* Consultants */}
          {user.type === "Admin" && (
            <MenuItem
              icon={<MdSupervisorAccount />}
              className="no-hover-effect"
              rootStyles={menuItemStyle(routes.CONSULTANTS)}
              component={<Link to={routes.CONSULTANTS} />}
            >
              {t("sidebar.consultants")}
            </MenuItem>
          )}

          {/* services */}
          <Menu
            renderExpandIcon={({ open }) => (
              <span>
                {i18n.language === "ar" ? (
                  open ? (
                    <IoIosArrowDown />
                  ) : (
                    <IoIosArrowBack />
                  )
                ) : open ? (
                  <IoIosArrowDown />
                ) : (
                  <IoIosArrowForward />
                )}
              </span>
            )}
          >
            <SubMenu
              icon={<MdSupervisorAccount />}
              label={t("sidebar.projects")}
              rootStyles={menuItemStyle("Projects", [
                routes.PROJECTS,
                routes.OPERATIONALREQUESTS,
              ])}
              style={{
                fontSize: "small",
              }}
            >
              {/* Submenu items with custom active style */}
              <MenuItem
                rootStyles={submenuItemStyle(routes.PROJECTS)}
                component={<Link to={routes.PROJECTS} style={linkStyle} />}
              >
                {t("sidebar.projects")}
              </MenuItem>
              {/* {user.type === "Employee" && ( */}
              <MenuItem
                rootStyles={submenuItemStyle(routes.OPERATIONALREQUESTS)}
                component={
                  <Link to={routes.OPERATIONALREQUESTS} style={linkStyle} />
                }
              >
                {t("sidebar.operationalRequests")}
              </MenuItem>
              {/* )} */}
            </SubMenu>
          </Menu>
        </Menu>
      </Sidebar>
      <Button text="Logout" onClick={handleLogout} />
    </div>
  );
};
export default MySidebar;
