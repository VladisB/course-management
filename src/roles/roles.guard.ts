import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getClass(),
            context.getHandler(),
        ]);

        if (!roles.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();

        return roles.includes(request.user.role.name);
    }
}
