'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/recipe.test.js', () => {
  const month = 8;
  const seaonName = '测试';
  it('addOrUpdateRecommendRecipe', function* () {
    const ctx = app.mockContext({});
    const result = yield ctx.service.recipes.addOrUpdateRecommendRecipe(month, seaonName);
    assert.ok(result);
  });
  it('clearRecommendRecipe', function* () {
    const ctx = app.mockContext({});
    const isOk = yield ctx.service.recipes.clearRecommendRecipe(month, seaonName);
    assert.ok(isOk);
  });


});
