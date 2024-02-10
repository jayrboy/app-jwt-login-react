import mongoose from 'mongoose'

//* Connection
mongoose
  .connect('mongodb://localhost/db1')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log(err))

//* User Model
const userSchema = mongoose.Schema(
  {
    name: String,
    password: String,
  },
  { timestamps: true }
)

let User = mongoose.model('User', userSchema)

export { User }
