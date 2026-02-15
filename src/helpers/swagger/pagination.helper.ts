import { Get, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { UserAuth, UserAuthType } from '../decotators.helpers';
import { PaginatedResponseDto } from '../pagination/dto/pagination-response.dto';
import { BadRequestException } from '@nestjs/common';

export function PaginatedDocs<DTO>(
  dto: Type<DTO>,
  path: string = '',
  userAuthType: UserAuthType | UserAuthType[] | null = null,
  argDtos: Record<string, Type<any>> = {},
) {
  const extraModels = Object.values(argDtos);
  const requiredKeys = Object.keys(argDtos);

  const decorators = [];
  if (userAuthType !== null) decorators.push(UserAuth(userAuthType));

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: () => Number,
      description: 'Номер страницы (начиная с 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: () => Number,
      description: 'Количество элементов на странице',
      example: 10,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: () => String,
      description: 'Поисковый запрос для фильтрации результатов',
      example: 'пицца',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: () => String,
      description: 'Направление сортировки (ASC или DESC)',
      enum: ['ASC', 'DESC'],
      example: 'ASC',
    }),
    ApiQuery({
      name: 'sortField',
      required: false,
      type: () => String,
      description: 'Поле для сортировки',
      example: 'id',
    }),
    ApiExtraModels(PaginatedResponseDto, dto, ...extraModels),
    ApiOkResponse({
      description: 'Успешный ответ с пагинированными данными',
      schema: {
        allOf: [
          {
            required: ['data', 'total', ...requiredKeys],
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
                description: 'Массив данных',
              },
              ...Object.entries(argDtos).reduce(
                (acc, [name, type]) => ({
                  ...acc,
                  [name]: { $ref: getSchemaPath(type) },
                }),
                {},
              ),
              total: {
                type: 'number',
                description: 'Общее количество элементов',
                example: 100,
              },
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 400,
      type: BadRequestException,
      description: 'Ошибка валидации параметров запроса',
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
    }),
    ApiResponse({
      status: 403,
      description: 'Доступ запрещен',
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
    }),
    Get(path),
    ...decorators,
  );
}
