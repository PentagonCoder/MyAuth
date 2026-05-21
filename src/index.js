import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
const port = 3000

app.use(express.json())

import userRoutes from './routes/user.routes.js'
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
