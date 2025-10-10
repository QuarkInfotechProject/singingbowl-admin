import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Order, OrderResponse } from "@/app/_types/orderType/orderType";

// Define the state type
interface OrderState {
  orderData: OrderResponse | null;
  currentPage: number;
  totalPages: number;
  isSheetOpen: boolean;
  filteredOrderData: Order[] | null;
}

// Define action types
// Define action types
type OrderAction =
  | { type: "SET_ORDER_DATA"; payload: OrderResponse }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "TOGGLE_SHEET" }
  | {
      type: "FILTER_ORDERS";
      payload: {
        orderId?: string;
        month?: string;
        year?: string;
        status?: string;
        userId?: string;
      };
    };

// Create the initial state
const initialState: OrderState = {
  orderData: null,
  filteredOrderData: null,
  currentPage: 1,
  totalPages: 1,
  isSheetOpen: false,
};

// Create the reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "SET_ORDER_DATA":
      return { ...state, orderData: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "TOGGLE_SHEET":
      return { ...state, isSheetOpen: !state.isSheetOpen };
    case "FILTER_ORDERS": {
      const { orderId, month, year, userId } = action.payload;
      let filteredOrders = state.orderData?.data || [];
      // Filter by orderId if provided
      if (orderId) {
        filteredOrders = filteredOrders.filter((order) =>
          order.id?.includes(orderId)
        );
      }

      // Filter by month and year if provided
      if (month && year) {
        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = new Date(order.date);
          if (isNaN(orderDate.getTime())) {
            // Invalid date, skip filtering this order
            return false;
          }

          const orderMonth = orderDate.getMonth() + 1; // getMonth is zero-based
          const orderYear = orderDate.getFullYear();
          return orderMonth === parseInt(month) && orderYear === parseInt(year);
        });
      }
      if (status) {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === status
        );
      }

      // Filter by userId if provided
      if (userId) {
        filteredOrders = filteredOrders.filter(
          (order) => order.userId === userId
        );
      }
      return {
        ...state,
        filteredOrderData: filteredOrders, // Update filteredOrderData
      };
    }

    default:
      return state;
  }
};

// Create the context
const OrderContext = createContext<
  | {
      state: OrderState;
      dispatch: React.Dispatch<OrderAction>;
    }
  | undefined
>(undefined);

// Create a provider component
export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a custom hook to use the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
console.log("User ID")
// Create a function to fetch orders
export const fetchOrders = async (
  dispatch: React.Dispatch<OrderAction>,
  page: number,
  userId:String,
  filters: {
    orderId?: string;
    month?: string;
    year?: string;
    status?: string;
    userId?: string;
  } = {}
) => {
  console.log("filter here", filters);
  try {
    const url = `/api/orderDetails?page=${page}&userId=${userId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters), // Send filters in the request body
    });
    const data = await res.json();
    dispatch({ type: "SET_ORDER_DATA", payload: data.data });
    dispatch({ type: "SET_TOTAL_PAGES", payload: data.data.last_page });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};
