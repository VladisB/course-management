import { Role } from "src/roles/roles.model";

export type JwtPayload = {
    email: string,
    id: number,
    roles: Role[]
}