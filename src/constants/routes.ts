const routes = {
  // Auth
  SIGNIN: "/",
  FORGET_PASSWORD: "/forget-password",
  OTP: "/otp",
  RESET_PASSWORD: "/reset-password",

  // Employees
  EMPLOYEES: "/employees",
  ADDEMPLOYEE: "/employees/add",
  EDITEMPLOYEE: "/employees/edit-employee/:id",
  VIEWEMPLOYEE: "/employees/view-employee/:id",

  // Contractors
  CONTRACTORS: "/contractors",
  ADDCONTRACTOR: "/contractors/add",
  EDITCONTRACTOR: "/contractors/edit-contractor/:id",
  VIEWCONTRACTOR: "/contractors/view-contractor/:id",

  // Consultants
  CONSULTANTS: "/consultants",
  ADDCONSULTANT: "/consultants/add",
  EDITCONSULTANT: "/consultants/edit-consultant/:id",
  VIEWCONSULTANT: "/consultants/view-consultant/:id",

  // Projects
  PROJECTS: "/projects",
  ADDPROJECT: "/projects/add",
  EDITPROJECT: "/projects/edit-project/:id",
  VIEWPROJECT: "/projects/view-project/:id",
};

export default routes;
