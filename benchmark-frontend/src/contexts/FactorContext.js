import * as React from 'react';
import { getFactors } from '../services/factorsAPI';

const FactorContext = React.createContext([]);

function factorReducer(state, action) {
  switch (action.type) {
    case 'SET_FACTORS': {
      return { data: action.payload };
    }
    default: {
      return state;
    }
  }
};

function FactorProvider({children}) {
  const [state, dispatch] = React.useReducer(factorReducer, []);

  React.useEffect(() => {
    getFactors().then((items) => {
      dispatch({ type: 'SET_FACTORS', payload: items });
    });
  }, []);

  const value = { factors: state.data };

  return <FactorContext.Provider value={value}>{children}</FactorContext.Provider>;
};

export { FactorProvider, FactorContext };