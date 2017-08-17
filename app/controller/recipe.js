'use strict';

module.exports = app => {
  class RecipeController extends app.Controller {
    * findRecipe() {
      const recipes = yield this.ctx.service.recipes.findRecipeFromdbBySeasonName('鸡蛋');
      this.ctx.body = recipes;
    }
    * addRecommendRecipe() {
      const query = this.ctx.query;
      const month = query.month;
      const recommendSeasonName = query.recommendSeasonName;
      if (month && recommendSeasonName) {
        yield this.ctx.service.recipes.addOrUpdateRecommendRecipe(month, recommendSeasonName);
      }
      this.ctx.body = 'ok';
    }
    * getRecommendRecipee() {
      this.ctx.response.set('Access-Control-Allow-Origin','*')
      // 根据当前月份获得推荐的食材
      let recommendRecipe;
      const recipesService = this.ctx.service.recipes;
      const currentMonth = ((new Date()).getMonth()) + 1;
      const recommendRecipes = yield recipesService.getRecommendRecipes(currentMonth);
      if (recommendRecipe = recommendRecipes && recommendRecipes[0]) {
        const recipes = yield recipesService.findRecipeFromdbBySeasonNames(recommendRecipe.recommendSeasonName);
        this.ctx.body = recipes;
      }
      // this.ctx.body = recommendRecipes;
    }
  }
  return RecipeController;
};
