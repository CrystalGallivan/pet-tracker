import express from 'express'
import UserService from '../services/UserService';
import { Authorize } from '../middlewear/authorize'

let _us = new UserService()
let _repo = _us.repository


//PUBLIC
export default class AuthController {
  constructor() {
    this.router = express.Router()
      .post('/register', this.register)
      .post('/login', this.login)
      .use(Authorize.authenticated)
      .get('/authenticate', this.authenticate)
      .get('/:id', this.getUserByName)
      .put('/:id', this.edit)
      .delete('/logout', this.logout)
      .delete('/:id', this.delete)
      .use(this.defaultRoute)
  } //TODO if changing site make put route

  defaultRoute(req, res, next) {
    next({ status: 404, message: 'No Such Route' })
  }
  async register(req, res, next) {
    //VALIDATE PASSWORD LENGTH
    if (req.body.password.length < 6) {
      return res.status(400).send({ error: 'Password must be at least 6 characters' })
    }
    try {
      //CHANGE THE PASSWORD TO A HASHED PASSWORD
      req.body.hash = _us.generateHash(req.body.password)
      //CREATE THE USER
      let user = await _repo.create(req.body)
      //REMOVE THE PASSWORD BEFORE RETURNING
      delete user._doc.hash
      //SET THE SESSION UID (SHORT FOR USERID)
      req.session.uid = user._id
      res.status(201).send(user)
    } catch (err) { res.status(400).send(err) }
  }

  async login(req, res, next) {
    try {
      let user = await _repo.findOne({ email: req.body.email })
      if (!user) {
        return res.status(400).send("Invalid Username Or Password")
      }

      let valid = await user.validatePassword(req.body.password)
      if (!valid) {
        return res.status(400).send("Invalid Username Or Password")
      }

      //ALWAYS REMOVE THE PASSWORD FROM THE USER OBJECT
      delete user._doc.hash
      req.session.uid = user._id
      res.send(user)
    }
    catch (err) {
      res.status(400).send("Invalid Username or Password")
    }
  }

  async authenticate(req, res, next) {
    try {
      let user = await _repo.findOne({ _id: req.session.uid })
      if (!user) {
        return res.status(401).send({
          error: 'Please Login to Continue'
        })
      }
      delete user._doc.hash
      res.send(user)
    }
    catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  }

  async getUserByName(req, res, next) {
    try {
      let user = await _repo.find({ name: req.params.id })
      return res.send(user)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _repo.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("Invalid Id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      await _repo.findOneAndRemove({ _id: req.params.id, authorId: req.session.uid })
      return res.send("Successfully Deleted")
    } catch (error) { next(error) }
  }

  async logout(req, res, next) {
    try {
      req.session.destroy(err => {
        if (err) {
          return res.send(err)
        }
        return res.send({
          message: 'Logout Successful'
        })
      })
    } catch (error) { next(error) }
  }
}