import ccxt from 'ccxt';
import R, { equals, forEachObjIndexed, keys } from 'ramda';
import { mapKeys } from '../helpers/mapping';
import { GlobalState } from '../reducers';
import {
  Balances,
  Exchange,
  Exchanges,
  ExchangeTypeKeys,
  FailedExchangeRequestAction,
  IncrementExchangeRequestCounterAction,
} from '../reducers/exchanges.types';
import { unifySymbols } from '../utils/unifySymbols';
import { Action, Dispatch, GetState, ThunkAction } from './actions.types';
import { requestTickerUpdate } from './ticker';
import startTimer from './timer';

const BALANCE_REFRESH_MS = 30000;

function setLastUpdate(): Action {
  return {
    type: 'LAST_UPDATED',
    key: 'transactions',
    time: new Date(),
  };
}

function updateExchangeBalances(id: string, balances: Balances): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const stateBalance = getState().exchanges[id].balances;
    if (!equals(keys(stateBalance), keys(balances))) {
      dispatch(requestTickerUpdate(Object.keys(balances)));
    }
    dispatch({
      type: ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES,
      id,
      balances,
    });
  };
}

function incrementExchangeRequestCounter(id: string): IncrementExchangeRequestCounterAction {
  return {
    type: ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER,
    id,
  };
}

function failedRequest(id: string, error: string): FailedExchangeRequestAction {
  return {
    type: ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST,
    id,
    error,
  };
}

function getConfiguredExchanges(state: GlobalState): Exchanges {
  return state.exchanges;
}

function fetchBalancesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const connector = new ccxt[exchange.type](exchange.credentials);
      const balances: Balances = R.pickBy(balance => balance > 0)(
        await connector.fetchTotalBalance()
      );
      dispatch(updateExchangeBalances(exchange.id, mapKeys(unifySymbols, balances)));
    } catch (e) {
      dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

export function fetchAllBalances(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate());
    const exchanges = getConfiguredExchanges(getState());
    forEachObjIndexed(exchange => dispatch(fetchBalancesForExchange(exchange)))(exchanges);
  };
}

export function fetchAllTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    forEachObjIndexed(exchange => {
      const connector = new ccxt[exchange.type]();
      return dispatch(connector.fetchTotalBalance());
    })(getConfiguredExchanges(getState()));
  };
}

export function continuouslyFetchTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timers.timers.balances) {
      const balanceTimer = window.setInterval(
        () => dispatch(fetchAllBalances()),
        BALANCE_REFRESH_MS
      );
      // const transactionTimer = setInterval(() => dispatch(fetchAllTransactions()), TRANSACTION_REFRESH_MS);
      dispatch(startTimer('balances', balanceTimer));
      // dispatch(startTimer('transactions', transactionTimer));
    }
  };
}
