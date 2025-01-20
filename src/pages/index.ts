import { lazy } from "react";

// Lazy load the components and export them directly

// Employees
export const Employees = lazy(() => import("./Employees/EmployeesList"));
export const AddEmployee = lazy(() => import("./Employees/AddEmployee"));
export const EditEmployee = lazy(() => import("./Employees/EditEmployee"));
export const ViewEmployee = lazy(() => import("./Employees/ViewEmployee"));

// Contractors
export const Contractors = lazy(() => import("./Contractors/ContractorsList"));
export const AddContractor = lazy(() => import("./Contractors/AddContractor"));
export const EditContractor = lazy(
  () => import("./Contractors/EditContractor")
);
export const ViewContractor = lazy(
  () => import("./Contractors/ViewContractor")
);

// Consultants
export const Consultants = lazy(() => import("./Consultants/ConsultantsList"));
export const AddConsultant = lazy(() => import("./Consultants/AddConsultant"));
export const EditConsultant = lazy(
  () => import("./Consultants/EditConsultant")
);
export const ViewConsultant = lazy(
  () => import("./Consultants/ViewConsultant")
);

// Projects
export const Projects = lazy(() => import("./Projects/Projects/ProjectsList"));
export const AddProject = lazy(() => import("./Projects/Projects/AddProject"));
export const EditProject = lazy(
  () => import("./Projects/Projects/EditProject")
);
export const ViewProject = lazy(
  () => import("./Projects/Projects/ViewProject")
);

// Operational Requests
export const OperationalRequests = lazy(
  () => import("./Projects/OperationalRequests/OperationalRequests")
);
export const AddOperationalRequest = lazy(
  () => import("./Projects/OperationalRequests/AddRequest")
);
export const ViewOperationalRequest = lazy(
  () => import("./Projects/OperationalRequests/ViewRequest")
);
