const router = require('express').Router();
const mongoose = require('mongoose');

const Restaurant = require ('../models/Restaurant.model');
const User = require ('../models/User.model')

const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

router.post('/restaurants', (req, res, next) => {
    const {name, averagePrice, location, latitude, longitude, description, imageURL} = req.body;

    Restaurant.create({name, averagePrice, location, 
      locationGPS: {
        type: 'Point', 
        coordinates: [longitude, latitude]
    },
    description, imageURL})
    .then((response) => res.json(response))
    .catch((err) => next(err))
})


router.get('/restaurants', (req, res, next) => {
    Restaurant.find()
        .then((response) => res.json(response))
        .catch((err) => res.json(err))
})

router.get('/restaurants/:restaurantId', (req, res, next) => {
    const { restaurantId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Specified Id is not valid' });
      return;
    }
  
    Restaurant.findById(restaurantId)
      .then((response) => res.json(response))
      .catch((err) => res.json(err));
  });
  
  router.put('/restaurants/:restaurantId', (req, res, next) => {
    const { restaurantId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Specified Id is not valid' });
      return;
    }
  
    Restaurant.findByIdAndUpdate(restaurantId, req.body, { new: true })
      .then((response) => res.json(response))
      .catch((err) => res.json(err));
  });

  router.delete('/restaurants/:restaurantId', (req, res, next) => {
    const { restaurantId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({ message: 'Specified Id is not valid' });
      return;
    }
    Restaurant.findByIdAndRemove(restaurantId)
      .then(() => res.json({ message: `Restaurant with ${restaurantId} was removed successfully` }))
      .catch((err) => res.json(err));
  });

  router.get('/myrestaurants/no-populate/:userId', (req, res, next) => {
      const { userId } = req.params 
      User.findById(userId)
        // .populate('restaurantsList')
        .then((user) => res.json(user.restaurantsList))
        .catch((err) => next(err));
  });

  router.get('/myrestaurants/:userId', (req, res, next) => {
    const { userId } = req.params 
    User.findById(userId)
      .populate('restaurantsList')
      .then((user) => res.json(user.restaurantsList))
      .catch((err) => next(err));
});

  router.put('/myrestaurants/:userId/:restaurantId', (req, res, next) => {
      const { userId, restaurantId } = req.params

        User.findById(userId) 
            .then((user) => {
                if(user.restaurantsList.includes(restaurantId)) {
                    User.findByIdAndUpdate(userId, {$pull : {restaurantsList: restaurantId}}, {new: true})
                    .then((user) => res.json(user.restaurantsList))
                    .catch((err) => res.json(err));

                } else {

                    User.findByIdAndUpdate(userId, {$push : {restaurantsList: restaurantId}}, {new: true})
                    .then((user) => res.json(user.restaurantsList))
                    .catch((err) => res.json(err));
                }
            })
            .catch((err) => console.log(err))
  })

  router.get('/restaurant-of-the-week', (req, res, next) => {
    Restaurant.findOne({ofTheWeek: true})
      .then((restaurant) => res.json(restaurant))
      .catch((err) => res.json(err))
  })  


  // router.get('/restaurant-of-the-week', (req, res, next) => {
  //   Restaurant.find({ofTheWeek: true})
  //     .then((restaurants) => res.json(restaurants))
  //     .catch((err) => res.json(err))
  // }) 

  
  
  module.exports = router;