export interface Exchanges {
  [key: string]: Exchange;
}

export interface Exchange {
  id: string;
  type: string;
  credentials: ExchangeCredentials;
  balances: Balances;
  ledger: LedgerEntry[];
  trades: Trade[];
  error?: string;
  openRequests?: number;
}

export interface ExchangeCredentials {
  apiKey: string;
  secret: string;
  uid?: string;
  login?: string;
  password?: string;
}

export interface Balances {
  [asset: string]: number;
}

export interface Trade {
  id: string;
}

export interface LedgerEntry {
  id: string;
}

export enum ExchangeTypeKeys {
  ADD_EXCHANGE = 'ADD_EXCHANGE',
  DELETE_EXCHANGE = 'DELETE_EXCHANGE',

  UPDATE_EXCHANGE_CREDENTIALS = 'UPDATE_EXCHANGE_CREDENTIALS',
  UPDATE_EXCHANGE_BALANCES = 'UPDATE_EXCHANGE_BALANCES',
  UPDATE_EXCHANGE_LEDGER = 'UPDATE_EXCHANGE_LEDGER',
  UPDATE_EXCHANGE_TRADES = 'UPDATE_EXCHANGE_TRADES',
  INCREMENT_EXCHANGE_REQUEST_COUNTER = 'INCREMENT_EXCHANGE_REQUEST_COUNTER',
  FAILED_EXCHANGE_REQUEST = 'FAILED_EXCHANGE_REQUEST',
}

export type ExchangeActions =
  | ExchangeClassActions
  | ExchangeInstanceActions;

export type ExchangeClassActions =
  | AddExchangeAction
  | DeleteExchangeAction;

export type AddExchangeAction = {
  type: ExchangeTypeKeys.ADD_EXCHANGE;
  exchangeType: string;
  credentials: ExchangeCredentials;
};

export type DeleteExchangeAction = {
  type: ExchangeTypeKeys.DELETE_EXCHANGE;
  id: string;
};

export type ExchangeInstanceActions =
  | UpdateExchangeCredentialsAction
  | UpdateExchangeBalancesAction
  | UpdateExchangeLedgerAction
  | UpdateExchangeTradesAction
  | IncrementExchangeRequestCounterAction
  | FailedExchangeRequestAction;

export interface UpdateExchangeCredentialsAction {
  type: ExchangeTypeKeys.UPDATE_EXCHANGE_CREDENTIALS;
  id: string;
  credentials: ExchangeCredentials;
}

export interface UpdateExchangeBalancesAction {
  type: ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES;
  id: string;
  balances: Balances;
}

export interface UpdateExchangeLedgerAction {
  type: ExchangeTypeKeys.UPDATE_EXCHANGE_LEDGER;
  id: string;
  ledger: LedgerEntry[];
}

export interface UpdateExchangeTradesAction {
  type: ExchangeTypeKeys.UPDATE_EXCHANGE_TRADES;
  id: string;
  trades: Trade[];
}

export interface IncrementExchangeRequestCounterAction {
  type: ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER;
  id: string;
}

export interface FailedExchangeRequestAction {
  type: ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST;
  id: string;
  error: string;
}
