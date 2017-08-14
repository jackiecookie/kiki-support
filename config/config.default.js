'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1502524495070_1690';

  config.mongoose = {
    url: 'mongodb://127.0.0.1',
    options: {},
  };

  return config;
};

