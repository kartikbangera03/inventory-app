const express = require("express");
const router = express.Router();

// Require controller modules.
const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");
const productInstance_controller = require("../controllers/productInstanceController");

/// category ROUTES ///

// GET catalog home page.
router.get("/", category_controller.index);

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all categorys.
router.get("/category", category_controller.category_list);


/// product ROUTES ///

// GET request for creating a product. NOTE This must come before routes that display product (uses id).
router.get("/product/create", product_controller.product_create_get);

// POST request for creating product.
router.post("/product/create", product_controller.product_create_post);

// GET request to delete product.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete product.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update product.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update product.
router.post("/product/:id/update", product_controller.product_update_post);

// GET request for one product.
router.get("/product/:id", product_controller.product_detail);

// GET request for list of all product items.
router.get("/products", product_controller.product_list);




/// productINSTANCE ROUTES ///

// GET request for creating a productInstance. NOTE This must come before route that displays productInstance (uses id).
router.get(
  "/productinstance/create",
  productInstance_controller.productInstance_create_get,
);

// POST request for creating productInstance.
router.post(
  "/productinstance/create",
  productInstance_controller.productInstance_create_post,
);

// GET request to delete productInstance.
router.get(
  "/productinstance/:id/delete",
  productInstance_controller.productInstance_delete_get,
);

// POST request to delete productInstance.
router.post(
  "/productinstance/:id/delete",
  productInstance_controller.productInstance_delete_post,
);

// GET request to update productInstance.
router.get(
  "/productinstance/:id/update",
  productInstance_controller.productInstance_update_get,
);

// POST request to update productInstance.
router.post(
  "/productinstance/:id/update",
  productInstance_controller.productInstance_update_post,
);

// GET request for one productInstance.
router.get("/productinstance/:id", productInstance_controller.productInstance_detail);

// GET request for list of all productInstance.
router.get("/productinstances", productInstance_controller.productInstance_list);

module.exports = router;
