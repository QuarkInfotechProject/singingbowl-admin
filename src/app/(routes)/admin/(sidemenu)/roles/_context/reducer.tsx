import { InitialStateT } from "./context";

// TYPE BEGINS
export type ActionT =
  | {
      type: "HANDLE_LOADING";
      payload: { status: boolean };
    }
  | {
      type: "HANDLE_GROUP_NAME";
      payload: { data: string };
    }
  | {
      type: "HANDLE_INITIAL_DATA";
      payload: {
        last_page: any;
        current_page: any;
        data: {
          id: number;
          name: string;
          createdAt: string;
        }[];
      };
    }
  | {
      type: "HANDLE_SINGLE_DATA";
      payload: {
        data: {
          id: number;
          name: string;
          createdAt: string;
        };
      };
    }
  | {
      type: "HANDLE_DELETE_DATA";
      payload: { id: number };
    }
  | {
      type: "HANDLE_EDIT_LOADING";
      payload: { status: boolean };
    };

// TYPEs END

// REDUCER FUNCTION BEGINS
const reducer = (state: InitialStateT, action: ActionT) => {
  if (action.type === "HANDLE_LOADING") {
    return { ...state, loading: action.payload.status };
  }
  if (action.type === "HANDLE_SINGLE_DATA") {
    return { ...state, singleData: action.payload.data };
  }
  if (action.type === "HANDLE_INITIAL_DATA") {
    return {
      ...state,
      data: action.payload.data,
      current_page: action.payload.current_page,
      last_page: action.payload.last_page,
    };
  }
  if (action.type === "HANDLE_GROUP_NAME") {
    return { ...state, group: action.payload.data };
  }
  if (action.type === "HANDLE_EDIT_LOADING") {
    return { ...state, editLoading: action.payload.status };
  }
  if (action.type === "HANDLE_DELETE_DATA") {
    return {
      ...state,
      data: state.data.filter((item) => item.id !== action.payload.id),
    };
  }
  return state;
};

export default reducer;
