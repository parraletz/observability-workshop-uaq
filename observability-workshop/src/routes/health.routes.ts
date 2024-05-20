import { Router, Request, Response } from 'express'

class HealthRoutes {
  public router: Router = Router()

  constructor() {
    this.config()
  }

  private config(): void {
    this.router.get('/', this.healthCheck)
  }

  private healthCheck(_: Request, res: Response): Response {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    }
    try {
      return res.json(healthcheck)
    } catch (e) {
      return res.status(503).json()
    }
  }
}

export const healthRouter = new HealthRoutes().router
