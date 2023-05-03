// contains CRUD functions for favourite locations
const FavoriteLocation = require('../models/favoriteLocation');

exports.createFavoriteLocation = async (req, res) => {
    const location = req.body.location;

  try {
    const favoriteLocation = new FavoriteLocation({location});
    await favoriteLocation.save();
    res.status(201).json(favoriteLocation);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.getFavoriteLocations = async (req, res) => {
    try {
        const favoriteLocations = await FavoriteLocation.find();
        res.json(favoriteLocations);
      } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateFavoriteLocation = async (req, res) => {
    const { id } = req.params;
    const { location } = req.body;

    try {
        const updatedFavoriteLocation = await FavoriteLocation.findByIdAndUpdate(
        id,
        {location},
        {new: true, runValidators: true}
        );

        if (!updatedFavoriteLocation) {
        return res.status(404).json({message: 'Location not found' });
        }

        res.json(updatedFavoriteLocation);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteFavoriteLocation = async (req, res) => {
    const { id } = req.params;

    try {
      const deletedFavoriteLocation = await FavoriteLocation.findByIdAndDelete(id);
  
      if (!deletedFavoriteLocation) {
        return res.status(404).json({message: 'Location not found'});
      }
  
      res.json({message: 'Location deleted'});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
};