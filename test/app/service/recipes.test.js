'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/recipe.test.js', () => {

  it('crawler', function* () {
    const ctx = app.mockContext({});
    const result = yield ctx.service.recipes.crawler();
    assert(result);
  });


});
