const router = require('express').Router();
const UserModel = require('../modules/UserModule');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { registerValidation, loginValidation } = require('../modules/ValidationModule');

//Registration
router.post('/register', async (req, res) => {

    //Input validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //To check email already exists
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already in use');

    //Password hashing
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);

    //Creating user
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savePost = await user.save();
        res.status(200).json(savePost._id);
    } catch (err) {
        res.status(500).json({ message: err });
    }
})

//Login with jwt token creation
router.post('/login', async (req, res) => {

    //Input validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Email validation
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email not exists');

    //Password validation
    const verifyPassword = await bcryptjs.compare(req.body.password, user.password);
    if (!verifyPassword) return res.status(400).send('Invalid Password');

    //Generating Token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECREAT);
    res.header('auth-token', token).send(token);
})

module.exports = router;