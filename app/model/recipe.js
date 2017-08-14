'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Recipe = new mongoose.Schema({
    id: String,
    recipeName: String,
    recipeDescription: String,
    imageUrl: String,
    seasoning: [ mongoose.Schema.Types.Mixed ],
    steps: [ mongoose.Schema.Types.Mixed ],

  });

  return mongoose.model('Recipe', Recipe);
};
