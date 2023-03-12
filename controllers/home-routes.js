const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth')
// GET all data for homepage
router.get('/', async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = dbPostData.map((Post) =>
      Post.get({ plain: true })
    );
    console.log(posts)
    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one Post for homepage
router.get('/post/:id', withAuth, async (req, res) => {
  
    // If the user is logged in, allow them to view the Post
    try {
      const dbPostData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ['password']
            },
          },
        ],
      });
      const post = dbPostData.get({ plain: true });
      res.render('post', { post, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});


// Handle accidental routes to /login
router.get('/login', (req, res) => {
  console.log(req.session.loggedIn)
  if (req.session.loggedIn) {
    console.log(`Get /login: User is logged in. Redirecting to /`)
    res.redirect('/');
    return;
  }
  console.log(`Get /login: User is not logged in. Rendering login page`)
  res.render('login');
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    const validPassword = await dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    req.session.save(() => {
      req.session.loggedIn = true;
      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' })
        .redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.get('/logout', (req, res) => {
  if (req.session.loggedIn) {
    console.log(`Get /logout: User is logged in. Destroying session and redirecting to /`)
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    console.log(`Get /logout: User is not logged in. Redirecting to /`)
    res.status(404).redirect('/');
  }
});

module.exports = router;
