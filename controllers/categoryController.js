const Category = require("../models/category");
const Product = require("../models/product");
const ProductInstance = require("../models/productinstance");
const asyncHandler = require("express-async-handler");
const { body , validationResult} = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    // res.send("NOT IMPLEMENTED: Site Home Page");

    const [
      numProducts,
      numProductInstances,
      numCategory
    ] = await Promise.all([
      Product.countDocuments({}).exec(),
      ProductInstance.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Inventory App Home",
      product_count: numProducts,
      product_instance_count: numProductInstances,
      category_count: numCategory,
    });
  });

  
// Display list of all Category s.
exports.category_list = asyncHandler(async(req,res,next)=>{

    const category_collection = await Category.find({},"name")
    .sort({name:1})
    .exec();
    
    res.render("category_list",{ title:"Category List", category_list :category_collection});
});

// Display detail page for a specific Category .
exports.category_detail = asyncHandler(async(req,res,next)=>{
    // res.send(`NOT IMPLEMENTED: Category  detail: ${req.params.id}`);

    const [categoryDetail , categoryProducts] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({category:req.params.id}).exec()
    ])

    console.log(categoryProducts);
    res.render("category_detail", {
      title: "Category Info",
      categoryDetails : categoryDetail,
      categoryProducts : categoryProducts, 
    })
});

// Display Category  create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  // const categoryList = await Category.find().sort({name:1}).exec();

  res.render("category_form",{
    title:"Create Category Form"
  })
  });
  
  // Handle Category  create on POST.
  exports.category_create_post = [
    body("categoryName","Category Name must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("categoryDescription","Description Invalid")
    .trim()
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      console.log("Request Body :");
      console.log(req.body);

      // let descriptionVal = undefined
      // if(req.body.categoryDescription){
      //     descriptionVal = req.body.categoryDescription;
      //   }

      const newCategory = new Category({
        name:req.body.categoryName,
        description:req.body.categoryDescription ? req.body.categoryDescription : " " ,
      });


      console.log("Saved User Input :");
      console.log(newCategory);

      if(!errors.isEmpty()){
        res.render("category_form",{
          title:"Create Category Form",
          savedUserInput:newCategory,
          errors : errors.array(),
        })

      }else{
        await newCategory.save();
        res.redirect(newCategory.url);
      }
    })
  ]
  
  // Display Category  delete form on GET.
  exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }, "name companyName").exec(),
    ]);
  
    if (category === null) {
      // No results.
      res.redirect("/catalog/authors");
    }
  
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_products: allProductsByCategory,
    });
  });
  
  // Handle Category  delete on POST.
  exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, allProductsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Product.find({ category: req.params.id }, "name companyName").exec(),
    ]);
  
    if (allProductsByCategory.length > 0) {
      // Category has Products. Render in same way as for GET route.
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        categoryProducts: allProductsByCategory,
      });
      return;
    } else {
      // Category has no Products. Delete object and redirect to the list of Categorys.
      await Category.findByIdAndDelete(req.body.categoryid);
      res.redirect("/inventory/category");
    }
  });
  
  // Display Category  update form on GET.
  exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()
    
    res.render("category_form",{
      title:"Create Category Form",
      savedUserInput:category,
    });
  });
  
  // Handle Category  update on POST.
  exports.category_update_post = [
    body("categoryName","Category Name must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("categoryDescription","Description Invalid")
    .trim()
    .escape(),

    asyncHandler(async (req,res,next)=>{
      const errors = validationResult(req);

      console.log("Request Body :");
      console.log(req.body);

      // let descriptionVal = undefined
      // if(req.body.categoryDescription){
      //     descriptionVal = req.body.categoryDescription;
      //   }

      const newCategory = new Category({
        name:req.body.categoryName,
        description:req.body.categoryDescription ? req.body.categoryDescription : " " ,
        _id : req.params.id
      });


      console.log("Saved User Input :");
      console.log(newCategory);

      if(!errors.isEmpty()){
        res.render("category_form",{
          title:"Create Category Form",
          savedUserInput:newCategory,
          errors : errors.array(),
        })

      }else{
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id , newCategory , {new :true});
        res.redirect(updatedCategory.url);
      }
    })
  ]