'use strict';
const Crawler = require('crawler');

module.exports = app => {
  class Recipes extends app.Service {
    errorProsses(error) {
      app.logger.error(error);
    }
    * crawler() {
        yield this.getPromiseCrawler({},'https://m.xiachufang.com/')
            .then(this.homePageCrawler)
            .then(this.categoryPageCrawler).catch(this.errorProsses);
    }
    homePageCrawler(mixinObj){
      let {res, done,target} =mixinObj;
      let urlArray = [];
      let $ = res.$;
      let categorys = $('.pop-category');
      categorys.each(function (i, elm) {
        let rUrl=elm.attribs['href'];
        urlArray.push(rUrl);
      })
       done();
      return target.getPromiseCrawler1({},urlArray);
    }
    categoryPageCrawler(mixinObj){
      let {res, done,target} =mixinObj
      return '1';
    }
    getPromiseCrawler(option,urls){
        let self=this;
      var promise=new Promise(function (resolve, reject) {
          var callback=function(error, res, done){
              if(error){
                  reject(error);
              }else{
                  resolve({
                      res:res,
                      done:done,
                      target:self
                  });
              }
          }
          option.callback=callback;
          let c= new Crawler(option);
          c.queue(urls);
      })
      return promise;
    }
  }
  return Recipes;
};

