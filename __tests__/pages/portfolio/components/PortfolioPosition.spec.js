// @flow
import { createShallow } from 'material-ui/test-utils';
import * as React from 'react';
import { initialSettings } from '../../../../app/reducers/settings';
import type { Ticker } from '../../../../app/reducers/ticker/types.d';
import PortfolioPosition from '../../../../app/pages/portfolio/components/PortfolioPosition';

let shallow;

beforeAll(() => {
  shallow = createShallow();
});

test('Render portfolio position', () => {
  const asset = 'ETH';
  const coinlist = {};
  const portfolio = {
    total: 10,
    wallets: 2,
    exchanges: { exchangeKey: 8 },
  };
  const ticker: Ticker = {
    BTC: { BTC: { PRICE: 1, CHANGEPCT24HOUR: 0 }, USD: { PRICE: 10000, CHANGEPCT24HOUR: 1.1 } },
    ETH: { BTC: { PRICE: 0.1, CHANGEPCT24HOUR: 2 }, USD: { PRICE: 1000, CHANGEPCT24HOUR: 5.2 } },
  };
  const settings = { ...initialSettings, fiatCurrency: 'USD' };

  const wrapper = shallow(
    <PortfolioPosition
      asset={asset}
      coinlist={coinlist}
      portfolio={portfolio}
      settings={settings}
      ticker={ticker}
    />).dive();
  expect(wrapper).toMatchSnapshot();
});
