import { Router } from 'express'
import { ItemsController } from '../controllers/items.controller'

class ItemsRoutes {
  public router: Router = Router()

  public itemsController: ItemsController = new ItemsController()

  constructor() {
    this.config()
  }

  private config(): void {
    this.router.get('/getAll', this.itemsController.getItems)
    this.router.get('/:id', this.itemsController.getItem)
    this.router.post('/create', this.itemsController.createItem)
    this.router.put('/:id', this.itemsController.updateItem)
  }
}

export const itemsRouter = new ItemsRoutes().router
