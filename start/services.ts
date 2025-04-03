import { container } from '@adonisjs/core'
import UserService from '#services/user_service'

container.singleton('UserService', () => new UserService())
