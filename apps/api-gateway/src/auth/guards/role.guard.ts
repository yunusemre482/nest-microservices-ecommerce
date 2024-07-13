import { CanActivate, Injectable } from "@nestjs/common";
import { CustomAuthGuard } from "./auth.guard";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/auth.decorator";
import { Role } from "../enums/role.enum";


@Injectable()
export class RolesGuard extends CustomAuthGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
  ) {
    super(_reflector);
  }

  async canActivate(context: any): Promise<boolean> {

    const jwtVerified = await super.canActivate(context);

    if (!jwtVerified) return false;

    const roles = this._reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) as Role[];

    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return false;
    }

    // TODO - get user from redis and validate roles

    // const userRoles = await this.redisService.getUserRoles(user.id);

    // if (!userRoles) {
    //   return false;
    // }

    // TODO - change after implement redis infrastructure
    return this.validateRoles(roles, user.roles);
  }

  private validateRoles(roles: Role[], userRoles: Role[]) {
    return userRoles.some((role) => roles?.includes(role));
  }
}
