'use strict';

const dsv = require('d3-dsv');

module.exports = {
  process(fileContent) {
    return 'module.exports = ' + JSON.stringify(dsv.csvParse(fileContent)) + ';';
  },
};
