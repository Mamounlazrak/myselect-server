const { Schema, model } = require("mongoose");

const brandSchema = new Schema(
    {
        name: String, 
        location: String, 
        description: String, 
        imageURL: {
            type: Sting,
            default: ''
        }
    },
    {
        timestamps: true,
    }
)

const Brand = model("Brand", brandSchema);

module.exports = Brand;