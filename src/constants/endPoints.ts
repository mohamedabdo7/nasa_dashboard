export type ServiceData = {
  url: string;
  type: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
};

export type ServiceKeys = keyof typeof services;

export const services = {
  // Auth
  admin_login: { url: "/auth/v1/admin/login", type: "POST" },
  employee_login: { url: "/auth/v1/employee/login", type: "POST" },
  consultant_login: { url: "/auth/v1/consultant/login", type: "POST" },
  forgetPassword: { url: "auth/v1/dashboard/forget_password", type: "POST" },
  sendOtp: { url: "auth/v1/dashboard/otp", type: "POST" },
  updatePassword: { url: "auth/v1/dashboard/update_password", type: "PUT" },

  // employees
  getEmployees: { url: "employees/v1/admin", type: "GET" },
  createEmployee: { url: "employees/v1/admin", type: "POST" },
  updateEmployee: { url: "employees/v1/admin/{id}", type: "PUT" },
  deleteEmployee: { url: "employees/v1/admin/{id}", type: "DELETE" },
  getOneEmployee: { url: "employees/v1/admin/{id}", type: "GET" },

  // contractors
  getContractors: { url: "contractors/v1/admin", type: "GET" },
  createContractor: { url: "contractors/v1/admin", type: "POST" },
  updateContractor: { url: "contractors/v1/admin/{id}", type: "PUT" },
  deleteContractor: { url: "contractors/v1/admin/{id}", type: "DELETE" },
  getOneContractor: { url: "contractors/v1/admin/{id}", type: "GET" },

  // Consultants
  getConsultants: { url: "consultants/v1/admin", type: "GET" },
  createConsultant: { url: "consultants/v1/admin", type: "POST" },
  updateConsultant: { url: "consultants/v1/admin/{id}", type: "PUT" },
  deleteConsultant: { url: "consultants/v1/admin/{id}", type: "DELETE" },
  getOneConsultant: { url: "consultants/v1/admin/{id}", type: "GET" },

  // Projects admin
  getProjects: { url: "projects/v1/admin", type: "GET" },
  createProject: { url: "projects/v1/admin", type: "POST" },
  updateProject: { url: "projects/v1/admin/{id}", type: "PUT" },
  deleteProject: { url: "projects/v1/admin/{id}", type: "DELETE" },
  getOneProject: { url: "projects/v1/admin/{id}", type: "GET" },

  // Projects employee
  getProjectsForEmp: { url: "projects/v1/employee", type: "GET" },
  getOneProjectForEmp: { url: "projects/v1/employee/{id}", type: "GET" },

  // Projects consultant
  getProjectsForConsultant: { url: "projects/v1/consultant", type: "GET" },
  getOneProjectForConsultant: {
    url: "projects/v1/consultant/{id}",
    type: "GET",
  },

  // operationalRequests
  getOperationalRequests: {
    url: "/project_requests/v1/employee/project",
    type: "GET",
  },
  getOperationalRequestsForEmp: {
    url: "/projects/v1/employee",
    type: "GET",
  },
  createOperationalRequest: {
    url: "project_requests/v1/employee",
    type: "POST",
  },
  getOneOperationalRequest: {
    url: "/project_requests/v1/employee/project/{id}",
    type: "GET",
  },

  // departments
  getDepartments: { url: "departments/v1/admin", type: "GET" },
  // roles
  getRoles: { url: "roles/v1/admin", type: "GET" },

  // services
  getServices: {
    url: "our_services/services/v1/dashboard/",
    type: "GET",
  },
  getOneService: {
    // Get a single service by its ID
    url: "our_services/services/v1/dashboard/{id}",
    type: "GET",
  },
  createService: {
    // Create a new service
    url: "our_services/services/v1/dashboard/",
    type: "POST",
  },
  updateService: {
    // Update an existing service by its ID
    url: "our_services/services/v1/dashboard/{id}",
    type: "PUT",
  },
  deleteService: {
    // Delete a service by its ID
    url: "our_services/services/v1/dashboard/{id}",
    type: "DELETE",
  },

  // images
  uploadImage: { url: "upload/v1/admin/file", type: "POST" },
  uploadMultibleImages: { url: "upload/v1/admin/files", type: "POST" },
  deleteImage: { url: "upload/v1/admin/{filename}", type: "DELETE" },
} as const;
