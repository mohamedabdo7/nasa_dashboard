export interface CreateEmployeePayload {
  name: string; // Employee name
  email: string; // Employee email
  password: string; // Employee password
  confirmPassword: string; // Confirm password
  roleId?: string; // Optional role ID
  image?: string; // Optional employee image
}

// Define the response type if applicable (update based on your API response)
export interface CreateEmployeeResponse {
  success: boolean;
  message: string;
  data?: {
    id: string; // Employee ID
    name: string;
    email: string;
  };
}

// Contractor Types
export interface Contractor {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // Additional fields
}

export interface CreateContractorPayload {
  nameEn: string;
  nameAr: string;
  email: string;
  [key: string]: any; // Additional fields
}

export interface CreateContractorResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: any; // Additional fields
}

// Consultant Types
export interface Consultant {
  id: string;
  name: string; // Consultant name
  email: string; // Consultant email
  [key: string]: any; // Additional fields if necessary
}

export interface CreateConsultantPayload {
  name: string; // Consultant name
  email: string; // Consultant email
  [key: string]: any; // Additional fields if necessary
}

export interface CreateConsultantResponse {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // Additional fields if necessary
}

// Project Types
export type Project = {
  id: string; // Project ID
  arabicName: string;
  englishName: string;
  location: string;
  description: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  projectManagerName: string;
  mainContractorName: string;
  consultantName: string;
  status: "Running" | "Upcoming" | "Ended";
  engineers: string[]; // Engineer IDs
  subContractors: string[]; // Sub-contractor IDs
  images?: string[]; // Uploaded image URLs
};

export type CreateProjectPayload = {
  arabicName: string;
  englishName: string;
  location: string;
  description: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  projectManagerId: string;
  engineerIds: string[]; // Selected engineers
  contractorId: string; // Main contractor
  subContractorIds: string[]; // Sub-contractors
  consultantId: string; // Consultant
  images?: File[]; // Files for upload (optional)
};

export type UpdateProjectPayload = Partial<CreateProjectPayload>; // Editable fields only

export type ProjectResponse = {
  project: Project;
};

export type ProjectsListResponse = {
  projects: Project[];
  total: number;
};
