const Product = require("../models/product");
const ProductInstance = require("../models/productinstance");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body , validationResult} = require("express-validator");



// Display list of all Products.
exports.product_list = asyncHandler(async(req,res,next)=>{
    const allProducts = await Product.find({},"name category")
    .sort({name:1})
    .populate("category")
    .exec();

    res.render("product_list", {title:"Product List", productList: allProducts});
});

// Display detail page for a specific product.
exports.product_detail = asyncHandler(async(req,res,next)=>{
    const [product, product_Instance] = await Promise.all([
      Product.findById(req.params.id).populate("category").exec(),
      ProductInstance.find({product:req.params.id}).exec()
    ]);

    // console.log(product);
    if(product===null){
      const err =  new Error("Product Not Found");
      err.status = 404;
      return next(err);
    }
    console.log(product_Instance);

    res.render("product_detail",{ 
      title :product.name,
      product :product,
      productinstance : product_Instance,

    })
});


exports.product_create_get = asyncHandler(async (req, res, next) => {
    const categoryList = await Category.find().sort({name:1}).exec();

    res.render("product_form",{
      title:"Create Product Form",
      categoryList:categoryList,
    })
  });
  
  // Handle product create on POST.
exports.product_create_post = [

    body("productName","Product Name must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("companyName","Manufacturer Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("productQuantity","Quantity must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("productPrice","Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      const newProduct = new Product({
        name:req.body.productName,
        companyName:req.body.companyName,
        description:req.body.productDescription,
        category:req.body.productCategory,
        price:req.body.productPrice,
        quantity:req.body.productQuantity
      });

      if(!errors.isEmpty()){

        const categoryList = await Category.find().sort({name:1}).exec();

        res.render("product_form",{
          title:"Create Product Form",
          categoryList:categoryList,
          savedUserInput:newProduct,
          errors : errors.array(),
        })
      }else{
        await newProduct.save();
        res.redirect(newProduct.url);
      }
    })
  ];
  
  // Display product delete form on GET.
  exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const deleteProduct = await Product.findById(req.params.id).exec();
    if(deleteProduct===null){
      res.redirect("/inventory/products")
    }

    res.render("product_delete",{
      title: "Delete Product",
      product:deleteProduct
    })
  });
  
  // Handle product delete on POST.
  exports.product_delete_post = asyncHandler(async (req, res, next) => {
    await Promise.all([
      ProductInstance.deleteOne({product:req.params.id}),
      Product.findByIdAndDelete(req.params.id).exec() 
    ]).then(function(){console.log("Deleted Product and Product instance.")})
    res.redirect("/inventory/products")
  });
  
  // Display product update form on GET.
  exports.product_update_get = asyncHandler(async (req, res, next) => {
    const [categoryList , product] = await Promise.all([
      Category.find().sort({name:1}).exec(),
      Product.findById(req.params.id).exec()

    ])
    
    res.render("product_form",{
      title:"Update Product Form",
      categoryList:categoryList,
      savedUserInput:product,
    })
    
  });
  
  // Handle product update on POST.
  exports.product_update_post = [

    body("productName","Product Name must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("companyName","Manufacturer Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("productQuantity","Quantity must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("productPrice","Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      const newProduct = new Product({
        name:req.body.productName,
        companyName:req.body.companyName,
        description:req.body.productDescription,
        category:req.body.productCategory,
        price:req.body.productPrice,
        quantity:req.body.productQuantity,
        _id : req.params.id
      });

      if(!errors.isEmpty()){

        const categoryList = await Category.find().sort({name:1}).exec();

        res.render("product_form",{
          title:"Update Product Form",
          categoryList:categoryList,
          savedUserInput:newProduct,
          errors : errors.array(),
        })
        return;
      }else{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,newProduct,{ new:true});
        res.redirect(updatedProduct.url);
      }
    })
  ];