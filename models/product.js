const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

const ProductSchema = new Schema({
    name:{type:String, requried:true, maxLength:200},
    companyName:{type:String, requried:true, maxLength:100},
    description:{type:String, requried:true, maxLength:500},
    category:{type:Schema.Types.ObjectId, ref:"Category" , requried: true},
    price:{type:Number, requried: true , min: 1},
    quantity:{type:String, requried: true},
});

ProductSchema.virtual("url").get(function(){
    return `/inventory/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);