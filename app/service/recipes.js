'use strict';

module.exports = app => {
  class Recipes extends app.Service {
    * findRecipeFromdbBySeasonName(seasonName) {
      return yield this.ctx.model.Recipe.find({ 'seasoning.name': new RegExp(seasonName) }).exec();
    }
    * addOrUpdateRecommendRecipe(month, seasonNames) {
      const recommendRecipeClass = this.ctx.model.RecommendRecipe;
      let oldModel = yield recommendRecipeClass.findOne({ monthName: month }).exec();
      if (!oldModel) {
        oldModel = new recommendRecipeClass({
          monthName: month,
          recommendSeasonName: [],
        });
      }
      if (!oldModel.recommendSeasonName.includes(seasonNames)) {
        oldModel.recommendSeasonName.push(seasonNames);
        oldModel.save();
      }
    }
    * clearRecommendRecipe() {
      const count = yield this.ctx.model.RecommendRecipe.remove({}).exec();
      return count.result.ok > 0;
    }
  }
  return Recipes;
};

