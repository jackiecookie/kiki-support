'use strict';
const Crawler = require('crawler');

module.exports = app => {
  class Recipes extends app.Service {
    errorProsses(error) {
      app.logger.error(error);
    }
    * crawler() {
      yield this.getPromiseCrawler({}, 'https://m.xiachufang.com/')
        .then(this.homePageCrawler)
        .then(this.categoryPageCrawler)
        .catch(this.errorProsses);
    }
    homePageCrawler(mixinObj) {
      const { res, done, target } = mixinObj;
      const urlArray = [];
      const $ = res.$;
      const categorys = $('.pop-category');
      categorys.each(function(i, elm) {
        const rUrl = elm.attribs.href;
        urlArray.push(rUrl);
      });
      done();
      return target.getPromiseCrawler1({}, urlArray);
    }
    categoryPageCrawler(mixinObj) {
      const { res, done, target } = mixinObj;
      return '1';
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
  }
  return Recipes;
};

