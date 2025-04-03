import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { TaskService } from '#services/task_service'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class TasksController {
  constructor(private taskService: TaskService) {}

  /**
   * @index
   * @description Get all task of current user
   * @responseBody 200 - <Task[]>
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   */
  async index({ auth, response }: HttpContext) {
    logger.info('GET /api/v1/tasks')
    const userId = auth?.user?.id
    if (!userId) {
      return response.unauthorized({
        errors: [
          {
            message: 'Unauthorized',
          },
        ],
      })
    }
    const tasks = await this.taskService.getTasks({
      userId: userId,
    })
    return response.json(tasks)
  }

  /**
   * @store
   * @description Create new task
   * @requestBody {"name": "Activity", "completed": false}
   * @responseBody 200 - <Task>
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   * @responseBody 422 - {"errors": [{"message": "string", "rule": "string", "field": "string"}]}
   */
  async store({ auth, request, response }: HttpContext) {
    logger.info('POST /api/v1/tasks')
    const payload = await request.validateUsing(createTaskValidator)
    const userId = auth?.user?.id
    if (!userId) {
      return response.unauthorized({
        errors: [
          {
            message: 'Unauthorized',
          },
        ],
      })
    }
    const task = await this.taskService.createTask({ ...payload, userId: userId })
    return response.json(task)
  }

  /**
   * @show
   * @description Show task by id
   * @responseBody 200 - <Task>
   * @responseBody 404 - {"errors": [{"message": "string"}]}
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   */
  async show({ auth, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const userId = auth?.user?.id
    if (!userId) {
      return response.unauthorized({
        errors: [
          {
            message: 'Unauthorized',
          },
        ],
      })
    }
    const task = await this.taskService.getTask({
      id: taskId,
      userId: userId,
    })
    if (!task) {
      return response.notFound({
        errors: [
          {
            message: 'Task not found',
          },
        ],
      })
    }
    return response.json(task)
  }

  /**
   * @update
   * @description Update task by id
   * @requestBody {"name": "Activity", "completed": false}
   * @responseBody 200 - <Task>
   * @responseBody 404 - {"errors": [{"message": "string"}]}
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   * @responseBody 422 - {"errors": [{"message": "string", "rule": "string", "field": "string"}]}
   */
  async update({ auth, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const payload = await request.validateUsing(updateTaskValidator)
    const userId = auth?.user?.id
    if (!userId) {
      return response.unauthorized({
        errors: [
          {
            message: 'Unauthorized',
          },
        ],
      })
    }
    const task = await this.taskService.updateTask({
        id: taskId,
        userId: userId,
      },
      payload
    )
    if (!task) {
      return response.notFound({
        errors: [
          {
            message: 'Task not found',
          },
        ],
      })
    }
    return response.json(task)
  }

  /**
   * @destroy
   * @description Delete task by id
   * @responseBody 204 - No Content
   * @responseBody 400 - {"errors": [{"message": "string"}]}
   * @responseBody 401 - {"errors": [{"message": "string"}]}
   */
  async destroy({ auth, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const userId = auth?.user?.id
    if (!userId) {
      return response.unauthorized({
        errors: [
          {
            message: 'Unauthorized',
          },
        ],
      })
    }
    const task = await this.taskService.deleteTask({
      id: taskId,
      userId: userId,
    })
    if (!task) {
      return response.notFound({
        errors: [
          {
            message: 'Task not found',
          },
        ],
      })
    }
    return response.status(204)
  }
}
