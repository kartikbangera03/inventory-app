const ProductInstance = require("../models/productinstance");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { body , validationResult} = require("express-validator");
const product = require("../models/product");

// Display list of all Product Instances.
exports.productInstance_list = asyncHandler(async(req,res,next)=>{
    // res.send('Not implemented : Product Instance List');

    const allProductInstances = await ProductInstance.find()
    .populate("product")
    .exec();
    // console.log("All Product Instances")
    // console.log(allProductInstances)
    res.render("productinstance_list", {
      title:"Product Instance List",
      productinstance_list: allProductInstances,
    })
});

// Display detail page for a specific Product Instance.
exports.productInstance_detail = asyncHandler(async(req,res,next)=>{
    // res.send(`NOT IMPLEMENTED: Product Instance detail: ${req.params.id}`);

    const productInstanceDetail =  await ProductInstance.findById(req.params.id)
        .populate("product")
        .exec()

    console.log(productInstanceDetail);
    res.render("productinstance_detail", {
      title: "Product Instance Details",
      productinstance : productInstanceDetail
    })    
});

// Display Product Instance create form on GET.
exports.productInstance_create_get = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find().sort({name:1}).exec();

    res.render("productinstance_form" , {
      title:"Create Product Instance Form",
      productList : allProducts,
    })
  });
  
  // Handle Product Instance create on POST.
  exports.productInstance_create_post = [
    body("productInstanceInStockNumber","Instock number must not be empty")
      .trim()
      .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);
      
    const newProductInstance = new ProductInstance({
      product:req.body.productInstanceProduct,
      number_in_stock : req.body.productInstanceInStockNumber,
      status : req.body.productInstanceStatus
    })

    if(!errors.isEmpty()){

      const allProducts = await Product.find().sort({name:1}).exec();

      res.render("productinstance_form" , {
        title:"Create Product Instance Form",
        productList : allProducts,
        savedUserInput : newProductInstance,
        errors: errors.array()
      })
    }else{
      await newProductInstance.save();
      res.redirect(newProductInstance.url);
    }
    })
  ]
  
  // Display Product Instance delete form on GET.
  exports.productInstance_delete_get = asyncHandler(async (req, res, next) => {

  });
  
  // Handle Product Instance delete on POST.
  exports.productInstance_delete_post = asyncHandler(async (req, res, next) => {

  });
  
  // Display Product Instance update form on GET.
  exports.productInstance_update_get = asyncHandler(async (req, res, next) => {
    // const allProducts = await Product.find().sort({name:1}).exec();
    const product_instance = await ProductInstance.findById(req.params.id).populate("product").exec()
    
    console.log("Default Product")
    console.log(product_instance);
    res.render("productinstance_form" , {
      title:"Update Product Instance Form",
      savedUserInput : product_instance,
      editMode : true
    })
  });
  
  // Handle Product Instance update on POST.
  exports.productInstance_update_post = [
    body("productInstanceInStockNumber","Instock number must not be empty")
      .trim()
      .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);
      
      const productinstance = await ProductInstance.findById(req.params.id).populate("product").exec();

      const newProductInstance = new ProductInstance({
        product : productinstance.product , 
        number_in_stock : req.body.productInstanceInStockNumber,
        status : req.body.productInstanceStatus,
        _id : req.params.id
        })

    if(!errors.isEmpty()){

      // const allProducts = await Product.find().sort({name:1}).exec();

      res.render("productinstance_form" , {
        title:"Update Product Instance Form",
        // productList : allProducts,
        savedUserInput : newProductInstance,
        errors: errors.array()
      })
    }else{
      const updatedProductInstance = await ProductInstance.findByIdAndUpdate(req.params.id,newProductInstance,{ new:true});
        res.redirect(updatedProductInstance.url);
    }
    })
  ]