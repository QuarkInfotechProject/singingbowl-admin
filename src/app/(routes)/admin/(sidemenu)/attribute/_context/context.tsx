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
import { useSearchParams } from 'next/navigation';

interface AppContextT {
  state: InitialStateT;
  getData: (page: number, name?: string) => Promise<void | 'error occurred'>;
  handleEditLoading: (status: boolean) => void;
}

export interface InitialStateT {
  loading: boolean;
  editLoading: boolean;
  current_page: number;
  last_page: number;
  data: {
    id: number;
    attributeSet: string;
    name: string;
    url: string;
  
  }[];
}

const initialState: InitialStateT = {
  loading: false,
  editLoading: false,
  current_page: 1,
  last_page: 1,
  data: [],
};
const AppContext = createContext<AppContextT | null>(null);
const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  // dispatch the created reducer here and pass it throughout the component tree
  const getData = async (page: number, name?: string) => {
    dispatch({ type: 'HANDLE_LOADING', payload: { status: true } });
    try {
      const res = await axios.post(`/api/attribute?page=${page}`, { name });
      if (res.status === 200) {
        dispatch({
          type: 'HANDLE_INITIAL_DATA',
          payload: {
            data: res.data.data.data,
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
          },
        });
        console.log("data we get is ", res.data.data);
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
        return 'error occurred';
      }
    }
  };

  useEffect(() => {
    getData(1);
  }, []);
 

  const handleEditLoading = (status: boolean) => {
    dispatch({ type: 'HANDLE_EDIT_LOADING', payload: { status } });
  };
  return (
    <AppContext.Provider
      value={{
        state,
        getData,
        handleEditLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// custom hook to use the context globally within the component tree
export const useGlobalContext = (): AppContextT | null => {
  return useContext(AppContext);
};

export { AppContext, ContextProvider };
