const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require('./review')

const villaSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

})

villaSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ // from review table  remove the id's of the review which ar present in the campground atable 
            _id: { $in: doc.reviews }
        })
    }
})



console.log("Done")


module.exports = mongoose.model("Campground", villaSchema)