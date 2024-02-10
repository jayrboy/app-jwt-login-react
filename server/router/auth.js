import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../model.js'

const router = express.Router()

//? POST: http://localhost:3000/api/sign-up
router.post('/sign-up', async (req, res) => {
  try {
    // check user
    const { name, password } = req.body
    let user = await User.findOne({ name })

    if (user) {
      return res.send('The User Already Exists!').status(400)
    }
    // encrypt
    const salt = await bcrypt.genSalt(10)
    user = new User({
      name,
      password,
      salt,
    })
    user.password = await bcrypt.hash(password, salt)
    // save
    await user.save()
    res.send('Register Successfully')
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message })
  }
})

//? POST: http://localhost:3000/api/sign-in
router.post('/sign-in', async (req, res) => {
  try {
    // check user
    const { name, password } = req.body
    let user = await User.findOneAndUpdate({ name }, { new: true })
    console.log(user)
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).send({ message: 'Password Invalid!' })
      }
      // payload
      let payload = {
        user: {
          name: user.name,
        },
      }
      // generate toke
      jwt.sign(payload, 'jwtsecret', { expiresIn: '1d' }, (err, token) => {
        if (err) throw err
        res.json({ token, payload })
      })
    } else {
      return res.status(400).send({ message: 'User Not Found!' })
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message })
  }
})

export default router
