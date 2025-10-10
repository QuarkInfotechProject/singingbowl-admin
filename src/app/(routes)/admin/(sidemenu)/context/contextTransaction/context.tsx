import React, { createContext, useContext, useReducer, ReactNode } from 'react';

import { Transaction, TransactionsResponse } from '@/app/_types/transactiontype/transactionType';

// Define the state type
interface OrderState {
  transactionData: TransactionsResponse | null;
  currentPage: number;
  totalPages: number;
  isSheetOpen: boolean;
  filteredTransactionData: Transaction[] | null;
}

// Define action types
// Define action types
type OrderAction = 
  | { type: 'SET_TRANSACTION_DATA'; payload: TransactionsResponse }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_TOTAL_PAGES'; payload: number }
  | { type: 'TOGGLE_SHEET' }
  | { type: 'FILTER_TRANSACTION'; payload: { transactionCode?: string; paymentMethod?: string; } };


// Create the initial state
const initialState: OrderState = {
    transactionData: null,
  filteredTransactionData: null, 
  currentPage: 1,
  totalPages: 1,
  isSheetOpen: false,
};


// Create the reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_TRANSACTION_DATA':
      return { ...state, transactionData: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'TOGGLE_SHEET':
      return { ...state, isSheetOpen: !state.isSheetOpen };
      case 'FILTER_TRANSACTION': {
        const { transactionCode, paymentMethod } = action.payload;
        let filteredTransaction = state.transactionData?.data.data || [];
      
        // Filter by orderId if provided
        if (transactionCode) {
          filteredTransaction = filteredTransaction.filter(order => order.orderId?.includes(orderId));
        }
      
       
        if (paymentMethod) {
            filteredTransaction = filteredTransaction.filter(order => order.paymentMethod === paymentMethod);
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
const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | undefined>(undefined);

// Create a provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a custom hook to use the context
export const useTransaction = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an TransactionProvider');
  }
  return context;
};

// Create a function to fetch orders
export const fetchTransaction = async (
    dispatch: React.Dispatch<OrderAction>, 
    page: number, 
    filters: { transactionCode?: string; paymentMethod?: string; } = {}
  ) => {
    console.log("filter here",filters)
    try {
      const url = `/api/transaction?page=${page}`; 
      const res = await fetch(url, {
        method: 'POST',
        headers: {
            
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters), // Send filters in the request body
      });
      const data = await res.json();
      console.log("data ofcon",data)
      dispatch({ type: 'SET_TRANSACTION_DATA', payload: data.data });
      dispatch({ type: 'SET_TOTAL_PAGES', payload: data.data.last_page});
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };