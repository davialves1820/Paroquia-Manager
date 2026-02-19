import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
    path: path.join(__dirname, '..'),
    title: 'Paróquia Manager Pro API',
    version: '1.0.0',
    description: 'API Documentation for Paróquia Manager Pro',
    tagIndex: 2,
    ignore: ['/docs', '/swagger.json'],
    snakeCase: true,
    preferredPutPatch: 'PUT', // If 'PUT' then PATCH methods will be hidden
    common: {
        parameters: {},
        headers: {},
    },
    securitySchemes: {
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
    },
    defaultSecurityScheme: 'BearerAuth',
    persistAuthorization: true,
}
