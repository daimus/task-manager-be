import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class AuthController {
  constructor(private userService: UserService) {}

  async register({ request, response }: HttpContext) {
    logger.info('POST /api/v1/auth/register')
    const payload = await request.validateUsing(registerValidator)
    const user = await this.userService.createUser(payload)

    return response.created(user)
  }

  async login({ request, response }: HttpContext) {
    logger.info('POST /api/v1/auth/login')
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }

  async logout({ auth, response }: HttpContext) {
    logger.info('POST /api/v1/auth/logout')
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }
}
