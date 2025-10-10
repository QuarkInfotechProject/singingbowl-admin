import { InitialStateT } from './context';

// TYPE BEGINS
export type ActionT =
  | {
      type: 'HANDLE_LOADING';
      payload: { status: boolean };
    }
  | {
      type: 'HANDLE_GROUP_NAME';
      payload: { data: string };
    }
  | {
      type: 'HANDLE_INITIAL_DATA';
      payload: {
        current_page: number;
  last_page: number;
        data: {
          id: number;
          attributeSet: string;
          name: string;
          url: string;
        }[];
      };
    }
 |{
      type: 'HANDLE_EDIT_LOADING';
      payload: { status: boolean };
    };

// TYPEs END

// REDUCER FUNCTION BEGINS
const reducer = (state: InitialStateT, action: ActionT) => {
  if (action.type === 'HANDLE_LOADING') {
    return { ...state, loading: action.payload.status };
  }
  
  if (action.type === 'HANDLE_INITIAL_DATA') {
    return { ...state, data: action.payload.data, current_page: action.payload.current_page, last_page: action.payload.last_page, };
  }
  if (action.type === 'HANDLE_GROUP_NAME') {
    return { ...state, group: action.payload.data };
  }
  if (action.type === 'HANDLE_EDIT_LOADING') {
    return { ...state, editLoading: action.payload.status };
  }
 
  return state;
};

export default reducer;
