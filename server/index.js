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
