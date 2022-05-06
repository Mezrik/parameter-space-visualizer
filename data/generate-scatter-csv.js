#!/usr/bin/env node
var fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const getRandomArbitrary = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

const getRandomValue = () => {
  return getRandomArbitrary() < 0.5;
};

const generateScatterCSV = (rowCount, cols, [xmin, xmax], [ymin, ymax]) => {
  const rows = Array(rowCount).fill(0);
  const getRandomRow = () =>
    `${getRandomArbitrary(xmin, xmax)},${getRandomArbitrary(ymin, ymax)},${getRandomValue()}`;

  return `${cols.join(',')}\n${rows.map(getRandomRow).join('\n')}`;
};

const argv = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    describe: 'Where the output csv should go',
    type: 'string',
    default: 'scatter',
  })
  .option('x', {
    type: 'array',
    describe: 'Specifies range for x scale',
    default: [0, 10],
  })
  .option('y', {
    type: 'array',
    describe: 'Specifies range for y scale',
    default: [0, 10],
  }).argv;

console.log(argv);

fs.writeFileSync(
  `${argv.output}.csv`,
  generateScatterCSV(100, ['p', 'q', 'value'], argv.x, argv.y),
);
