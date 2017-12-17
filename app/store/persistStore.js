import { createTransform, persistStore as reduxPersistStore } from 'redux-persist';
import * as R from 'ramda';
import rehydrationComplete from '../actions/init';

const mapPath = R.curry((path, f, obj) =>
  R.assocPath(path, f(R.path(path, obj)), obj),
);

const convertDate = R.map(mapPath(['date'], dateString => new Date(dateString)));
const convertDateIn = key => R.map(mapPath([key], convertDate));

const dateTransform = createTransform(null, (outboundState, key) => {
  if (key === 'transactions' && Object.keys(outboundState).length > 0) {
    return R.pipe(convertDateIn('transfers'), convertDateIn('trades'))(outboundState);
  }
  return outboundState;
});

// TODO Move to redux-persist 5
export default function persistStore(store) {
  const persistor = reduxPersistStore(store, {
    transforms: [dateTransform],
    blacklist: ['router', 'timer'],
  }, () => store.dispatch(rehydrationComplete()));
  // persistor.purge(['transactions', 'sources']);
  return persistor;
}
