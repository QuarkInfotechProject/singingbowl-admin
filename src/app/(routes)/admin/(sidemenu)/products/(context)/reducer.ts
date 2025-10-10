import { InitialStateT } from './context';
import { AllProductT } from '@/app/_types/products_Type/allProductT';
import { SingleProductT } from '@/app/_types/products_Type/singleProductT';
// TYPE BEGINS
export type ActionT =
  | {
      type: 'HANDLE_LOADING';
      payload: { status: boolean };
    }
  | {
      type: 'HANDLE_INITIAL_DATA';
      payload: {
        listData:AllProductT | [] ;
        pages: number;
      };
    }
  | {
      type: 'HANDLE_SINGLE_DATA';
      payload: {
        data: SingleProductT;
      };
    }

  | {
      type: 'HANDLE_DELETE_DATA';
      payload: { id: number };
    }
  | {
      type: 'HANDLE_EDIT_LOADING';
      payload: { status: boolean };
    };

// TYPEs END

// REDUCER FUNCTION BEGINS
const reducer = (state: InitialStateT, action: ActionT) => {
  if (action.type === 'HANDLE_LOADING') {
    return { ...state, loading: action.payload.status };
  }
  if (action.type === 'HANDLE_SINGLE_DATA') {
    return { ...state, singleData: action.payload.data };
  }
  if (action.type === 'HANDLE_INITIAL_DATA') {
    return {
      ...state,
      listData: action.payload.listData,
      pages: action.payload.pages,
    };
  }
  if (action.type === 'HANDLE_DELETE_DATA') {
    return {
      ...state,
      listData: state.data.filter((item) => item.id !== action.payload.id),
    };
  }
  return state;
};

  
  
  export default reducer;

