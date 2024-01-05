const express = require('express');
const router = express.Router();

const {
    addLike,
    removeLike
}=require('../controller/LikeController');

router.use(express.json());
//좋아요추가
router.post('/:id',addLike);

//좋아요취소
router.delete('/:id',removeLike);

module.exports=router;