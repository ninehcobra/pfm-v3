export class User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  avatar?: string;
  avatarPublicId?: string;
  roleId: string;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
