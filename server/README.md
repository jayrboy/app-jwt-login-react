# JSON Web Token

```sh
npm init -y
npm install express mongoose morgan cors jsonwebtoken bcryptjs
```

1. Web Server

- index.js

```js
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import auth from './router/auth.js'

const app = express()
const port = 3000

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', auth)

app.listen(port, () =>
  console.log('Server running at http://localhost:%s', port)
)
```

2. เชื่อมต่อ Mongoose

- กำหนด Model และ Schema "model.js"

```js
import mongoose from 'mongoose'

mongoose
  .connect('mongodb://localhost/db1')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log(err))

const userSchema = mongoose.Schema(
  {
    name: String,
    password: String,
  },
  { timestamps: true }
)
let User = mongoose.model('User', userSchema)

export { User }
```

3. กำหนด "router/auth.js"

```js
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../model.js'

const router = express.Router()

router.post('/sign-up', async (req, res) => {})

router.post('/sign-in', async (req, res) => {})

export default router
```

- POST: sign-up (register)

```js
// http://localhost:3000/api/sign-up
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
```

- POST: sign-in (login)

```js
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
```

4. กำหนด Middleware JSON Web Token

```js
import jwt from 'jsonwebtoken'

export default auth = async (req, res, next) => {
  try {
    const token = req.headers['authtoken']
    if (!token) {
      return res.status(401).send({ message: 'No Token!' })
    }
    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded.user

    next()
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ message: 'Token Invalid!' })
  }
}
```

5. ทดสอบ POSTMAN

- http://localhost:3000/api/sign-up -> Send -> (raw) -> {name: 'jakkrit', password: 'xxxx'}
- http://localhost:3000/api/sign-in -> Send -> (x-www-form-urlencoded) -> {name: 'jakkrit', password: 'xxxx'}
