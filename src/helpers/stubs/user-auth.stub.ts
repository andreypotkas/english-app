import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';

/** Заглушка: замени на реальный модуль users при подключении */
export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS',
  COURIER = 'COURIER',
  CUSTOMER = 'CUSTOMER',
  DISPATCHER = 'DISPATCHER',
  PICKER = 'PICKER',
}

export const ROLES_KEY = 'roles';

export function UserRoles(...roles: UserRoleEnum[]) {
  return SetMetadata(ROLES_KEY, roles);
}

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
