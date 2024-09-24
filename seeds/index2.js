
// before running the project for the first time this inde2.js should be run to create and populate the database
//index2.js is poupulating is the database so here the data should be manually enterd 



const { default: mongoose } = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');//destructuring assingment importinmg two seperate variable in single line of code 
const Campground = require('../models/campground');

//creating db
mongoose.connect('mongodb://127.0.0.1:27017/villas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// always use connectio ip 127.0.0.1.27017

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



// randomly selecting the description 
// this sample takes the array as input and give random elemtn from array
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({}); // this line deletes the previos data 
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 10);
        // adding new data or row in the table 
        const camp = new Campground({

            //more things describing the villas can be added  can be added
            // this below codes populates the database
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,

            // randomly selecting the image from the website it needs to be modified based on input from the user 
            image: 'https://picsum.photos/200/300?random=' + Math.random() * 1000
        })
        await camp.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
})
