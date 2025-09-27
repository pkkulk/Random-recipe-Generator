import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types
interface SearchState {
  isLoading: boolean;
  query: string;
  searchType: "auto" | "ingredients" | "recipe";
  results: any[];
  readyToCook: any[];
  needsIngredients: any[];
  aiSuggestions: any[];
  error: string | null;
  lastSearch: string | null;
  totalResults: number;
}

interface SearchAction {
  type:
    | "START_SEARCH"
    | "SEARCH_SUCCESS"
    | "SEARCH_ERROR"
    | "CLEAR_SEARCH"
    | "SET_QUERY"
    | "SET_SEARCH_TYPE";
  payload?: any;
}

interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  searchRecipes: (
    query: string,
    type?: "auto" | "ingredients" | "recipe"
  ) => Promise<void>;
  smartSearch: (
    ingredients: string[],
    availableIngredients?: any[]
  ) => Promise<void>;
  clearSearch: () => void;
}

// Initial state
const initialState: SearchState = {
  isLoading: false,
  query: "",
  searchType: "auto",
  results: [],
  readyToCook: [],
  needsIngredients: [],
  aiSuggestions: [],
  error: null,
  lastSearch: null,
  totalResults: 0,
};

// Reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "START_SEARCH":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "SEARCH_SUCCESS":
      const { data } = action.payload;
      return {
        ...state,
        isLoading: false,
        results: data.recipes || [],
        readyToCook: data.results?.readyToCook?.recipes || [],
        needsIngredients: data.results?.needsIngredients?.recipes || [],
        aiSuggestions: data.results?.aiSuggestions?.suggestions || [],
        searchType: data.searchMode || state.searchType,
        totalResults: data.totalMatches || data.pagination?.totalRecipes || 0,
        lastSearch: data.query || state.query,
        error: null,
      };

    case "SEARCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        results: [],
        readyToCook: [],
        needsIngredients: [],
        aiSuggestions: [],
      };

    case "CLEAR_SEARCH":
      return initialState;

    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
      };

    case "SET_SEARCH_TYPE":
      return {
        ...state,
        searchType: action.payload,
      };

    default:
      return state;
  }
}

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const searchRecipes = async (
    query: string,
    type: "auto" | "ingredients" | "recipe" = "auto"
  ) => {
    try {
      dispatch({ type: "START_SEARCH" });
      // Set last search immediately so UI can render feedback
      dispatch({ type: "SET_QUERY", payload: query });
      dispatch({ type: "SET_SEARCH_TYPE", payload: type });

      // Import API service dynamically to avoid circular dependencies
      const { default: ApiService } = await import("../services/ApiService");

      let ingredients: string[] = [];

      if (
        type === "ingredients" ||
        (type === "auto" && (query.includes(",") || query.includes(" and ")))
      ) {
        // Parse ingredients from query
        ingredients = query
          .split(/[,;]/)
          .map((ingredient) => ingredient.trim())
          .filter((ingredient) => ingredient.length > 0);
      }

      const response = await ApiService.searchRecipes({
        query,
        searchType: type,
        ingredients,
        page: 1,
        limit: 12,
      });

      dispatch({ type: "SEARCH_SUCCESS", payload: response });
    } catch (error) {
      dispatch({ type: "SEARCH_ERROR", payload: (error as Error).message });
    }
  };

  const smartSearch = async (
    ingredients: string[],
    availableIngredients: any[] = []
  ) => {
    try {
      dispatch({ type: "START_SEARCH" });
      dispatch({ type: "SET_QUERY", payload: ingredients.join(", ") });
      dispatch({ type: "SET_SEARCH_TYPE", payload: "ingredients" });

      const { default: ApiService } = await import("../services/ApiService");

      const response = await ApiService.smartSearch({
        ingredients,
        availableIngredients,
        includeAISuggestions: true,
        limit: 12,
      });

      dispatch({ type: "SEARCH_SUCCESS", payload: response });
    } catch (error) {
      dispatch({ type: "SEARCH_ERROR", payload: (error as Error).message });
    }
  };

  const clearSearch = () => {
    dispatch({ type: "CLEAR_SEARCH" });
  };

  const value: SearchContextType = {
    state,
    dispatch,
    searchRecipes,
    smartSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

// Hook to use the search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
