const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');// method override for html forms using middleware 
const Campground = require('./models/campground');
const app = express();
const ejsmate = require('ejs-mate')



//here give the name according which you gave in the seeds/index2 folder for database using connect (replace ** with name of db you given)
mongoose.connect('mongodb://localhost:27017/***', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// to avoid error of connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});




//error handling 
const catchAsync = require('./utils/catchAsync')

//Joi installing for validation of input data
const Joi = require('joi')
const { campgroundSchema } = require('./schemas')

//Using middleware to validate the campground       
const validateCampground = (req, res, next) => {
    //Defining the JOI schema to validate data

    const { error } = campgroundSchema.validate(req.body)// passing the data from the request to the JOI validation and taking error part if present
    if (error) {
        //since the JOI is returning object containg various part to include various parts of that object we need map
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next()
    }

}



app.engine('ejs', ejsmate)// used in layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));//for form method overriding , for overriding drawback of the form

//rendering intro page
app.get('/', (req, res) => {
    res.render('home')
});

//Listing all the campgrounds
app.get('/villas', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds', { campgrounds })
});



//Creating new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data ', 404)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


//Get campground by id
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('show', { campground })
}))


//Edit the campground after found
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('edit', { campground })
}))
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });//(... is the sprread operator)
    res.redirect(`/campgrounds/${campground._id}`)
}));


//Delete Campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


//for varoius another error or invalid url request
const ExpressError = require('./utils/expresserror')
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})



//using error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).render('error', { err });

    // general res.send('error occured')
});


app.listen(3000, () => {
    console.log('Serving on port 3000')
})