const mongoose = require("mongoose")
const Schema = mongoose.Schema;


// adding the schema to database for elements of the website showing details of the villas(modify more if required) 
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    image: String

})
console.log("Done")

//** */
module.exports = mongoose.model("Campground", CampgroundSchema)