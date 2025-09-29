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
  departmentName?: string;          // comes from @JsonIgnore (optional, backend may skip)
  birthDate?: string;               // use string for ISO date from API
  joinDate?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
  designation?: string;
  employeeType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'PROBATION';
  shift?: string;
  basicSalary?: number;             // BigDecimal → number
  photoUrl?: string;
  managerId?: number | null;
  managerName?: string;             // @JsonIgnore – optional
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'SUSPENDED' | 'ON_LEAVE';
}