const express = require('express'); //express 모듈
const router = express.Router();
const conn = require('../mariadb'); //db모듈
const {body,validationResult}= require('express-validator');

const {
    join,
    login,
    passwordResetRequest,
    passwordReset
    } = require('../controller/UserController');
router.use(express.json());

const validate = (req,res,next)=>{
    const err = validationResult(req);
    if(err.isEmpty()){
        return next();
    }
    else{
        return res.status(400).json(err.array());
    }
}

//회원가입
router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일확인필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인필요'),
        validate
    ]
    ,join);

router.post('/login',login);  //로그인
router.post('/reset',passwordResetRequest); //비밀번호 초기화 요청
router.put('/reset',passwordReset); //비밀번호 초기화 

module.exports=router