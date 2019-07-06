import PetService from '../services/PetService'
import express from 'express'
import { Authorize } from '../middlewear/authorize'

//import service and create an instance
let _service = new PetService()
let _repo = _service.repository

//PUBLIC
export default class PetController {
  constructor() {
    this.router = express.Router()
      .use(Authorize.authenticated) //this insures author exists and is logged in for req.session
      .get('', this.getAll)
      .get('/:id/pets', this.getPets)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
      .use(this.defaultRoute)
  }

  defaultRoute(req, res, next) {
    next({ status: 404, message: 'No Such Route' })
  }

  async getAll(req, res, next) {
    try {
      let data = await _repo.find({ authorId: req.session.uid })
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getPets(req, res, next) {
    try {
      let data = await _repo.find({ authorId: req.session.uid })
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.authorId = req.session.uid
      let data = await _repo.create(req.body)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _repo.findOneAndUpdate({ _id: req.params.id, authorId: req.session.uid }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("invalid id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let pet = await _repo.findOne({ _id: req.params.id, authorId: req.session.uid })
      await pet.remove()
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}