// @flow
import React from 'react';
import type { Node } from 'react';
import R from 'ramda';
import { Paper } from 'material-ui';

import PortfolioChart from '../components/PortfolioChart';
import { getTickerPrice } from '../../../helpers/transactions';
import type { Coinlist } from '../../../reducers/coinlist/types.d';
import type { SettingsType } from '../../../reducers/settings';
import PortfolioPositions from '../components/PortfolioPositions';
import PortfolioHeader from '../components/PortfolioHeader';
import EmptyPortfolio from '../components/EmptyPortfolio';
import type { Wallet } from '../../../reducers/wallets/types.d';
import type { Ticker } from '../../../reducers/ticker/types.d';
import type { Balances, Portfolio } from '../types/portfolio.d';

type Props = {
  balances: { [string]: Balances },
  ticker: Ticker,
  coinlist: Coinlist,
  wallets: Wallet[],
  settings: SettingsType
};

export default function PortfolioContainer(
  { balances, ticker, coinlist, wallets, settings }: Props): Node {
  const portfolio = calculatePortfolio(wallets, balances, settings);
  const sum = {
    btc: calculateSum(ticker, portfolio.total, 'BTC'),
    fiat: calculateSum(ticker, portfolio.total, settings.fiatCurrency),
  };
  const change = {
    btc: calculateChange(ticker, portfolio.total, sum.btc, 'BTC'),
    fiat: calculateChange(ticker, portfolio.total, sum.fiat, settings.fiatCurrency),
  };

  if (ticker.BTC || ticker.ETH) { // TODO What if the user has no BTC?
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          <PortfolioHeader change={change} fiatCurrency={settings.fiatCurrency} sum={sum} ticker={ticker}/>
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <PortfolioChart ticker={ticker} portfolio={portfolio.total} sum={sum.btc}/>
        </Paper>
        <Paper style={{ marginTop: 30 }}>
          <PortfolioPositions
            portfolio={portfolio}
            ticker={ticker}
            coinlist={coinlist}
            settings={settings}
            sumBTC={sum.btc}
          />
        </Paper>
      </div>
    );
  }
  return (
    <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
      <EmptyPortfolio/>
    </Paper>
  );
}

function calculatePortfolio(wallets: Wallet[], balances: { [string]: Balances }, settings: SettingsType): Portfolio {
  const walletBalances = wallets
    .filter(wallet => !(wallet.currency === settings.fiatCurrency && settings.includeFiat))
    .reduce((acc, wallet) => ({
      ...acc,
      [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
    }), {});

  const filteredBalances = R.map(settings.includeFiat ? R.identity : R.omit([settings.fiatCurrency]))(balances);
  let exchangeBalances = {};
  Object.keys(filteredBalances).forEach(exchange => {
    exchangeBalances = R.mergeWith((a, b) => a + b, exchangeBalances, filteredBalances[exchange]);
  });

  return {
    total: R.mergeWith((a, b) => a + b, exchangeBalances, walletBalances),
    exchanges: filteredBalances,
    wallets: walletBalances,
  };
}

function calculateSum(ticker: Ticker, portfolio: Object, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + (getTickerPrice(ticker, asset, currency) * portfolio[asset]), 0);
}

function calculateChange(ticker: Ticker, portfolio: Object, sum: number, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .filter(asset => asset !== currency)
    .reduce(
      (acc, asset) =>
        acc + (
          ticker[asset][currency].CHANGEPCT24HOUR
          * ((getTickerPrice(ticker, asset, currency) * portfolio[asset]) / sum)
        ),
      0);
}
