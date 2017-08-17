'use strict';

module.exports = app => {
  class Recipes extends app.Service {
    * getRecommendRecipes(month) {
      return yield this.ctx.model.RecommendRecipe.find({ monthName: month }).exec();
    }
    * findRecipeFromdbBySeasonName(seasonName) {
      return yield this.ctx.model.Recipe.find({ 'seasoning.name': new RegExp(seasonName) }).exec();
    }
    * findRecipeFromdbBySeasonNames(seasonNames, pageIndex, pageSize) {
      pageIndex = pageIndex || 1;
      pageSize = pageSize || 10;
      const skipCount = (pageIndex - 1) * pageSize;
      const seasonNameRegex = seasonNames.join('|');
      return yield this.ctx.model.Recipe.find({ 'seasoning.name': new RegExp(seasonNameRegex) })
          .skip(skipCount)
          .limit(pageSize)
          .select('-seasoning -steps')    // exclude seasoning and steps include other fields
          .exec();
    }
    * addOrUpdateRecommendRecipe(month, seasonNames) {
      const recommendRecipeClass = this.ctx.model.RecommendRecipe;
      return yield recommendRecipeClass.findOneAndUpdate({ monthName: month }, { $push: { recommendSeasonName: seasonNames } }, {
        upsert: true,
        new: true,
      }).exec();
    }
    * clearRecommendRecipe(month, seasonName) {
      const recommendRecipeClass = this.ctx.model.RecommendRecipe;
      const update = seasonName && month;
      const mongoPromise = update ?
        recommendRecipeClass.findOneAndUpdate({ monthName: month }, { $pull: { recommendSeasonName: seasonName } }, { new: true }) :
        recommendRecipeClass.remove({});
      const model = yield mongoPromise.exec();
      console.log(model.recommendSeasonName);
      return update ? model.recommendSeasonName.indexOf(seasonName) === -1 : model.result.ok > 0;
    }
  }
  return Recipes;
};

