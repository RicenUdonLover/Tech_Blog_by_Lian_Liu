const router = require('express').Router();
const { User, Post } = require('../../models');

// CREATE new user
router.post('/', async (req, res) => {
  try {
    const dbUserData = await User.create(req.body);
    req.session.save(() => {
      req.session.loggedIn = true;
      res.status(200).json({ user: dbUserData, message: 'User created' });
    });
  } catch (err) {
    console.log(`Error in POST /api/users`, err);
    res.status(500).json(err);
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Post }]
    });
    if (!dbUserData) {
      res.status(404).json({ message: 'No users found' });
      return;
    }
    res.status(200).json({ dbUserData, message: 'Showing all users' });
  } catch (err) {
    console.log(`Error in GET /api/users`, err);
    res.status(500).json(err);
  }
});

// GET user by id
router.get('/:id', async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }]
    });
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.status(200).json({ dbUserData, message: 'User found' });
  } catch (err) {
    console.log(`Error in GET /api/users/:id`, err);
    res.status(500).json(err);
  }
});

// UPDATE user by id
router.put('/:id', async (req, res) => {
  try {
    const dbUserData = await User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id,
      },
    });
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.status(200).json({ dbUserData, message: 'User updated' });
  } catch (err) {
    console.log(`Error in PUT /api/users/:id`, err);
    res.status(500).json(err);
  }
});

// DELETE user by id
router.delete('/:id', async (req, res) => {
  try {
    const dbUserData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.status(200).json({ dbUserData, message: 'User deleted' });
  } catch (err) {
    console.log(`Error in DELETE /api/users/:id`, err);
    res.status(500).json(err);
  }
});




module.exports = router;
