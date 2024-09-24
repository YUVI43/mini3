const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');// method override for html forms using middleware 
const villa = require('./models/villa');
const app = express();
const ejsmate = require('ejs-mate')



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




//error handling 
const catchAsync = require('./utils/catchAsync')

//Joi installing for validation of input data
const Joi = require('joi')
const { villaSchema,reviewSchema} = require('./schemas')

//Using middleware to validate the villa       
const validatevilla = (req, res, next) => {
    //Defining the JOI schema to validate data

    const { error } = villaSchema.validate(req.body)// passing the data from the request to the JOI validation and taking error part if present
    if (error) {
        //since the JOI is returning object containg various part to include various parts of that object we need map
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next()
    }

}
//importing the reviews model
const Review = require('./models/review')


//Middleware for reviews validation
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}





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

//Listing all the villas
app.get('/villas', async (req, res) => {
    const villas = await villa.find({});
    res.render('villaslist', { villas })
});



//Creating new villa
app.get('/villas/new', (req, res) => {
    res.render('new');
})
app.post('/villas', validatevilla, catchAsync(async (req, res, next) => {
    // if (!req.body.villa) throw new ExpressError('Invalid villa data ', 404)
    const villa = new villa(req.body.villa);
    await villa.save();
    res.redirect(`/villas/${villa._id}`);
}))





//Get villa by id
app.get('/villas/:id', catchAsync(async (req, res) => {
    const villa = await villa.findById(req.params.id).populate('reviews')
    res.render('show', { villa })
}))




//Edit the villa after found
app.get('/villas/:id/edit', catchAsync(async (req, res) => {
    const villa = await villa.findById(req.params.id)
    res.render('edit', { villa })
}))
app.put('/villas/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const villa = await villa.findByIdAndUpdate(id, { ...req.body.villa });//(... is the sprread operator)
    res.redirect(`/villas/${villa._id}`)
}));


//Delete villa
app.delete('/villas/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await villa.findByIdAndDelete(id);
    res.redirect('/villas');
}))


//reviews model
app.post('/villas/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const villa = await villa.findById(req.params.id);
    const review = new Review(req.body.review);
    villa.reviews.push(review);
    await review.save();
    await villa.save();
    res.redirect(`/villas/${villa._id}`)

}))

//deletigng the reviews
app.delete('/villas/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    // await Review.findByIdAndDelete(req.)
    // we are removing review id from only review table but from villa atable we need $pull method 
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await villa.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/villas/${id}`)


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


app.listen(4000, () => {
    console.log('Serving on port 3000')
})