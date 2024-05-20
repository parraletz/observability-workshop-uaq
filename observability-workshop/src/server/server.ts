import express, { Application } from 'express'
import logger from 'pino-http'
import cors from 'cors'

import { healthRouter } from '../routes/health.routes'
import { itemsRouter } from '../routes/items.routes'
import { ServerOptions } from '../interfaces/server.interfaces'

export class ServerApp {
  public app: Application
  public port: number

  private setupRoutes(): void {
    this.app.use('/api/health', healthRouter)
    this.app.use('/api/item', itemsRouter)
  }

  private setupServer(): void {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors())
    this.app.use(logger({ level: 'info' }))
  }

  constructor(options: ServerOptions) {
    this.app = express()
    this.setupServer()

    this.setupRoutes()

    this.port = options.port
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`)
    })
  }
}
