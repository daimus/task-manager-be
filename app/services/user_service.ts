import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export default class UserService {
  public async createUser(data: Partial<User>) {
    logger.info('USER_SERVICE/createUser')
    return await User.create(data)
  }
}
