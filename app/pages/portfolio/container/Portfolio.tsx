import { Paper } from 'material-ui';
import R from 'ramda';
import React from 'react';

import { getTickerPrice } from '../../../helpers/transactions';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import { Wallet } from '../../../reducers/wallets.types';
import { getFiatCurrencies } from '../../../utils/fiatCurrencies';
import EmptyPortfolio from '../components/EmptyPortfolio';
import { PortfolioChart } from '../components/PortfolioChart';
import PortfolioHeader from '../components/PortfolioHeader';
import { PortfolioPositions } from '../components/PortfolioPositions';
import { Balances, Portfolio } from '../types/portfolio.types';

export interface PortfolioProps {
  balances: { [id: string]: Balances };
  ticker: Ticker;
  coinlist: Coinlist;
  wallets: Wallet[];
  settings: SettingsType;
}

export default function PortfolioContainer({
  balances,
  ticker,
  coinlist,
  wallets,
  settings,
}: PortfolioProps) {
  const portfolio = calculatePortfolio(wallets, balances, settings);
  const sum = {
    crypto: calculateSum(ticker, portfolio.total, settings.cryptoCurrency),
    fiat: calculateSum(ticker, portfolio.total, settings.fiatCurrency),
  };
  const change = {
    crypto: calculateChange(ticker, portfolio.total, sum.crypto, settings.cryptoCurrency),
    fiat: calculateChange(ticker, portfolio.total, sum.fiat, settings.fiatCurrency),
  };

  if (ticker[settings.cryptoCurrency] && !R.isEmpty(portfolio.total)) {
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          <PortfolioHeader change={change} settings={settings} sum={sum} />
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <PortfolioChart
            ticker={ticker}
            portfolio={portfolio.total}
            sum={sum.crypto}
            settings={settings}
          />
        </Paper>
        <Paper style={{ marginTop: 30 }}>
          <PortfolioPositions
            portfolio={portfolio}
            ticker={ticker}
            coinlist={coinlist}
            settings={settings}
          />
        </Paper>
      </div>
    );
  }
  return (
    <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
      <EmptyPortfolio />
    </Paper>
  );
}

function calculatePortfolio(
  wallets: Wallet[],
  balances: { [id: string]: Balances },
  settings: SettingsType
): Portfolio {
  const walletBalances: Balances = wallets
    .filter(wallet => !(wallet.currency === settings.fiatCurrency && settings.includeFiat))
    .reduce(
      (acc, wallet) => ({
        ...acc,
        [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
      }),
      {}
    );

  const filteredBalances = Object.assign(
    {},
    ...Object.keys(balances).map(k => ({
      [k]: (settings.includeFiat ? R.identity : R.omit(getFiatCurrencies()))(balances[k]),
    }))
  );
  let exchangeBalances: Balances = {};
  Object.keys(filteredBalances).forEach(exchange => {
    exchangeBalances = R.mergeWith((a, b) => a + b, exchangeBalances, filteredBalances[exchange]);
  });

  return {
    total: R.mergeWith((a, b) => a + b, exchangeBalances, walletBalances),
    exchanges: filteredBalances,
    wallets: walletBalances,
  };
}

function calculateSum(ticker: Ticker, portfolio: Balances, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + getTickerPrice(ticker, asset, currency) * portfolio[asset], 0);
}

function calculateChange(ticker: Ticker, portfolio: Balances, sum: number, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .filter(asset => asset !== currency)
    .reduce(
      (acc, asset) =>
        acc +
        ticker[asset][currency].CHANGEPCT24HOUR *
          (getTickerPrice(ticker, asset, currency) * portfolio[asset] / sum),
      0
    );
}
