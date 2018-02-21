import R from 'ramda';
import React from 'react';
import { getTickerPrice } from '../../../helpers/transactions';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import { Portfolio } from '../types/portfolio.types';
import { PortfolioPosition } from './PortfolioPosition';
import { PortfolioPositionHeader } from './PortfolioPositionHeader';

export interface PortfolioForAsset {
  total: number;
  exchanges: { [id: string]: number };
  wallets: number;
}

interface Props {
  portfolio: Portfolio;
  coinlist: Coinlist;
  ticker: Ticker;
  settings: SettingsType;
}

export const PortfolioPositions = ({ portfolio, coinlist, ticker, settings }: Props) => (
  <div>
    <PortfolioPositionHeader />
    {Object.keys(portfolio.total)
      .sort(
        (a, b) =>
          portfolio.total[b] * (ticker[b] ? getTickerPrice(ticker, b, settings.fiatCurrency) : 0) -
          portfolio.total[a] * (ticker[a] ? getTickerPrice(ticker, a, settings.fiatCurrency) : 0)
      )
      .map(asset => (
        <PortfolioPosition
          key={asset}
          coinlist={coinlist}
          ticker={ticker}
          asset={asset}
          portfolio={filterPortfolioForAsset(portfolio, asset)}
          settings={settings}
        />
      ))}
  </div>
);

const filterPortfolioForAsset = (portfolio: Portfolio, asset: string): PortfolioForAsset =>
  R.mapObjIndexed(
    (value: any, key) =>
      key !== 'exchanges'
        ? value[asset] || 0
        : R.pipe(
            R.filter(balances => balances[asset]),
            R.mapObjIndexed(balances => balances[asset])
          )(value)
  )(portfolio) as PortfolioForAsset;
