import * as React from 'react';
import { getScales } from '../services/scalesAPI';

const ScaleContext = React.createContext([]);

function scaleReducer(state, action) {
  switch (action.type) {
    case 'SET_SCALES': {
      return { data: action.payload };
    }
    default: {
      return state;
    }
  }
};

function ScaleProvider({children}) {
  const [state, dispatch] = React.useReducer(scaleReducer, []);

  React.useEffect(() => {
    getScales().then((items) => {
      dispatch({ type: 'SET_SCALES', payload: items });
    });
  }, []);

  const value = { scales: state.data };

  return <ScaleContext.Provider value={value}>{children}</ScaleContext.Provider>;
}

export { ScaleProvider, ScaleContext };