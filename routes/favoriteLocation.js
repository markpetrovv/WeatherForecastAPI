const express = require('express');
const router = express.Router();
const favoriteLocationController = require('../controllers/favoriteLocationController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.post('/', ensureAuthenticated, favoriteLocationController.createFavoriteLocation);
router.get('/', ensureAuthenticated, favoriteLocationController.getFavoriteLocations);
router.put('/:id', ensureAuthenticated, favoriteLocationController.updateFavoriteLocation);
router.delete('/:id', ensureAuthenticated, favoriteLocationController.deleteFavoriteLocation);

module.exports = router;