export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  nidNumber?: string;
  bankAccountNumber?: string;
  gender?: string;
  maritalStatus?: string;
  departmentId?: number | null;
  departmentName?: string;
  birthDate?: string;
  joinDate?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
  designation?: string;
  employeeType?: string;
  shift?: string;
  basicSalary?: number;
  profilePic?: string;
  managerId?: number | null;
  managerName?: string;
  status: string;
  workType: string; // ✅ NEW: Required by backend
}