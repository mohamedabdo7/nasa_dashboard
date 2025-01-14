import { Suspense } from "react";
import { Outlet } from "react-router-dom";
// import { Spinner, Menu } from '../components';
import "./Layout.scss";

import type { FC } from "react";
import Menu from "../components/Menu/Menu";
import { Spinner } from "react-bootstrap";
import MainNavbar from "../components/Navbar/MainNavbar";

const Layout: FC = () => {
  return (
    <div className="d-flex">
      <Menu />
      <div className="main-container">
        <MainNavbar />
        <div className="content">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Layout;
