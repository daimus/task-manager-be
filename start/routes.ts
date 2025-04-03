/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        // Auth Routes
        router
          .group(() => {
            router.post('register', [AuthController, 'register'])
            router.post('login', [AuthController, 'login'])
            router.post('logout', [AuthController, 'logout']).use(middleware.auth())
          })
          .prefix('auth')
        // Users Routes
        router
          .group(() => {
            router
              .get('me', async ({ auth, response }) => {
                try {
                  const user = auth.getUserOrFail()
                  return response.ok(user)
                } catch (error) {
                  return response.unauthorized({ error: 'User not found' })
                }
              })
              .use(middleware.auth())
          })
          .prefix('users')
      })
      .prefix('v1')
  })
  .prefix('api')
