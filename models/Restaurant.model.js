const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema(
    {
        name: String, 
        averagePrice: Number,
        location: String, 
        locationGPS: { type: { type: String }, coordinates: [Number] },
        description: String, 
        imageURL: {
            type: String, 
            default: 'https://www.ramw.org/sites/default/files/styles/content/public/default_images/default-news.jpg?itok=jsMUP47r'
        },
        ofTheWeek: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

restaurantSchema.index({locationGPS: '2dsphere'})

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;