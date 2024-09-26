const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');// method override for html forms using middleware 
const Villa = require('./models/villa');
const app = express();
const ejsmate = require('ejs-mate')

const campgrounds = require('./routes/campgrounds');

//here give the name according which you gave in the seeds/index2 folder for database using connect (replace ** with name of db you given)
mongoose.connect('mongodb://127.0.0.1:27017/villas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// to avoid error of connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
//importing the reviews model
const Review = require('./models/review')



//error handling 
const catchAsync = require('./utils/catchAsync');

//Joi installing for validation of input data
const Joi = require('joi')
const { villaSchema,reviewSchema} = require('./schemas')











//middlewares
app.engine('ejs', ejsmate)// used in layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));//for form method overriding , for overriding drawback of the form








//rendering intro page
app.get('/', (req, res) => {
    res.render('home')
});





app.use('/villas', campgrounds)

//for varoius another error or invalid url request
const ExpressError = require('./utils/expresserror')
app.all('*', (req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next(new ExpressError('Page not Found', 404))
})



//using error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).render('error', { err });

    // general res.send('error occured')
});


app.listen(4000, () => {
    console.log('Serving on port 4000')
})