import React, { useContext, useReducer, createContext } from "react";

const State = createContext();

export const Provider = ({ initialState, reducer, children }) => (
  <State.Provider value={useReducer(reducer, initialState)}>
    {children}
  </State.Provider>
);

export const useStateProvider = () => useContext(State);
