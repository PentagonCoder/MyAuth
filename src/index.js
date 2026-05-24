import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit';
dotenv.config()


const app = express()
const port = 3000

// Rate limiting
const limiter = rateLimit({
   windowMs: 1 * 60 * 1000, 
   max: 5, // limit each IP to 5 requests per windowMs
   message: {
        message: "Too many requests"
   }

});

app.use(limiter);
app.use(express.json())
app.use(cookieParser())
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

//

import userRoutes from './routes/user.routes.js'
import connectDB from './db/index.js'


// routes
app.use('/api/users', userRoutes)



// database connection and server start
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
