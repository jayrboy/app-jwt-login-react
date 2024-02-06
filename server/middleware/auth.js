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
