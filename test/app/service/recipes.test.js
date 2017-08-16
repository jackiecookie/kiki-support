'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/recipe.test.js', () => {

  it('addOrUpdateRecommendRecipe', function* () {
    const ctx = app.mockContext({});
    yield ctx.service.recipes.addOrUpdateRecommendRecipe(1, '皮蛋');
    // assert(result);
  });
  it('clearRecommendRecipe', function* () {
    const ctx = app.mockContext({});
    const isOk = yield ctx.service.recipes.clearRecommendRecipe();
    assert.ok(isOk);
  });


});
