#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Product = require("./models/product");
  const Category = require("./models/category");
  const ProductInstance = require("./models/productinstance");
  
  
  const products = [];
  const categories = [];
  const productinstances = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createProducts();
    await createProductInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name , description) {
    const categoryDetail = { name: name }
    if(description!=false) categoryDetail.description = description ; 
    
    const category = new Category(categoryDetail);
    
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }

  async function createCategories() {
    console.log("Adding genres");
    await Promise.all([
        categoryCreate(0, "Baby Care"),
        categoryCreate(1, "Pet Supplies"),
        categoryCreate(2, "Beauty and Grooming"),
        categoryCreate(3, "Cleaning Essentials" , "Medium to Strong Chemical Solutions for all surface cleaning purpose" ),
        categoryCreate(4, "Tea Coffee and More"),
    ]);
  }
  



  async function productCreate(index, name , companyName, description , category , price , quantity){
    const product = new Product({name: name,companyName:companyName ,description:description , category:category , price:price , quantity:quantity});

    await product.save();
    products[index] = product;
    console.log(`Added product: ${name}`);
  }


  async function createProducts(){
    console.log("Adding Products");

    await Promise.all([
        productCreate(0, "Society Tea ", "Hasmukhlal & Co." , "Supreme CTC tea leaves for rich and robust flavor" , categories[4] , 279 , "500g"   ),
        productCreate(1, "Classic Instant Coffee Powder ", "Nescafe" , "A careful blend of high-quality coffee beans and expert roasting techniques" , categories[4] , 375 , "90g" ),
        productCreate(2, "Chicken & Liver Chunks", "Pedigree" , "Ideal and high quality ingredients for a happy, healthy dog" , categories[1] , 45 , "70g"   ),
        productCreate(3, "Matiq Liquid Detergent", "Comfort" , "Top Load Pouch 2L and Comfort After Wash fabric Conditioner" , categories[3] , 591 , "1 Combo"   ),
        productCreate(4, "New York Colossal Kajal Black", "Maybelline" , "Intensely black and bold payoff. Smudge-proof and Waterproof formula. 36hr Lasting wear" , categories[2] , 189 , "0.35g"   ),
    ]); 
    }


    async function productInstanceCreate(index, product, number_in_stock , status){
        const productInstance =  new ProductInstance({
            product : product, 
            number_in_stock : number_in_stock , 
            status : status
        });

        await productInstance.save();
        productinstances[index] = productInstance;
        console.log(`Added product instance for : ${product.name}`)
    }

    async function createProductInstances(){
        console.log("Adding product instances");

        await Promise.all([
            productInstanceCreate(0,products[0],500,"Available"),
            productInstanceCreate(1,products[1],100,"Available"),
            productInstanceCreate(2,products[2],200,"Available"),
            productInstanceCreate(3,products[3],0,"Unavailable"),
            productInstanceCreate(4,products[4],20,"Available"),
        ]);
    }