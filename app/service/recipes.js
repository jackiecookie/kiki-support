'use strict';
const Crawler = require('crawler');
const Promise = require('bluebird');
const co = require('co');

module.exports = app => {
  class Recipes extends app.Service {
    errorProsses(error) {
      app.logger.error(error);
    }
    * crawler() {
      const self = this;
      // 抓取数量
      self.crawlerCount = 0;
      try {
        const startObj = yield this.getPromiseCrawler({}, 'https://m.xiachufang.com/');
        const recipes = yield this.findRecipes(startObj);
        const restlt = yield this.wrapRecipePageCrawler(recipes);
        return restlt;
      } catch (error) {
        self.errorProsses(error);
      }

    }
    * wrapRecipePageCrawler(recipes) {
      const self = this;
      yield new Promise(function() {
        co(function* () {
          const res = yield recipes;
          const fn = co.wrap(function* (mix) {
            yield self.recipePageCrawler(mix);
          });
          res.forEach(fn);
        });
      });

    }
    * findRecipes(mixinObj) {
      const target = this;
      const { res, done } = mixinObj;

      const $ = res.$;
      const recipeElms = $('.recipe-96-horizon');


      const promiseArray = yield new Promise(function(resolve) {
        const promiseArray = [];
        let eachFlag = 1;
        const fn = co.wrap(function* (i, elm) {
          const rUrl = elm.attribs.href;
          const recipeId = target.findIdFromRecipePath(rUrl);
          const exist = yield target.recipeIdExist(recipeId);
          if ((!exist && rUrl) || promiseArray.length === 0) {
            promiseArray.push(target.getPromiseCrawler({}, rUrl));
          }
          if (++eachFlag === recipeElms.length) {
            resolve(promiseArray);
          }
        });
        recipeElms.each(fn);
      });


      done();
      return promiseArray;
    }
    * recipePageCrawler(mixinObj) {
      const { res, done, target } = mixinObj;
      // const logger = app.logger;
      const path = res.request.path;
      const $ = res.$;
      const ctx = target.ctx;
      const recipeId = target.findIdFromRecipePath(path);
      const exist = yield target.recipeIdExist(recipeId);
      if (!exist) {
        const hasElm = function(elm) {
          return elm && elm[0] ? elm : null;
        };
        console.log('保存食谱 %s', path);
        const seasoning = [];
        const steps = [];
        // 食谱名称
        const recipeName = $('#name h1').text().trim();
        // 食谱描述
        const recipeDescription = $('#description .recipe-desc').text().trim();
        // 食谱描述图片
        const recipeImageUrl = $('#site-body .recipe-cover mip-img')[0].attribs.src;
        // 佐料
        const seasoningElm = $('#ings .plain li');
        seasoningElm.each(function(i, elm) {
          const $self = $(elm);
          let ingredient = $self.find('.ingredient');
          if (hasElm(ingredient)) {
            const ingredientSub = ingredient.first().find('a');
            ingredient = hasElm(ingredientSub) ? ingredientSub : ingredient;
          }
          const ingredientText = hasElm(ingredient) ? ingredient.first().text().trim().replace('\n', '') : '';
          const weightElm = $self.find('.weight');
          const weight = hasElm(weightElm) ? weightElm.first().text().trim() : '';
          seasoning.push({
            name: ingredientText,
            weight,
          });
        });
        // 步骤
        const stepElm = $('#steps .plain li');
        stepElm.each(function(i, elm) {
          const $self = $(elm);
          const stepImgElm = $self.find('.step-cover mip-img');
          const stepImg = hasElm(stepImgElm) ? stepImgElm[0].attribs.src : '';
          const wordElm = $self.find('.word-wrap');
          const word = hasElm(wordElm) ? wordElm.first().text().trim() : '';
          steps.push({
            img: stepImg,
            description: word,
          });
        });

        const recipeClass = ctx.model.Recipe;
        const recipeModel = new recipeClass({
          id: recipeId,
          recipeName,
          recipeDescription,
          imageUrl: recipeImageUrl,
          seasoning,
          steps,
        });
        recipeModel.save(function(error) {
          if (error) {
            app.logger.error(error);
          }
        });
      }
      done();
      const recipes = yield this.findRecipes(mixinObj);
      yield this.wrapRecipePageCrawler(recipes);
    }
    * recipeIdExist(recipeId) {
      return yield this.ctx.model.Recipe.count({ id: recipeId }).exec().then(function(count) {
        return count > 0;
      });
    }
    getPromiseCrawler(option, urls) {
      const self = this;
      const promise = new Promise(function(resolve, reject) {
        const callback = function(error, res, done) {
          if (error) {
            reject(error);
          } else {
            resolve({
              res,
              done,
              target: self,
            });
          }
        };
        option.callback = callback;
        const c = new Crawler(option);
        c.queue(urls);
      });
      return promise;
    }
    findIdFromRecipePath(path) {
      const matchRegex = /recipe\/(\d+)\//;
      const matchGroups = matchRegex.exec(path);
      return matchGroups && matchGroups.length > 0 && (matchGroups[1] || '');
    }
  }
  return Recipes;
};

