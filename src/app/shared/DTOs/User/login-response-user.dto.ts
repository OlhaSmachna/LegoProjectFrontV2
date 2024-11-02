import {RoleDto} from "../Role/role.dto";

export interface LoginResponseUserDto {
  email: string;
  token: string;
  refreshToken: string;
  role: RoleDto;
}
