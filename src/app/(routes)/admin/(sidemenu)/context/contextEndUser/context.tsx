import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Order, OrderResponse } from '@/app/_types/orderType/orderType';
import { User, UserDataResponse } from '@/app/_types/endUser_Types/endUser';


interface OrderState {
  userData: UserDataResponse | null;
  currentPage: number;
  totalPages: number;
  isSheetOpen: boolean;
  filteredUserData: User[] | null;
}


type OrderAction = 
  | { type: 'SET_ENDUSER_DATA'; payload: UserDataResponse }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_TOTAL_PAGES'; payload: number }
  | { type: 'TOGGLE_SHEET' }
  | { type: 'FILTER_ENDUSER'; payload: {name?: string;} };


// Create the initial state
const initialState: OrderState = {
  userData: null,
  filteredUserData: null, 
  currentPage: 1,
  totalPages: 1,
  isSheetOpen: false,
};


// Create the reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_ENDUSER_DATA':
      return { ...state,userData: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'TOGGLE_SHEET':
      return { ...state, isSheetOpen: !state.isSheetOpen };
      case 'FILTER_ENDUSER': {
        const { name } = action.payload;
        let filteredOrders = state.userData?.data || [];
      
        // Filter by orderId if provided
        if (name) {
          filteredOrders = filteredOrders.filter(order => order.id?.includes(orderId));
        }
      
      
        return {
          ...state,
          filteredUserData: filteredOrders, // Update filteredOrderData
        };
      }
  
    default:
      return state;
  }
};


// Create the context
const EndContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | undefined>(undefined);

// Create a provider component
export const EndUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <EndContext.Provider value={{ state, dispatch }}>
      {children}
    </EndContext.Provider>
  );
};

// Create a custom hook to use the context
export const useEndUser = () => {
  const context = useContext(EndContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

// Create a function to fetch orders
export const endUser = async (
    dispatch: React.Dispatch<OrderAction>, 
    page: number, 
    filters: { orderId?: string; month?: string; year?: string ;status?:string;userId?:string} = {}
  ) => {
    console.log("filter here",filters)
    try {
      const url = `/api/endUser?page=${page}`; 
      const res = await fetch(url, {
        method: 'POST',
        headers: {
            
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters), // Send filters in the request body
      });
      const data = await res.json();
      dispatch({ type: 'SET_ENDUSER_DATA', payload: data.data });
      dispatch({ type: 'SET_TOTAL_PAGES', payload: data.data.last_page });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };