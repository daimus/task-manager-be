import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class UsersController {
  /**
   * @me
   * @description Get current user
   * @responseBody 200 - <User>
   */
  async me({ auth, response }: HttpContext) {
    logger.info('POST /api/v1/users/me')
    try {
      const user = auth.getUserOrFail()
      return response.ok(user)
    } catch (error) {
      return response.unauthorized({ error: 'User not found' })
    }
  }
}
