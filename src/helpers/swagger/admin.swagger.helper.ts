import { BadRequestException, Delete, Get, Post, Put, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'

import { UserAuth, UserAuthType } from '../decotators.helpers'

export function AdminDockGet(path: string, success = null) {
    return applyDecorators(
        Get(path),
        UserAuth(UserAuthType.ADMIN),
        ApiResponse({ status: 200, type: success }),
        ApiResponse({ status: 400, type: BadRequestException })
    )
}

export function AdminDockPost(path: string, dto = null, success = null, authType: UserAuthType = UserAuthType.ADMIN) {
    const decorators: ClassDecorator | MethodDecorator[] = [
        ApiResponse({ status: 400, type: BadRequestException }),
        ApiResponse({ status: 200, type: success }),
        UserAuth(authType),
        Post(path),
    ]

    if (dto) decorators.push(ApiBody({ type: dto }))

    return applyDecorators(...decorators)
}

export function AdminDockPut(path: string, dto = null, success = null) {
    const decorators: ClassDecorator | MethodDecorator[] = [
        ApiResponse({ status: 400, type: BadRequestException }),
        ApiResponse({ status: 200, type: success }),
        UserAuth(UserAuthType.ADMIN),
        Put(path),
    ]

    if (dto) decorators.push(ApiBody({ type: dto }))

    return applyDecorators(...decorators)
}

export function AdminDockDelete(path: string, dto = null, success = null) {
    const decorators: ClassDecorator | MethodDecorator[] = [
        ApiResponse({ status: 400, type: BadRequestException }),
        ApiResponse({ status: 200, type: success }),
        UserAuth(UserAuthType.ADMIN),
        Delete(path),
    ]

    if (dto) decorators.push(ApiBody({ type: dto }))

    return applyDecorators(...decorators)
}
