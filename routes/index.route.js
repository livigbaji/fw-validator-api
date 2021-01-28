const router = require('express').Router();
const IndexController = require('../controllers/index.controller');

router.get('/', IndexController.get);

module.exports = router;