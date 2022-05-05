import { h, render } from 'preact';
import { setup } from 'goober';
import Router, { Route } from 'preact-router';
import { AppShell } from '@mantine/core';

import Navbar from './components/Layout/Navbar';
import ProbabilitySampling from './examples/ProbabilitySampling';
import Regions from './examples/Regions';
import { PATH_NAMES } from './constants';
import { ChartDots, Rectangle } from 'tabler-icons-react';

setup(h);

const App = () => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar>
          <Navbar.Link
            label="Probability Sampling"
            icon={<ChartDots size={16} />}
            href={PATH_NAMES.probabilitySampling}
            color="teal"
          />
          <Navbar.Link
            label="Regions chart"
            icon={<Rectangle size={16} />}
            href={PATH_NAMES.regions}
            color="blue"
          />
        </Navbar>
      }
    >
      <Router>
        <Route path={PATH_NAMES.regions} component={Regions} />
        <Route path={PATH_NAMES.probabilitySampling} component={ProbabilitySampling} default />
      </Router>
    </AppShell>
  );
};

render(<App />, document.body);
