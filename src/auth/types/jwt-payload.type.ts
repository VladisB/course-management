import { Role } from 'src/roles/role.entity';

export type JwtPayload = {
  email: string;
  id: number;
  roles: Role[];
};
