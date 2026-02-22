import { User } from '../../domain/entities/user.entity';

export class UserDto {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  roleId: string;
  roleName?: string;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.avatar = user.avatar;
    this.roleId = user.roleId;
    this.roleName = user.role?.name;
  }
}
