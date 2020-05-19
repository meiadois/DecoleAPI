import { Request, Response } from 'express'
import { ErrorHandler } from '../helpers/error'
import { Channel } from '../models/Channel'

class ChannelsController {
  async list (req: Request, res: Response): Promise<Response> {
    const _channels = await Channel.findAll()
    return res.json(_channels)
  }

  async index (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    if (!id) {
      throw new ErrorHandler(404, '')
    }
    let _channel = null
    try {
      _channel = await Channel.findByPk(id)
    } catch (err) {
      console.log(err)
    }

    if (_channel === null) {
      throw new ErrorHandler(404, `Canal ${id} não encontrado.`)
    }
    return res.status(200).json(_channel)
  }

  async store (req: Request, res: Response): Promise<Response> {
    const { name, category } = req.body
    if (!name || !category) {
      throw new ErrorHandler(400, '')
    }

    const nResults = await Channel.count({ where: { name } })

    if (nResults !== 0) {
      throw new ErrorHandler(400, `Já existe um canal chamado [${name}].`)
    }

    const _channel = await Channel.create({
      name, category
    }).catch((err) => {
      console.log(err)
      return null
    })
    if (!_channel) {
      throw new ErrorHandler(500, '')
    }
    return res.status(201).json(_channel)
  }

  async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, category } = req.body
    if (!name || !category) {
      throw new ErrorHandler(400, '')
    }

    const _channel = await Channel.findByPk(id)

    if (!_channel) {
      throw new ErrorHandler(404, `Canal ${id} não encontrado.`)
    }

    _channel.name = name
    _channel.category = category

    const _success = await _channel.save().then(() => {
      return true
    }).catch((err) => {
      console.log(err)
      return false
    })

    if (!_success) {
      throw new ErrorHandler(500, '')
    }
    return res.status(200).json(_channel)
  }

  async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    if (!id) {
      throw new ErrorHandler(400, '')
    }

    const _channel = await Channel.findByPk(id)

    if (!_channel) {
      throw new ErrorHandler(404, `Canal ${id} não encontrado.`)
    }

    const _success = await _channel.destroy().then(() => {
      return true
    }).catch((err) => {
      console.log(err)
      return false
    })

    if (!_success) {
      throw new ErrorHandler(500, '')
    }
    return res.status(204).json({})
  }
}

export default new ChannelsController()
