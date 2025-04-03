import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class AuthController {
  constructor(private userService: UserService) {}

  /**
   * @register
   * @description Register a new user
   * @requestBody {"fullName": "John Doe", "email": "johndoe@mail.com", "password": "password"}
   * @responseBody 201 - <User>
   * @responseBody 422 - {"errors": [{"message": "string", "rule": "string", "field": "string"}]}
   */
  async register({ request, response }: HttpContext) {
    logger.info('POST /api/v1/auth/register')
    const payload = await request.validateUsing(registerValidator)
    const user = await this.userService.createUser(payload)

    return response.created(user)
  }

  /**
   * @login
   * @description Login into account
   * @requestBody {"email": "johndoe@mail.com", "password": "password"}
   * @responseBody 200 - {"type": "bearer", "access_token": "string"}
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   */
  async login({ request, response }: HttpContext) {
    logger.info('POST /api/v1/auth/login')
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const tokenJson = token.toJSON()
    return response.ok({
      type: tokenJson.type,
      access_token: tokenJson.token,
    })
  }

  /**
   * @logout
   * @description Logout from account
   * @responseBody 200 - {"message": "string"}
   * @responseBody 400 - {"errors": [{"message": "string"}]}
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   */
  async logout({ auth, response }: HttpContext) {
    logger.info('POST /api/v1/auth/logout')
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({
        errors: [{
          message: 'Invalid token'
        }]
      })
    }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }
}
