import { useReducer } from "react";
import { Account, ListFilters } from "../types";

type Action =
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_SORT"; sort: keyof Account }
  | { type: "NEXT_PAGE" }
  | { type: "PREV_PAGE" };

const reducer = (state: ListFilters, action: Action): ListFilters => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.page || 1 };
    case "NEXT_PAGE":
      return { ...state, page: state.page + 1 };
    case "PREV_PAGE":
      if (state.page === 1) return state;
      return { ...state, page: state.page - 1 };
    case "SET_SORT":
      return { ...state, sort: action.sort };
  }
};

export interface UseListFiltersReturn {
  state: ListFilters;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  setSort: (sort: keyof Account) => void;
}

interface UseListFiltersOptions {
  initialState: ListFilters;
}

const useListFilters = (
  userOptions?: Partial<UseListFiltersOptions>
): UseListFiltersReturn => {
  const initialState: ListFilters = {
    page: 1,
    limit: 10,
    sort: undefined,
  };

  const options: UseListFiltersOptions = {
    initialState,
    ...userOptions,
  };
  const [state, dispatch] = useReducer(reducer, options.initialState);

  return {
    state,
    nextPage: () => dispatch({ type: "NEXT_PAGE" }),
    prevPage: () => dispatch({ type: "PREV_PAGE" }),
    setPage: (page: number) => dispatch({ type: "SET_PAGE", page }),
    setSort: (sort: keyof Account) => dispatch({ type: "SET_SORT", sort }),
  };
};

export default useListFilters;
