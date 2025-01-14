export enum UserType {
  Admin = "Admin",
  Employee = "Employee",
  Consultant = "Consultant",
}

export interface LoginPayload {
  email: string;
  password: string;
  type: UserType; // Explicitly set type to the UserType enum
  [key: string]: unknown; // Add index signature
}

export interface Admin {
  id: string;
  image: string;
  name: string;
  email: string;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface ForgetPasswordPayload {
  email: string;
}

export interface ForgetPasswordResponse {
  data: {
    message: string; // A message providing feedback, e.g., "Please check your email"
  };
  message: string | null; // A top-level message, which is `null` in this case
}
