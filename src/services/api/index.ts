export interface ApiResponse<T> {
  data: T;
}

import {
  Consultant,
  Contractor,
  CreateConsultantPayload,
  CreateConsultantResponse,
  CreateContractorPayload,
  CreateContractorResponse,
  CreateEmployeePayload,
  CreateEmployeeResponse,
  CreateProjectPayload,
  CreateRequestPayload,
  Project,
  ProjectResponse,
  ProjectsListResponse,
  UpdateProjectPayload,
} from "../../types/Employee";
import {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginPayload,
  LoginResponse,
  UserType,
} from "../../types/login";
import api from "./api";

// Auth
export const AdminloginService = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  try {
    return await api.send<ApiResponse<LoginResponse>>(
      "admin_login",
      payload as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const EmployeeloginService = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  try {
    return await api.send<ApiResponse<LoginResponse>>(
      "employee_login",
      payload as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const ConsultantloginService = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  try {
    return await api.send<ApiResponse<LoginResponse>>(
      "consultant_login",
      payload as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const loginService = async (
  payload: LoginPayload
  // ): Promise<ApiResponse<LoginResponse>> => {
): Promise<any> => {
  try {
    // Define the mapping for user types to their respective endpoints
    const endpoints: Record<
      UserType,
      "admin_login" | "employee_login" | "consultant_login"
    > = {
      Admin: "admin_login",
      Employee: "employee_login",
      Consultant: "consultant_login",
    };

    // Ensure the selected endpoint is one of the allowed values
    const endpoint = endpoints[payload.type];
    if (!endpoint) {
      throw new Error(`Unsupported user type: ${payload.type}`);
    }

    // Call the API with the correct endpoint
    return await api.send<ApiResponse<LoginResponse>>(
      endpoint,
      payload as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const forgetPasswordService = async (
  payload: ForgetPasswordPayload
): Promise<ApiResponse<ForgetPasswordResponse>> => {
  try {
    return await api.send<ApiResponse<ForgetPasswordResponse>>(
      "forgetPassword",
      payload as unknown as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error in forgot password service:", error);
    throw error;
  }
};

export const sendOtpService = async (payload: {
  email: string;
  otp: string;
}): Promise<ApiResponse<{ message: string }>> => {
  try {
    return await api.send<ApiResponse<{ message: string }>>(
      "sendOtp", // Replace with the actual endpoint
      payload as unknown as Record<string, unknown>
    );
  } catch (error) {
    console.error("Error in send OTP service:", error);
    throw error;
  }
};

export const updatePassword = async (payload: {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}): Promise<any> => {
  try {
    return await api.send<any>(
      "updatePassword", // Replace with the actual endpoint
      payload
    );
  } catch (error) {
    console.error("Error in send OTP service:", error);
    throw error;
  }
};

// Employees
export const getEmployees = async (payload?: {
  pageNumber?: number;
  limit?: number;
  search?: string;
}): Promise<any> => {
  try {
    return await api.send<any>("getEmployees", payload);
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<CreateEmployeeResponse> => {
  try {
    const response = await api.send<CreateEmployeeResponse>(
      "createEmployee",
      { ...payload } // Spread the payload to match API requirements
    );
    return response; // Return the API response
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const getOneEmployee = async (id: string): Promise<any> => {
  try {
    // Send request to fetch a single employee using the employee ID
    return await api.send<any>("getOneEmployee", { id });
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

export const updateEmployee = async (
  id: string,
  payload: CreateEmployeePayload
): Promise<CreateEmployeeResponse> => {
  try {
    // Send request to update employee details using the employee ID and the payload
    const response = await api.send<CreateEmployeeResponse>(
      "updateEmployee",
      { id, ...payload } // Combine the ID with the payload to match the API
    );
    return response;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<any> => {
  try {
    // Send request to delete the employee using the employee ID
    return await api.send<any>("deleteEmployee", { id });
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Contractors
export const getContractors = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<{ contractors: Contractor[]; total: number }> => {
  try {
    const response = await api.send<{
      contractors: Contractor[];
      total: number;
    }>("getContractors", payload);
    return response;
  } catch (error) {
    console.error("Error fetching contractors:", error);
    throw error;
  }
};

export const createContractor = async (
  payload: CreateContractorPayload
): Promise<CreateContractorResponse> => {
  try {
    const response = await api.send<CreateContractorResponse>(
      "createContractor",
      { ...payload } // Spread the payload to match API requirements
    );
    return response;
  } catch (error) {
    console.error("Error creating contractor:", error);
    throw error;
  }
};

export const getOneContractor = async (id: string): Promise<Contractor> => {
  try {
    const response = await api.send<Contractor>("getOneContractor", { id });
    return response;
  } catch (error) {
    console.error("Error fetching contractor:", error);
    throw error;
  }
};

export const updateContractor = async (
  id: string,
  payload: CreateContractorPayload
): Promise<CreateContractorResponse> => {
  try {
    const response = await api.send<CreateContractorResponse>(
      "updateContractor",
      { id, ...payload } // Combine the ID with the payload to match the API
    );
    return response;
  } catch (error) {
    console.error("Error updating contractor:", error);
    throw error;
  }
};

export const deleteContractor = async (id: string): Promise<void> => {
  try {
    await api.send<void>("deleteContractor", { id });
  } catch (error) {
    console.error("Error deleting contractor:", error);
    throw error;
  }
};

// Consultants
export const getConsultants = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<{ consultants: Consultant[]; total: number }> => {
  try {
    const response = await api.send<{
      consultants: Consultant[];
      total: number;
    }>("getConsultants", payload);
    return response;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    throw error;
  }
};

export const createConsultant = async (
  payload: CreateConsultantPayload
): Promise<CreateConsultantResponse> => {
  try {
    const response = await api.send<CreateConsultantResponse>(
      "createConsultant",
      { ...payload } // Spread the payload to match API requirements
    );
    return response;
  } catch (error) {
    console.error("Error creating consultant:", error);
    throw error;
  }
};

export const getOneConsultant = async (id: string): Promise<Consultant> => {
  try {
    const response = await api.send<Consultant>("getOneConsultant", { id });
    return response;
  } catch (error) {
    console.error("Error fetching consultant:", error);
    throw error;
  }
};

export const updateConsultant = async (
  id: string,
  payload: CreateConsultantPayload
): Promise<CreateConsultantResponse> => {
  try {
    const response = await api.send<CreateConsultantResponse>(
      "updateConsultant",
      { id, ...payload } // Combine the ID with the payload to match the API
    );
    return response;
  } catch (error) {
    console.error("Error updating consultant:", error);
    throw error;
  }
};

export const deleteConsultant = async (id: string): Promise<void> => {
  try {
    await api.send<void>("deleteConsultant", { id });
  } catch (error) {
    console.error("Error deleting consultant:", error);
    throw error;
  }
};

// Projects
export const getProjects = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<ProjectsListResponse> => {
  try {
    const response = await api.send<ProjectsListResponse>(
      "getProjects",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (
  payload: CreateProjectPayload
): Promise<ProjectResponse> => {
  try {
    const response = await api.send<ProjectResponse>("createProject", payload);
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getOneProject = async (id: string): Promise<Project> => {
  try {
    const response = await api.send<Project>("getOneProject", { id });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  payload: UpdateProjectPayload
): Promise<ProjectResponse> => {
  try {
    const response = await api.send<ProjectResponse>("updateProject", {
      id,
      ...payload,
    });
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.send<void>("deleteProject", { id });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Employees projects
export const getProjectsForEmp = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<ProjectsListResponse> => {
  try {
    const response = await api.send<ProjectsListResponse>(
      "getProjectsForEmp",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
export const getOneProjectForEmp = async (id: string): Promise<Project> => {
  try {
    const response = await api.send<Project>("getOneProjectForEmp", { id });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Employees consultants
export const getProjectsForConsultant = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<ProjectsListResponse> => {
  try {
    const response = await api.send<ProjectsListResponse>(
      "getProjectsForConsultant",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
export const getOneProjectForConsultant = async (
  id: string
): Promise<Project> => {
  try {
    const response = await api.send<Project>("getOneProjectForConsultant", {
      id,
    });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Operational Requests
export const getGlobalOperationalRequests = async (payload?: {
  pageNumber?: number;
  limit?: number;
  id?: string;
}): Promise<any> => {
  try {
    const response = await api.send<any>(
      "getGlobalOperationalRequests",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};
export const getOperationalRequestsForEmp = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<any> => {
  try {
    const response = await api.send<any>(
      "getOperationalRequestsForEmp",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createOperationalRequest = async (
  payload: CreateRequestPayload
): Promise<any> => {
  try {
    const response = await api.send<any>("createOperationalRequest", payload);
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
export const createOperationalRequestEmp = async (
  payload: CreateRequestPayload
): Promise<any> => {
  try {
    const response = await api.send<any>(
      "createOperationalRequestEmp",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
export const createOperationalRequestCons = async (
  payload: CreateRequestPayload
): Promise<any> => {
  try {
    const response = await api.send<any>(
      "createOperationalRequestCons",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getOneOperationalRequest = async (id: string): Promise<any> => {
  try {
    const response = await api.send<any>("getOneOperationalRequest", { id });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
export const getOneOperationalRequestEmp = async (id: string): Promise<any> => {
  try {
    const response = await api.send<any>("getOneOperationalRequestEmp", { id });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
export const getOneOperationalRequestCons = async (
  id: string
): Promise<any> => {
  try {
    const response = await api.send<any>("getOneOperationalRequestCons", {
      id,
    });
    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const updateRequestStatus = async (
  id: string,
  status?: boolean,
  consultantComment?: string
): Promise<any> => {
  try {
    const response = await api.send<any>("updateRequestStatus", {
      id,
      status,
      consultantComment,
    });
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// departments
export const getDepartments = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<any> => {
  try {
    return await api.send<any>("getDepartments", payload);
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// roles
export const getRoles = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<any> => {
  try {
    return await api.send<any>("getRoles", payload);
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

// Services
// Service to get all services
export const getServices = async (payload?: {
  pageNumber?: number;
  limit?: number;
}): Promise<any> => {
  try {
    return await api.send<any>("getServices", payload);
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Service to get one service by ID
export const getOneService = async (id: string): Promise<any> => {
  try {
    return await api.send<any>("getOneService", { id });
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

// Service to create a new service
export const createService = async (payload: any): Promise<any> => {
  try {
    await api.send<any>("createService", { ...payload });
  } catch (error) {
    console.error("Error creating Service:", error);
    throw error;
  }
};

// Service to update an existing service by ID
export const updateService = async (id: string, payload: any): Promise<any> => {
  try {
    await api.send<any>("updateService", { ...payload, id });
  } catch (error) {
    console.error("Error updating Service:", error);
    throw error;
  }
};

// Service to delete a service by ID
export const deleteService = async (id: string): Promise<any> => {
  try {
    await api.send<any>("deleteService", { id });
  } catch (error) {
    console.error("Error deleting Service:", error);
    throw error;
  }
};

// images
export const uploadImage = async (payload: FormData) =>
  await api.upload<{ url: string }>("uploadImage", payload, {});

export const uploadMultibleImages = async (payload: FormData) =>
  await api.upload<{ data: { urls: string[] } }>(
    "uploadMultibleImages",
    payload,
    {}
  );

export const deleteImage = async (payload: { filename: string }) =>
  await api.send<{ data: { fileName: string }; message: string }>(
    "deleteImage",
    payload
  );
