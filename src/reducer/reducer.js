export const initialState = {
  selectedCalculation: {},
  calculations: [],
  createdCalculation: null,
};

export const types = {
  add_selectedCalculation: "ADD_SELECTED_CALCULATIONS",
  add_Calculations: "ADD_CALCULATIONS",
  createdCalculation: "createdCalculation",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case types.add_selectedCalculation:
      return { ...state, selectedCalculation: action.selectedCalculation };

    case types.add_Calculations:
      return { ...state, calculations: action.calculations };

    case types.createdCalculation:
      return { ...state, createdCalculation: action.createdCalculation };

    default:
      return state;
  }
};
