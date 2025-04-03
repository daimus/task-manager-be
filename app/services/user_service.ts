import User from '#models/user'

export default class UserService {
  public async createUser(data: Partial<User>) {
    return await User.create(data)
  }
}
