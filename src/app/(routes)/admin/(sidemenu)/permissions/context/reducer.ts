import { InitialStateT } from './context';

// TYPE BEGINS
export type ActionT =
  | {
      type: 'HANDLE_LOADING';
      payload: { status: boolean };
    }
  | {
      type: 'HANDLE_INITIAL_DATA';
      payload: {
        data: {
          id: number;
          menu_id: number;
          user_type_id: number;
          created_by: number;
          created_at: string;
        }[];
      };
    }
  | {
      type: 'HANDLE_DELETE_DATA';
      payload: { id: number };
    };

// TYPEs END

// REDUCER FUNCTION BEGINS
const reducer = (state: InitialStateT, action: ActionT) => {
  if (action.type === 'HANDLE_LOADING') {
    return { ...state, loading: action.payload.status };
  }
  if (action.type === 'HANDLE_INITIAL_DATA') {
    return { ...state, data: action.payload.data };
  }
  if (action.type === 'HANDLE_DELETE_DATA') {
    return {
      ...state,
      data: state.data.filter((item) => item.id !== action.payload.id),
    };
  }
  return state;
};

export default reducer;
