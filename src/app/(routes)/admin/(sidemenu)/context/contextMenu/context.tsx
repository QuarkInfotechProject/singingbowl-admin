"use client"
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { MenuT } from '@/app/_types/menu_Types/menuType';

// Define the state type
interface MenuState {
  menuData: MenuT[];
  refetch: boolean;
  loading: boolean;
}

// Define action types
type MenuAction = 
  | { type: 'SET_MENU_DATA'; payload: MenuT[] }
  | { type: 'SET_REFETCH'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };

// Create the initial state
const initialState: MenuState = {
  menuData: [],
  refetch: false,
  loading: false,
  
};

// Create the reducer
const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'SET_MENU_DATA':
      return { ...state, menuData: action.payload };
    case 'SET_REFETCH':
      return { ...state, refetch: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Create the context
const MenuContext = createContext<{
  state: MenuState;
  dispatch: React.Dispatch<MenuAction>;
} | undefined>(undefined);

// Create a provider component
export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);


  useEffect (() => {
    fetchMenuData(dispatch);
  }, []);
  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
};

// Create a custom hook to use the context
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

// Create a function to fetch menu data
export const fetchMenuData = async (dispatch: React.Dispatch<MenuAction>) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await fetch('/api/menu', {
      method: 'GET',
      cache: 'no-store', 
    });
    const data = await res.json();
    if (data) {
      dispatch({ type: 'SET_MENU_DATA', payload: data.data });
      dispatch({ type: 'SET_REFETCH', payload: false });
    }
  } catch (error) {
    console.error('Error fetching menu data:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};