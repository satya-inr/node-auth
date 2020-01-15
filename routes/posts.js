const express = require('express');
const router = express.Router();
const PostModule = require('../modules/PostModule');
const { postValidation } = require('../modules/ValidationModule');
const verify = require('../modules/verifyToken');

/**
 * Public Posts
 */
//All posts
router.get('/', async (req, res) => {
    try {
        const posts = await PostModule.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
})

//Specific posts
router.get('/:postID', async (req, res) => {
    try {
        const post = await PostModule.findById(req.params.postID);
        res.json(post);
    } catch (err) {
        res.json({ message: err })
    }
})

/**
 * Private posts
 */
//Create posts
router.post('/create', verify, async (req, res) => {

    //Input validation
    const { error } = postValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);

    //Checking the existing post title
    const existingPost = await PostModule.findOne({ title: req.body.title })
    if (existingPost) res.status(400).send('Post title is already in use');

    const post = new PostModule({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const savePost = await post.save();
        res.status(200).json(savePost);

    } catch (err) {
        res.status(500).json({ message: err });
    }
});

//Delete posts
router.delete('/delete/:postID', verify, async (req, res) => {
    try {
        const post = await PostModule.deleteOne({ _id: req.params.postID });
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
})

//Update Posts
router.patch('/update/:postID', verify, async (req, res) => {

    const { error } = postValidation(req.body);
    if (error) res.status(400).send(error.details[0].message);

    try {
        const post = await PostModule.findOneAndUpdate({ _id: req.params.postID }, { $set: { title: req.body.title, description: req.body.description } });
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
})

module.exports = router;