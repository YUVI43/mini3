const { default: mongoose } = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');
const Campground = require('../models/campground');

//creating db
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// always use connectio ip 127.0.0.1.27017

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({}); // this line deletes the previos data 
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 10);
        // adding new data or row in the table 
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
             image: 'https://picsum.photos/200/300?random=' + Math.random() * 1000
        })
        await camp.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
})
