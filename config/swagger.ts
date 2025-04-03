// for AdonisJS v6
import path from 'node:path'
import url from 'node:url'
// ---

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  tagIndex: 3,
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: '',
  },
  snakeCase: true,

  debug: false, // set to true, to get some useful debug output
  ignore: ['/', '/api', '/docs'],
  preferredPutPatch: 'PATCH', // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  securitySchemes: {}, // optional
  authMiddlewares: ['auth', 'auth:api'], // optional
  defaultSecurityScheme: 'BearerAuth', // optional
  persistAuthorization: true, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
}
