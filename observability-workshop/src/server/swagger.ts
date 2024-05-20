import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Tars',
    description: 'Swagger API documentation for Tars',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: '',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
}

const outputFile = 'docs/swagger.json'
const endpointsFiles = [
  './src/routes/items.routes.ts',
  './src/routes/health.routes.ts',
]

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)
