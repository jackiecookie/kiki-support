'use strict';

module.exports = app => {
  class RecipeController extends app.Controller {
    * index() {
      const recipes = yield this.ctx.service.recipes.findRecipeFromdbBySeasonName('鸡蛋');
      this.ctx.body = recipes;

    }
  }
  return RecipeController;
};
