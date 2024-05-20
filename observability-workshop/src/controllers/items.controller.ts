import { Request, Response } from 'express'
import { Item } from '../interfaces/item.interface'
import { items as itemMock } from '../mocks/item.mock'

export class ItemsController {
  public getItems(_: Request, res: Response): Response {
    const items: Item[] = itemMock
    return res.json(items)
  }

  public getItem(req: Request, res: Response): Response {
    const id = parseInt(req.params.id)
    const item: Item = itemMock.find((item: Item) => item.id === id)!
    if (item) {
      return res.json(item)
    } else {
      return res.status(404).json({ error: 'Item not found' })
    }
  }

  public createItem(req: Request, res: Response): Response {
    const { name, description, price } = req.body
    const id = itemMock.length + 1
    const newItem: Item = { id, name, description, price }
    itemMock.push(newItem)
    return res.json(newItem)
  }

  public updateItem(req: Request, res: Response): Response {
    const id = parseInt(req.params.id)
    const { name, description, price } = req.body
    const index = itemMock.findIndex((item: Item) => item.id === id)
    if (index !== -1) {
      itemMock[index] = { id, name, description, price }
      return res.json(itemMock[index])
    } else {
      return res.status(404).json({ error: 'Item not found' })
    }
  }
}
