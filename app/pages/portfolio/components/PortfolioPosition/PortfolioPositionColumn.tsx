import Typography from 'material-ui/Typography';
import * as React from 'react';
import { CurrencyFocus, SettingsType } from '../../../../reducers/settings';
import { TickerForSymbol } from '../PortfolioPosition';
import { PriceChangeText } from '../PriceChangeText';

export const PositionPrice = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;
  const fiatPrice = ticker[fiatCurrency].PRICE.toPrecision(5);
  const cryptoPrice = ticker[cryptoCurrency].PRICE.toPrecision(5);

  const fiatEntry = asset !== fiatCurrency ? `${fiatPrice} ${fiatCurrency}` : '-';
  const cryptoEntry = asset !== cryptoCurrency ? `${cryptoPrice} ${cryptoCurrency}` : '-';

  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

export const PositionQuantity = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  const fiatQuantity = getPrice(asset, fiatCurrency, ticker) * quantity;
  const cryptoQuantity = getPrice(asset, cryptoCurrency, ticker) * quantity;

  const fiatEntry = `${fiatQuantity.toFixed(2)} ${fiatCurrency}`;
  const cryptoEntry = `${cryptoQuantity.toPrecision(5)} ${cryptoCurrency}`;

  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

const getPrice = (symbol: string, currency: string, ticker: TickerForSymbol) =>
  symbol !== currency ? ticker[currency].PRICE : 1;

export const PositionPriceChange = (
  ticker: TickerForSymbol,
  quantity: number,
  asset: string,
  settings: SettingsType
) => {
  const { currencyFocus, cryptoCurrency, fiatCurrency } = settings;

  const fiatChange = ticker[fiatCurrency].CHANGEPCT24HOUR;
  const cryptoChange = ticker[cryptoCurrency].CHANGEPCT24HOUR;

  const fiatEntry =
    asset !== fiatCurrency ? (
      <PriceChangeText change={fiatChange} muted={currencyFocus === 'crypto'} />
    ) : (
      '-'
    );
  const cryptoEntry =
    asset !== cryptoCurrency ? (
      <PriceChangeText change={cryptoChange} muted={currencyFocus === 'fiat'} />
    ) : (
      '-'
    );
  return PortfolioPositionColumn(currencyFocus, cryptoEntry, fiatEntry);
};

export const PortfolioPositionColumn = (
  currencyFocus: CurrencyFocus,
  cryptoEntry: any,
  fiatEntry: any
) => (
  <div>
    <Typography
      type={currencyFocus !== 'equal' ? 'subheading' : 'body1'}
      component="span"
      color="default"
    >
      {currencyFocus === 'crypto' ? cryptoEntry : fiatEntry}
    </Typography>
    <Typography
      type="body1"
      component="span"
      color={currencyFocus === 'equal' ? 'default' : 'secondary'}
    >
      {currencyFocus === 'crypto' ? fiatEntry : cryptoEntry}
    </Typography>
  </div>
);
