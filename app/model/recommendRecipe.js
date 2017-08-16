'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const RecommendRecipe = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    // 月份
    monthName: Number,
    // 推荐食谱名称
    recommendSeasonName: [ String ],
  });

  return mongoose.model('RecommendRecipe', RecommendRecipe);
};
