import {RoleDto} from "../Role/role.dto";

export interface UserDto {
  email: string;
  role: RoleDto;
}
