import React, { createContext, useContext, useReducer, ReactNode } from "react";

import {
  Feature,
  FeaturesResponse,
} from "@/app/_types/features-Types/featureType";

// Define the state type
interface ProcessState {
  activeDatas: FeaturesResponse | null;
  currentPage: number;
  totalPages: number;
  isSheetOpen: boolean;
  filteredFeaturesData: Feature[] | null;
}

// Define action types
type ProcessAction =
  | { type: "SET_FEATURES_DATA"; payload: FeaturesResponse }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "TOGGLE_SHEET" }
  | {
      type: "FILTER_FEATURES";
      payload: { text?: string; isActive?: number };
    };

// Create the initial state
const initialState: ProcessState = {
  activeDatas: null,
  filteredFeaturesData: null,
  currentPage: 1,
  totalPages: 1,
  isSheetOpen: false,
};

// Create the reducer
const featuresReducer = (
  state: ProcessState,
  action: ProcessAction
): ProcessState => {
  switch (action.type) {
    case "SET_FEATURES_DATA":
      return { ...state, activeDatas: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "TOGGLE_SHEET":
      return { ...state, isSheetOpen: !state.isSheetOpen };
    case 'FILTER_FEATURES': {
      const { text, isActive } = action.payload;
      let filteredFeatures = state.activeDatas?.data.data || [];

      // Filter by text if provided
      if (text) {
        filteredFeatures = filteredFeatures.filter(feature => 
          feature.text?.toLowerCase().includes(text.toLowerCase())
        );
      }

      // Filter by isActive if provided
      if (isActive !== undefined) {
        filteredFeatures = filteredFeatures.filter(feature => 
          feature.isActive === isActive
        );
      }

      return {
        ...state,
        filteredFeaturesData: filteredFeatures,
      };
    }

    default:
      return state;
  }
};

// Create the context
const FeaturesContext = createContext<
  | {
      state: ProcessState;
      dispatch: React.Dispatch<ProcessAction>;
    }
  | undefined
>(undefined);

// Create a provider component
export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(featuresReducer, initialState);

  return (
    <FeaturesContext.Provider value={{ state, dispatch }}>
      {children}
    </FeaturesContext.Provider>
  );
};

// Custom hook to use the context
export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
};

// Function to fetch features data
export const fetchFeatures = async (
  dispatch: React.Dispatch<ProcessAction>,
  page: number = 1,
  filters: { text?: string; isActive?: number } = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.text && { text: filters.text }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive.toString() }),
    });

    const response = await fetch(`/api/features?${queryParams}`);
    const data = await response.json();

    if (response.ok) {
      dispatch({ type: "SET_FEATURES_DATA", payload: data });
      dispatch({ type: "SET_CURRENT_PAGE", payload: page });
      dispatch({ type: "SET_TOTAL_PAGES", payload: data.data.last_page });
    } else {
      console.error("Failed to fetch features:", data);
    }
  } catch (error) {
    console.error("Error fetching features:", error);
  }
};
