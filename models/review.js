const { number } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const reviewSchema = new Schema({
    body: String,
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema)
// new model in the mongoose created with the name =>Review , i.e reviews table created in the mongoose