import React, { createContext, useContext, useReducer, ReactNode } from "react";

import {
  Transaction,
  TransactionsResponse,
} from "@/app/_types/transactiontype/transactionType";

// Define the state type
interface ProcessState {
  transactionData: TransactionsResponse | null;
  currentPage: number;
  totalPages: number;
  isSheetOpen: boolean;
  filteredTransactionData: Transaction[] | null;
}

// Define action types
// Define action types
type ProcessAction =
  | { type: "SET_PROCESS_DATA"; payload: TransactionsResponse }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "TOGGLE_SHEET" }
  | {
      type: "FILTER_PROCESS";
      payload: { transactionCode?: string; paymentMethod?: string };
    };

// Create the initial state
const initialState: ProcessState = {
  transactionData: null,
  filteredTransactionData: null,
  currentPage: 1,
  totalPages: 1,
  isSheetOpen: false,
};

// Create the reducer
const orderReducer = (
  state: ProcessState,
  action: ProcessAction
): ProcessState => {
  switch (action.type) {
    case "SET_PROCESS_DATA":
      return { ...state, transactionData: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "TOGGLE_SHEET":
      return { ...state, isSheetOpen: !state.isSheetOpen };
    case "FILTER_PROCESS": {
      const { status, productName, limit } = action.payload;
      let filteredTransaction = state.transactionData?.data.data || [];

      // Filter by orderId if provided
      if (status) {
        filteredTransaction = filteredTransaction.filter((order) =>
          order.orderId?.includes(orderId)
        );
      }

      if (limit) {
        filteredTransaction = filteredTransaction.filter((order) =>
          order.orderId?.includes(orderId)
        );
      }

      if (productName) {
        filteredTransaction = filteredTransaction.filter(
          (order) => order.paymentMethod === paymentMethod
        );
      }

      // Filter by userId if provided

      return {
        ...state,
        filteredTransactionData: filteredTransaction, // Update filteredTransactionData
      };
    }

    default:
      return state;
  }
};

// Create the context
const ProcessContext = createContext<
  | {
      state: ProcessState;
      dispatch: React.Dispatch<ProcessAction>;
    }
  | undefined
>(undefined);

// Create a provider component
export const ProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <ProcessContext.Provider value={{ state, dispatch }}>
      {children}
    </ProcessContext.Provider>
  );
};

// Create a custom hook to use the context
export const useProcess = () => {
  const context = useContext(ProcessContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an TransactionProvider");
  }
  return context;
};

// Create a function to fetch orders
export const fetchProcess = async (
  dispatch: React.Dispatch<ProcessAction>,
  page: number,
  filters: { transactionCode?: string; paymentMethod?: string } = {}
) => {
  try {
    const url = `/api/orderProcess`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters), // Send filters in the request body
    });
    const data = await res.json();
    console.log("data ofcon", data);
    dispatch({ type: "SET_PROCESS_DATA", payload: data.data });
    dispatch({ type: "SET_TOTAL_PAGES", payload: data.totalPages });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};
