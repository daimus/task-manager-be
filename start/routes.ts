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
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const AuthController = () => import('#controllers/auth_controller')
const TasksController = () => import('#controllers/tasks_controller')
const UsersController = () => import('#controllers/users_controller')

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
            router.get('me', [UsersController, 'me']).use(middleware.auth())
          })
          .prefix('users')
        // Tasks Controller
        router
          .group(() => {
            router.get('/', [TasksController, 'index'])
            router.get('/:id', [TasksController, 'show'])
            router.post('/', [TasksController, 'store'])
            router.patch('/:id', [TasksController, 'update'])
            router.delete('/:id', [TasksController, 'destroy'])
          })
          .use(middleware.auth())
          .prefix('tasks')
      })
      .prefix('v1')
  })
  .prefix('api')

// returns swagger in YAML
router.get('/api', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/api', swagger)
})
