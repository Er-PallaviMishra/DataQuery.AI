const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const productController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const authController = require('../controllers/AuthController');

router.post('/signup', authController.signup);
router.post('/login', authController.protect, authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);



router.get('/getUsers', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), UserController.getUsers);
router.get('/getUsertById', authController.protect, UserController.getUserById);
router.post('/addUser', authController.protect, UserController.addUser);
router.patch('/updateMe', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), UserController.updateMe);
router.delete('/deleteUser', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), UserController.deleteUser);


router.post('/addCategory', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), CategoryController.addCategory);
router.get('/getCategories', authController.protect, CategoryController.getCategories);
router.get('/getCategoryById', authController.protect, CategoryController.getCategoryById);
router.delete('/deleteCategory', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), CategoryController.deleteCategory);


router.get('/getProducts', authController.protect, productController.getProducts);
router.get('/getProductById', authController.protect, productController.getProductById);
router.post('/addProduct', authController.protect, authController.restrictTo('admin', 'manager', 'developer'), productController.addProduct);
router.delete('/deleteProduct', authController.protect, authController.restrictTo('admin', 'developer', 'manager'), productController.deleteProduct);


module.exports = router;