import { createServer } from 'http'
import connect from 'connect'

const app = connect()
app.use((req, res, next) => {
  if (req.url == '/error')
    throw new Error('Uncaught error')
  res.write('hello, ')
  next()
})
app.use((req, res) => {
  res.statusCode = 200
  res.end('world!')
})

export default createServer(app)