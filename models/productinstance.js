const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

const ProductInstanceSchema = new Schema({
   product:{ type: Schema.Types.ObjectId , ref:"Product" , required: true},
   number_in_stock : { type: Number, required: true , min: 0},
   status : { type: String , required: true , enum : ["Available", "Unavailable"] , default: "Unavailable"}
});

ProductInstanceSchema.virtual("url").get(function(){
    return `/inventory/productinstance/${this._id}`;
});

module.exports = mongoose.model("ProductInstance", ProductInstanceSchema);