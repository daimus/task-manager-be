import logger from "@adonisjs/core/services/logger";
import Task from "#models/task";

export class TaskService {
  public async getTasks(filter: Partial<Task>) {
    logger.info('TASK_SERVICE/getTasks filter: %j', filter)
    return await Task.query().where(filter).orderBy('completed', 'asc').orderBy('created_at', 'desc')
  }

  public async getTask(filter: Partial<Task>) {
    logger.info('TASK_SERVICE/getTask filter: %j', filter)
    return await Task.findBy(filter)
  }

  public async createTask(data: Partial<Task>) {
    logger.info('TASK_SERVICE/createTask data: %j', data)
    return await Task.create(data)
  }

  public async updateTask(filter: Partial<Task>, data: Partial<Task>) {
    logger.info('TASK_SERVICE/updateTask filter: %j data: %j', filter, data)
    const task = await Task.findBy(filter)
    if (!task) return null
    task.merge(data)
    await task.save()
    return task
  }

  public async deleteTask(filter: Partial<Task>) {
    logger.info('TASK_SERVICE/deleteTask filter: %j', filter)
    const task = await Task.findBy(filter)
    if (!task) return null
    await task.delete()
    return true
  }
}
