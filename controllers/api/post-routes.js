const router = require('express').Router();
const { Post, User } = require('../../models');


// GET all posts
router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll(
            {
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                    },
                ],
            },
        );
        if (!dbPostData) {
            res.status(404).json({ message: 'No posts found' });
            return;
        }
        res.status(200).json({dbPostData, message: 'Showing all posts'});
    } catch (err) {
        console.log(`Error in GET /api/posts`, err);
        res.status(500).json(err);
    }
});

// GET post by id
router.get('/:id', async (req, res) => {
    try { 
        const dbPostData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.status(200).json({dbPostData, message: 'Post found'});
    } catch (err) {
        console.log(`Error in GET /api/posts/:id`, err);
        res.status(500).json(err);
    }
});

// CREATE new post
router.post('/', async (req, res) => {
    try {
        const dbPostData = await Post.create(req.body);
        res.status(200).json({dbPostData, message: 'Post created'});
    } catch (err) {
        console.log(`Error in Post /api/posts`, err);
        res.status(500).json(err);
    }
});

// UPDATE post by id
router.put('/:id', async (req, res) => {
    try {
        const dbPostData = await Post.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.status(200).json({dbPostData, message: 'Post updated'});
    } catch (err) {
        console.log(`Error in PUT /api/posts/:id`, err);
        res.status(500).json(err);
    }
});


// DELETE post by id
router.delete('/:id', async (req, res) => {
    try {
        const dbPostData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.status(200).json({dbPostData, message: 'Post deleted'});
    } catch (err) {
        console.log(`Error in DELETE /api/posts/:id`, err);
        res.status(500).json(err);
    }
});


module.exports = router;
