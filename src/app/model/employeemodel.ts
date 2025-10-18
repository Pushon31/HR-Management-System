export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  nidNumber?: string;
  bankAccountNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  departmentId?: number | null;
  departmentName?: string;
  birthDate?: string;
  joinDate?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
  designation?: string;
  employeeType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'PROBATION';
  shift?: string;
  basicSalary?: number;
  profilePic?: string;  // ✅ Backend field name
  managerId?: number | null;
  managerName?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'SUSPENDED' | 'ON_LEAVE';
  workType: string;     // ✅ REQUIRED FIELD
}