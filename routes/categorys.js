const express = require('express');
const router = express.Router();
const{
    allCategorys
} = require('../controller/CategoryController');

router.use(express.json());

router.get('/',allCategorys)

module.exports=router;