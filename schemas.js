
const Joi = require('joi')
module.exports.campgroundSchema = Joi.object({
    //campground object created because inside campground(passed from req.body submtted by form contain campground object) there are many properties, since in JOI one property at a time to group all together, campground object created
    campground: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().uri(),
        location: Joi.string().required()
        //price:joi.number()

    }).required()
});