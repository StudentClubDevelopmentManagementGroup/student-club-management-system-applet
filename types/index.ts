
export interface Department {
  department_id: string;
  department_name: string;
}

export interface Role {
  is_student: boolean;
  is_teacher: boolean;
  is_club_member: boolean;
  is_club_manager: boolean;
  is_super_admin: boolean;
}

export interface UserInfo {
  user_id: string;
  department: Department;
  name: string;
  tel: string;
  mail: string;
  role: Role;
}

export interface userData {
  user_info: UserInfo;
  token: string;
}
