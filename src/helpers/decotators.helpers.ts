import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import {
  UserGuard,
  UserRoleEnum,
  UserRoles,
} from 'src/helpers/stubs/user-auth.stub';

export enum ErrorValidationCodeEnum {
  IS_NOT_EMPTY = 'Не может быть пустым',
  IS_OPTIONAL = 'Необязятельно',
  IS_ENUM = 'Тип значения Enum',
  IS_EMAIL = 'Невалидный email адрес',
  IS_STRING = 'Тип значения строка',
  IS_PHONE_NUMBER = 'Невалидный номер телефона',
  IS_INT = 'Тип значения число',
  IS_ARRAY = 'Тип значения массив',
  IS_BOOLEAN = 'Тип значения boolean',
  IS_DATE = 'Тип значения дата',
  IS_URL = 'Невалидный url адрес',
  IS_OBJECT = 'Тип значения объект',
  DECIMAL = 'Тип значения десятичное число',
}

export enum UserAuthType {
  ADMIN,
  BUSINESS,
  COURIER,
  CUSTOMER,
  DISPATCHER,
  PICKER,
  NOT_AUTH,
  NOT_CONFIRMED_CUSTOMER,
}

export enum TypeValidate {
  PHONE,
  EMAIL,
  NUMBER,
  ARRAY,
  STRING,
  BOOLEAN,
  DATE,
  URL,
  DECIMAL,
  ENUM,
  OBJECT,
}

const validateMap = {
  [TypeValidate.EMAIL]: {
    fn: IsEmail(undefined, {
      message: ErrorValidationCodeEnum.IS_EMAIL,
    }),
    propType: String,
  },
  [TypeValidate.PHONE]: {
    fn: IsPhoneNumber(undefined, {
      message: ErrorValidationCodeEnum.IS_PHONE_NUMBER,
    }),
    propType: String,
  },
  [TypeValidate.NUMBER]: {
    fn: IsInt({
      message: ErrorValidationCodeEnum.IS_INT,
    }),
    propType: Number,
  },
  [TypeValidate.ARRAY]: {
    fn: IsArray({
      message: ErrorValidationCodeEnum.IS_ARRAY,
    }),
    propType: Array,
  },
  [TypeValidate.STRING]: {
    fn: IsString({
      message: ErrorValidationCodeEnum.IS_STRING,
    }),
    propType: String,
  },
  [TypeValidate.BOOLEAN]: {
    fn: IsBoolean({
      message: ErrorValidationCodeEnum.IS_BOOLEAN,
    }),
    propType: Boolean,
  },
  [TypeValidate.DATE]: {
    fn: IsDate({
      message: ErrorValidationCodeEnum.IS_DATE,
    }),
    propType: Date,
  },
  [TypeValidate.URL]: {
    fn: IsUrl(undefined, {
      message: ErrorValidationCodeEnum.IS_URL,
    }),
    propType: String,
  },
  [TypeValidate.DECIMAL]: {
    fn: IsNumber(undefined, {
      message: ErrorValidationCodeEnum.DECIMAL,
    }),
    propType: Number,
  },
  [TypeValidate.OBJECT]: {
    fn: IsObject({
      message: ErrorValidationCodeEnum.IS_OBJECT,
    }),
    propType: Object,
  },
};

export function Validate(type: TypeValidate, options?: ApiPropertyOptions) {
  const { fn } = validateMap[type];
  const arr = [
    fn,
    options?.required === false
      ? IsOptional({ message: ErrorValidationCodeEnum.IS_OPTIONAL })
      : IsNotEmpty({ message: ErrorValidationCodeEnum.IS_NOT_EMPTY }),
    ApiProperty(options),
  ];
  if (options && options.maxLength) {
    arr.push(MaxLength(options.maxLength));
  }
  return applyDecorators(...arr);
}

export function ValidateEnum(enumType, options?: ApiPropertyOptions) {
  const arr = [
    IsEnum(enumType, { message: ErrorValidationCodeEnum.IS_ENUM }),
    options?.required === false
      ? IsOptional({ message: ErrorValidationCodeEnum.IS_OPTIONAL })
      : IsNotEmpty({ message: ErrorValidationCodeEnum.IS_NOT_EMPTY }),
    ApiProperty({ enum: enumType, ...options }),
  ];
  return applyDecorators(...arr);
}

/**
 * Маппинг UserAuthType -> UserRoleEnum для обычных ролей
 */
const userAuthTypeToRoleMap: Record<UserAuthType, UserRoleEnum | null> = {
  [UserAuthType.ADMIN]: UserRoleEnum.ADMIN,
  [UserAuthType.BUSINESS]: UserRoleEnum.BUSINESS,
  [UserAuthType.COURIER]: UserRoleEnum.COURIER,
  [UserAuthType.CUSTOMER]: UserRoleEnum.CUSTOMER,
  [UserAuthType.DISPATCHER]: UserRoleEnum.DISPATCHER,
  [UserAuthType.PICKER]: UserRoleEnum.PICKER,
  [UserAuthType.NOT_AUTH]: null,
  [UserAuthType.NOT_CONFIRMED_CUSTOMER]: UserRoleEnum.CUSTOMER,
};

/**
 * Авторизация по ролям.
 *
 * Варианты использования:
 * - UserAuth(UserAuthType.CUSTOMER)
 * - UserAuth([UserAuthType.CUSTOMER, UserAuthType.BUSINESS])
 *
 * Особые случаи:
 * - NOT_AUTH — без гардов
 * - NOT_CONFIRMED_CUSTOMER — как CUSTOMER (UserGuard + UserRoles)
 */
export function UserAuth(type: UserAuthType | UserAuthType[]) {
  // Нормализуем в массив
  const types = Array.isArray(type) ? type : [type];

  // Если явно передан NOT_AUTH (и только он) — без гардов
  if (types.length === 1 && types[0] === UserAuthType.NOT_AUTH) {
    return applyDecorators();
  }

  // Собираем роли для UserGuard (включая NOT_CONFIRMED_CUSTOMER -> CUSTOMER)
  const roles = types
    .map((t) => userAuthTypeToRoleMap[t])
    .filter((role): role is UserRoleEnum => role !== null);

  // Если после фильтрации ничего не осталось — считаем, что NOT_AUTH
  if (!roles.length) {
    return applyDecorators();
  }

  // Один UserGuard + один UserRoles с массивом ролей
  return applyDecorators(
    UseGuards(UserGuard),
    UserRoles(...roles),
    ApiBearerAuth(),
  );
}
