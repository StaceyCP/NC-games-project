const { getCategories } = require('../controllers/app_controller');

const categoriesRouter = require('express').Router();

categoriesRouter.get('/', getCategories);

module.exports = categoriesRouter