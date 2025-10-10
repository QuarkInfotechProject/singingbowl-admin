'use client';
import React, {
  useContext,
  createContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import reducer from './reducer';

import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

interface AppContextT {
  state: InitialStateT;
  getAllData: () => void;
  deleteData: (id: any) => void;
  handleLoading: (status: boolean) => void;
}

export interface InitialStateT {
  loading: boolean;
  data: {
    id: number;
    menu_id: number;
    user_type_id: number;
    created_by: number;
    created_at: string;
  }[];
}

const initialState: InitialStateT = {
  loading: false,
  data: [],
};
const AppContext = createContext<AppContextT | null>(null);
const PermissionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const getAllData = async () => {
    dispatch({ type: 'HANDLE_LOADING', payload: { status: true } });
    try {
      const res = await axios.get('/api/menu/menu-active');
      if (res.status === 200) {
        dispatch({
          type: 'HANDLE_INITIAL_DATA',
          payload: {
            data: res.data.data,
          },
        });
        dispatch({ type: 'HANDLE_LOADING', payload: { status: false } });
      }
    } catch (error) {
      dispatch({ type: 'HANDLE_LOADING', payload: { status: false } });

      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: 'destructive',
        });
        return 'error occured';
      }
    }
  };
  const handleLoading = (status: boolean) => {
    dispatch({ type: 'HANDLE_LOADING', payload: { status } });
  };
  //delete data
  const deleteData = async (id: string) => {
    dispatch({ type: 'HANDLE_LOADING', payload: { status: true } });
    try {
      const res = await axios.delete(`/api/permissions/specific/${id}`);
      if (res.status === 200) {
        toast({
          description: `Deleted successfully`,
        });
        dispatch({ type: 'HANDLE_LOADING', payload: { status: false } });
      }
    } catch (error) {
      dispatch({ type: 'HANDLE_LOADING', payload: { status: false } });

      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: 'destructive',
        });
        return 'error occured';
      }
    }
  };
  useEffect(() => {
    getAllData();
  }, []);
  return (
    <AppContext.Provider
      value={{
        state,
        getAllData,
        deleteData,
        handleLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


export const useGlobalContext = (): AppContextT | null => {
  return useContext(AppContext);
};

export { AppContext, PermissionContextProvider  };
