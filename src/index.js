import express from 'express'
const app = express()
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
const port = 3000

app.use(express.json())
app.use(cookieParser())

import userRoutes from './routes/user.routes.js'
import connectDB from './db/index.js'

app.use('/api/users', userRoutes)

connectDB()
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`)
    })
})
.catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the application if the database connection fails
});
