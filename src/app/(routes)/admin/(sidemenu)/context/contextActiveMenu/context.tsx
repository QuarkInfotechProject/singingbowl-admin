'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuT } from '@/app/_types/menu_Types/menuType';

interface MenuState {
  menuData: MenuT[];
  loading: boolean;
  refetch: boolean;
}

interface MenuAction {
  type: 'SET_MENU_DATA' | 'SET_LOADING' | 'SET_REFETCH';
  payload: any;
}

const initialState: MenuState = {
  menuData: [],
  loading: false,
  refetch: false,
};

const MenuContext = createContext<{
  state: MenuState;
  dispatch: React.Dispatch<MenuAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'SET_MENU_DATA':
      return {
        ...state,
        menuData: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_REFETCH':
      return {
        ...state,
        refetch: action.payload,
      };
    default:
      return state;
  }
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const fetchMenuData = async (dispatch: React.Dispatch<MenuAction>) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const res = await fetch('/api/menu/menu-active', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    
    if (!res.ok) throw new Error('Failed to fetch menu data');
    
    const data = await res.json();
    
    dispatch({ type: 'SET_MENU_DATA', payload: data.data });
  } catch (error) {
    console.error('Error fetching menu data:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};