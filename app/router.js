'use strict';

module.exports = app => {
  const recipeController = app.controller.recipe;
  app.get('/recommendRecipe/add', recipeController.addRecommendRecipe);
  app.post('/recommendRecipe/get', recipeController.getRecommendRecipee);
};
