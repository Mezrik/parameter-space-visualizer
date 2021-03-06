import { useEffect, useState, useRef } from 'preact/hooks';
import { Button, Tabs } from '@mantine/core';
import { csvParse } from 'd3-dsv';

import { COLOR_MAPPING } from '../constants';
import RegionsChart from '../../src/RegionsChart';
import {
  parseValue,
  RegionResultValue,
  csvToRegionResultsList,
  RegionResults,
} from '../../src/lib/data/parse';
import { RegionDatum } from '../../src/types/general';

const color = (d: RegionDatum<RegionResultValue>) => COLOR_MAPPING[d.value];

const FromURL = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const chart = new RegionsChart({
        el: container,
        url: 'https://parameter-space-visualizer.surge.sh/csv/regions/large-results/parametric-die01.csv',
        parseCSVValue: parseValue,
        colors: COLOR_MAPPING,
        width: 800,
        height: 800,
      });
    }
  }, [container]);

  return <div ref={ref} />;
};

const From1DData = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const chart = new RegionsChart({
        el: container,
        data: data1D,
        colors: COLOR_MAPPING,
        width: 800,
        height: 800,
      });
    }
  }, [container]);

  return <div ref={ref} />;
};

const FromData = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const chart = new RegionsChart({
        el: container,
        data: data,
        colors: COLOR_MAPPING,
        width: 800,
        height: 800,
      });
    }
  }, [container]);

  return <div ref={ref} />;
};

const CustomData = () => {
  const [container, ref] = useState<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<RegionResults<RegionResultValue>>([]);
  const chart = useRef<RegionsChart<RegionResultValue>>();

  useEffect(() => {
    if (container && userData) {
      chart.current = new RegionsChart({
        el: container,
        data: userData,
        width: 800,
        height: 800,
      });
    }
  }, [container, userData]);

  useEffect(() => {
    if (userData.length && chart.current) {
      chart.current.remove();
      chart.current = undefined;
    }
  }, []);

  const handleFileUpload = e => {
    const reader = new FileReader();
    reader.onload = evt => {
      if (typeof evt.target?.result === 'string')
        setUserData(csvToRegionResultsList(csvParse(evt.target.result)));
    };

    reader.readAsText(e.target.files[0]);
  };

  return userData.length ? (
    <div>
      <Button onClick={() => setUserData([])}>Reset</Button>
      <div ref={ref} />
    </div>
  ) : (
    <div>
      <input type="file" id="file-selector" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

const Regions = () => {
  return (
    <Tabs>
      <Tabs.Tab label="Data">
        <FromData />
      </Tabs.Tab>
      <Tabs.Tab label="1D data">
        <From1DData />
      </Tabs.Tab>
      <Tabs.Tab label="Async data">
        <FromURL />
      </Tabs.Tab>
      <Tabs.Tab label="Upload own data">
        <CustomData />
      </Tabs.Tab>
    </Tabs>
  );
};

export default Regions;

const data: RegionDatum<RegionResultValue>[] = [
  {
    value: 'true',
    params: { p: { from: 0, to: 0.5 }, q: { from: 0, to: 0.25 }, r: { from: 0.1, to: 0.2 } },
  },
  {
    value: 'true',
    params: { p: { from: 0, to: 0.5 }, q: { from: 0.25, to: 0.5 }, r: { from: 0.1, to: 0.2 } },
  },
  {
    value: 'true',
    params: { p: { from: 0, to: 0.5 }, q: { from: 0, to: 0.25 }, r: { from: 0.2, to: 0.3 } },
  },
  {
    value: 'true',
    params: { p: { from: 0, to: 0.5 }, q: { from: 0.25, to: 0.5 }, r: { from: 0.2, to: 0.3 } },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0, to: 0.125 }, r: { from: 0.1, to: 0.15 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.125, to: 0.25 },
      r: { from: 0.1, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0, to: 0.125 }, r: { from: 0.15, to: 0.2 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.125, to: 0.25 },
      r: { from: 0.15, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.25, to: 0.375 },
      r: { from: 0.1, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0.375, to: 0.5 }, r: { from: 0.1, to: 0.15 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.25, to: 0.375 },
      r: { from: 0.15, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0.375, to: 0.5 }, r: { from: 0.15, to: 0.2 } },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0, to: 0.125 }, r: { from: 0.2, to: 0.25 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.125, to: 0.25 },
      r: { from: 0.2, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0, to: 0.125 }, r: { from: 0.25, to: 0.3 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.125, to: 0.25 },
      r: { from: 0.25, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.25, to: 0.375 },
      r: { from: 0.2, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0.375, to: 0.5 }, r: { from: 0.2, to: 0.25 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.5, to: 0.75 },
      q: { from: 0.25, to: 0.375 },
      r: { from: 0.25, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: { p: { from: 0.5, to: 0.75 }, q: { from: 0.375, to: 0.5 }, r: { from: 0.25, to: 0.3 } },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1, to: 0.1125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1125, to: 0.125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.125, to: 0.1375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1375, to: 0.15 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.15, to: 0.1625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1625, to: 0.175 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.175, to: 0.1875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.1875, to: 0.2 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0, to: 0.03125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.03125, to: 0.0625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.0625, to: 0.09375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.09375, to: 0.125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.125, to: 0.15625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.15625, to: 0.1875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.1875, to: 0.21875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.21875, to: 0.25 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2, to: 0.2125 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2125, to: 0.225 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.225, to: 0.2375 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2375, to: 0.25 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.25, to: 0.28125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.28125, to: 0.3125 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.3125, to: 0.34375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.34375, to: 0.375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.25, to: 0.2625 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2625, to: 0.275 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.375, to: 0.40625 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.40625, to: 0.4375 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.75, to: 0.8125 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'true',
    params: {
      p: { from: 0.8125, to: 0.875 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.275, to: 0.2875 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.4375, to: 0.46875 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.875, to: 0.9375 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
  {
    value: 'center_sat',
    params: {
      p: { from: 0.9375, to: 1 },
      q: { from: 0.46875, to: 0.5 },
      r: { from: 0.2875, to: 0.3 },
    },
  },
];

const data1D: RegionDatum<RegionResultValue>[] = [
  { value: 'true', params: { p: { from: 0, to: 0.5 } } },
  { value: 'true', params: { p: { from: 0.5, to: 0.75 } } },
  { value: 'true', params: { p: { from: 0.75, to: 0.8125 } } },
  { value: 'true', params: { p: { from: 0.8125, to: 0.875 } } },
  { value: 'false', params: { p: { from: 0.875, to: 1 } } },
];
