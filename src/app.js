const express = require('express');
const connectDb = require('./config/dbConnection');
const app = express();
const authRouter = require('./routes/authRoute');
const cookieParser = require('cookie-parser')
const profileRouter = require('./routes/profileRouter')
const connectionRouter = require('./routes/connectionRouter')
const userRouter = require('./routes/userRoute')

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', connectionRouter)
app.use('/', userRouter)

connectDb()
.then(() => {
    console.log("DataBase is connected successfully");

    app.listen(process.env.port,() => {
        console.log("app is listen at port number 7777");
    })
})
.catch((err) => {
    console.log("DataBase is not connected",err);  
})


// query all the document and make the password trim