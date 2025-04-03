import type { HttpContext } from '@adonisjs/core/http'
import {inject} from "@adonisjs/core";
import {TaskService} from "#services/task_service";
import {createTaskValidator, updateTaskValidator} from "#validators/task";
import logger from "@adonisjs/core/services/logger";

@inject()
export default class TasksController {
  constructor(private taskService: TaskService) {}

  async index({auth, response}: HttpContext) {
    logger.info('GET /api/v1/tasks')
    const tasks = await this.taskService.getTasks({
      userId: auth.user.id
    });
    return response.json(tasks);
  }

  async store({ auth, request, response }: HttpContext) {
    logger.info('POST /api/v1/tasks')
    const payload = await request.validateUsing(createTaskValidator)
    const user = auth.user;
    const task = await this.taskService.createTask({ ...payload, user_id: user.id });
    return response.json(task);
  }

  async show({ auth, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const task = await this.taskService.getTask({
      id: taskId,
      userId: auth.user.id
    });
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.json(task);
  }

  async update({ auth, params, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const payload = await request.validateUsing(updateTaskValidator)
    const task = await this.taskService.updateTask({
      id: taskId,
      userId: auth.user.id
    }, payload);
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.json(task);
  }

  async destroy({ auth, request, response }: HttpContext) {
    const taskId = request.param('id')
    logger.info('GET /api/v1/tasks/%s', taskId)
    const task = await this.taskService.deleteTask({
      id: taskId,
      userId: auth.user.id
    });
    if (!task) {
      return response.status(404).json({ message: "Task not found" });
    }
    return response.status(204);
  }
}
