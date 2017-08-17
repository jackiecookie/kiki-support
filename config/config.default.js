'use strict';

module.exports = appInfo => {


  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1502524495070_1690';

  config.mongoose = {
    url: 'mongodb://127.0.0.1',
    options: {},
  };
    let isInnerIp=function(ip){
        return ip==='::1';
    }
  config.security = {
      csrf: {
          // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
          ignore: ctx => isInnerIp(ctx.ip),
      },
  }

  return config;
};

