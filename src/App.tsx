import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import { routes } from "./constants";
import { ToastContainer } from "react-toastify";
import { toastOptions } from "./utils";
import {
  AddConsultant,
  AddContractor,
  AddEmployee,
  AddOperationalRequest,
  AddProject,
  Consultants,
  Contractors,
  EditConsultant,
  EditContractor,
  EditEmployee,
  EditProject,
  Employees,
  OperationalRequests,
  Projects,
  ViewConsultant,
  ViewContractor,
  ViewEmployee,
  ViewOperationalRequest,
  ViewProject,
} from "./pages";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Login from "./pages/Auth/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import OtpComponent from "./pages/Auth/OTP";
import NewPassword from "./pages/Auth/NewPassword";

function App() {
  return (
    <AuthProvider>
      {/* Wrap your app with AuthProvider */}
      <Routes>
        {/* Public routes */}
        <Route path={routes.SIGNIN} element={<Login />} />
        <Route path={routes.FORGET_PASSWORD} element={<ForgetPassword />} />
        <Route path={routes.OTP} element={<OtpComponent />} />
        <Route path={routes.RESET_PASSWORD} element={<NewPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute element={<Layout />} />}>
          {/* Employees */}
          <Route path={routes.EMPLOYEES}>
            <Route index element={<Employees />} />
            <Route path="add" element={<AddEmployee />} />
            <Route path="edit-employee/:id" element={<EditEmployee />} />
            <Route path="view-employee/:id" element={<ViewEmployee />} />
          </Route>
          {/* Contractors */}
          <Route path={routes.CONTRACTORS}>
            <Route index element={<Contractors />} />
            <Route path="add" element={<AddContractor />} />
            <Route path="edit-contractor/:id" element={<EditContractor />} />
            <Route path="view-contractor/:id" element={<ViewContractor />} />
          </Route>
          {/* Consultants */}
          <Route path={routes.CONSULTANTS}>
            <Route index element={<Consultants />} />
            <Route path="add" element={<AddConsultant />} />
            <Route path="edit-consultant/:id" element={<EditConsultant />} />
            <Route path="view-consultant/:id" element={<ViewConsultant />} />
          </Route>
          {/* Projects */}
          <Route path={routes.PROJECTS}>
            <Route index element={<Projects />} />
            <Route path="add" element={<AddProject />} />
            <Route path="edit-project/:id" element={<EditProject />} />
            <Route path="view-project/:id" element={<ViewProject />} />
          </Route>
          {/* Operational Requests */}
          <Route path={routes.OPERATIONALREQUESTS}>
            <Route index element={<OperationalRequests />} />
            <Route path="add" element={<AddOperationalRequest />} />
            <Route
              path="view-operational-request/:id"
              element={<ViewOperationalRequest />}
            />
          </Route>
        </Route>
      </Routes>
      <ToastContainer {...toastOptions} />
    </AuthProvider>
  );
}

export default App;
