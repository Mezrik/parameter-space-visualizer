#!/usr/bin/env node
var fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const getRandomArbitrary = (min = 0, max = 1) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

const getRandomValue = () => {
  return getRandomArbitrary() < 0.5;
};

const generateScatterCSV = (rowCount, cols) => {
  const rows = Array(rowCount).fill(0);
  console.log(cols);

  const getRandomRow = () =>
    `${Object.values(cols)
      .map(([min, max]) => getRandomArbitrary(min, max))
      .join(',')},${getRandomValue()}`;

  return `${[...Object.keys(cols), 'value'].join(',')}\n${rows.map(getRandomRow).join('\n')}`;
};

const argv = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    describe: 'Where the output csv should go',
    type: 'string',
    default: 'scatter',
  })
  .option('rows', {
    type: 'number',
    describe: 'Row count of CSV',
    default: 100,
  })
  .option('prm', {
    type: 'array',
    describe:
      'Specifies params used in resulting data (specify range - --params.p 0 2 --params.q 0.2 3)',
    default: { p: [0, 10], q: [0, 10] },
  }).argv;

fs.writeFileSync(`${argv.output}.csv`, generateScatterCSV(argv.rows, argv.prm));
