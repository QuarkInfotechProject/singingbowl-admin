// "use client";
// import React, {
//   useContext,
//   createContext,
//   useReducer,
//   ReactNode,
//   useEffect,
// } from "react";
// // import reducer from './reducer';

// // import { useParams } from 'next/navigation';
// import { useToast } from "@/components/ui/use-toast";
// import { useSearchParams } from "next/navigation";
// import { clientSideFetch } from "@/app/_utils/clientSideFetch";
// import { SingleProductT } from "@/app/_types/products_Type/singleProductT";
// import { AllProductT } from "@/app/_types/products_Type/allProductT";

// interface AppContextT {
//   state: InitialStateT;
//   getData: ({
//     sortDirection,
//     querySku,
//     sortBy,
//     queryName,
//     status,
//     page
//   }: {
//     sortDirection?: "asc" | "desc";
//     querySku?: string;
//     queryName?: string;
//     sortBy?: "price" | "name"|"date";
//     status?: boolean;
//     page?: number
//   }) => Promise<void>;
//   getSingleData: (id: any) => void;
//   deleteData: (id: any) => void;
//   handleEditLoading: (id: boolean) => void;
//   handlePageChange: (page: number) => void;
//   handleLoading: (status: boolean) => void;
// }

// export interface InitialStateT {
//   loading: boolean;
//   editLoading: boolean;
//   currentPage: number;
//   totalPages: number;
//   pages: number;
//   listData: AllProductT[];
//   singleData: SingleProductT | null;
// }

// const initialState: InitialStateT = {
//   loading: false,
//   editLoading: false,
//   currentPage: 1,
//   totalPages: 1,
//   pages: 1,
//   listData: [],
//   singleData: null,
// };

// type ActionType =
//   | { type: "HANDLE_LOADING"; payload: { status: boolean } }
//   | { type: "HANDLE_EDIT_LOADING"; payload: { status: boolean } }
//   | {
//     type: "HANDLE_INITIAL_DATA";
//     payload: {
//       listData: AllProductT[];
//       currentPage: number;
//       totalPages: number;
//     };
//   }
//   | { type: "HANDLE_SINGLE_DATA"; payload: { data: SingleProductT } };

// const reducer = (state: InitialStateT, action: ActionType): InitialStateT => {
//   switch (action.type) {
//     case "HANDLE_LOADING":
//       return { ...state, loading: action.payload.status };
//     case "HANDLE_EDIT_LOADING":
//       return { ...state, editLoading: action.payload.status };
//     case "HANDLE_INITIAL_DATA":
//       return {
//         ...state,
//         listData: action.payload.listData,
//         currentPage: action.payload.currentPage,
//         totalPages: action.payload.totalPages,
//       };
//     case "HANDLE_SINGLE_DATA":
//       return { ...state, singleData: action.payload.data };
//     default:
//       return state;
//   }
// };

// const AppContext = createContext<AppContextT | null>(null);
// const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   // const params = useParams();
//   const searchParams = useSearchParams();
//   const { toast } = useToast();
//   const [state, dispatch] = useReducer(reducer, initialState);
//   // dispatch the created reducer here and pass it throughout the component tree

//   const handleLoading = (bool: boolean) => {
//     dispatch({ type: "HANDLE_LOADING", payload: { status: bool } });
//   };
  
//   const handlePageChange = (pageNo: number) => {
//     getData({ page: pageNo });
//   }
  
//   const getData = async ({
//     sortDirection = "desc",
//     querySku = "",
//     sortBy = "date",
//     queryName = "",
//     status = true,
//     page = 1  
//   }: {
//     sortDirection?: "asc" | "desc";
//     querySku?: string;
//     queryName?: string;
//     sortBy?: "price" | "name"|"date";
//     status?: boolean;
//     page?: number 
//   }) => {
//     try {
//       handleLoading(true)
//       const res = await clientSideFetch({
//         url: "/products",
//         handleLoading: handleLoading,
//         method: "post",
//         body: {
//           status: status ? true : false,
//           name: queryName,
//           sku: querySku,
//           sortBy: sortBy,
//           sortDirection: sortDirection,
//           page
//         },
//         toast: toast,
//       });

//       if (res?.status === 200 && res.data?.data?.data) {
//         const productsData = res.data.data.data;
//         dispatch({
//           type: "HANDLE_INITIAL_DATA",
//           payload: {
//             listData: productsData,
//             currentPage: res.data.data.current_page,
//             totalPages: res.data.data.last_page,
//           },
//         });
//       }
//     } catch (error) {
//       console.log("all data error", error);
//     }
//     finally{
//       handleLoading(false);
//     }
//   };

//   // getSingle Data
//   const getSingleData = async (id: string | string[]) => {
//     const res = await clientSideFetch({
//       url: `/products/${id}`,
//       handleLoading: handleLoading,
//       debug: true,
//       rawResponse: true,
//       method: "get",
//       toast: toast,
//     });
//     if (res) {
//       console.log("req", res.data.data);
//       dispatch({
//         type: "HANDLE_SINGLE_DATA",
//         payload: {
//           data: res.data.data,
//         },
//       });
//     }
//   };
//   // delete data
//   const deleteData = async (id: string) => {
//     const res = await clientSideFetch({
//       url: `/products/destroy`,
//       method: "post",
//       body: {
//         uuid: id,
//       },
//       toast: toast,
//       handleLoading: handleLoading,
//     });
//     if (res?.status === 200) {
//       getData({});
//     }
//   };
//   const getAttributes= async ()=>{
//     const response= await clientSideFetch({
//       url:`/attributes?perPage=10000`,
//       method:"post",
//       toast:"skip"
//     })
//     if(response?.status===200){
//       return response.data.data.data
//     }
//     return []
//   }
//   useEffect(()=>{
//    getAttributes()
//   },[])
//   const handleEditLoading = (status: boolean) => {
//     dispatch({ type: "HANDLE_EDIT_LOADING", payload: { status } });
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         state,
//         getData,
//         getSingleData,
//         deleteData,
//         handleEditLoading,
//         handlePageChange,
//         handleLoading
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// // custom hook to use the context globally within the component tree
// export const useGlobalContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useGlobalContext must be used within a ContextProvider");
//   }
//   return context;
// };

// export { AppContext, ContextProvider };
"use client";
import React, {
  useContext,
  createContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
// import reducer from './reducer';

// import { useParams } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { SingleProductT } from "@/app/_types/products_Type/singleProductT";
import { AllProductT } from "@/app/_types/products_Type/allProductT";

interface AppContextT {
  state: InitialStateT;
  attributes: any[]; // Add attributes to the context interface
  getData: ({
    sortDirection,
    querySku,
    sortBy,
    queryName,
    status,
    page
  }: {
    sortDirection?: "asc" | "desc";
    querySku?: string;
    queryName?: string;
    sortBy?: "price" | "name"|"date";
    status?: boolean;
    page?: number
  }) => Promise<void>;
  getSingleData: (id: any) => void;
  deleteData: (id: any) => void;
  handleEditLoading: (id: boolean) => void;
  handlePageChange: (page: number) => void;
  handleLoading: (status: boolean) => void;
}

export interface InitialStateT {
  loading: boolean;
  editLoading: boolean;
  currentPage: number;
  totalPages: number;
  pages: number;
  listData: AllProductT[];
  singleData: SingleProductT | null;
  attributes: any[]; // Add attributes to state
}

const initialState: InitialStateT = {
  loading: false,
  editLoading: false,
  currentPage: 1,
  totalPages: 1,
  pages: 1,
  listData: [],
  singleData: null,
  attributes: [], // Initialize attributes as empty array
};

type ActionType =
  | { type: "HANDLE_LOADING"; payload: { status: boolean } }
  | { type: "HANDLE_EDIT_LOADING"; payload: { status: boolean } }
  | {
    type: "HANDLE_INITIAL_DATA";
    payload: {
      listData: AllProductT[];
      currentPage: number;
      totalPages: number;
    };
  }
  | { type: "HANDLE_SINGLE_DATA"; payload: { data: SingleProductT } }
  | { type: "HANDLE_ATTRIBUTES_DATA"; payload: { data: any[] } }; // Add attributes action

const reducer = (state: InitialStateT, action: ActionType): InitialStateT => {
  switch (action.type) {
    case "HANDLE_LOADING":
      return { ...state, loading: action.payload.status };
    case "HANDLE_EDIT_LOADING":
      return { ...state, editLoading: action.payload.status };
    case "HANDLE_INITIAL_DATA":
      return {
        ...state,
        listData: action.payload.listData,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case "HANDLE_SINGLE_DATA":
      return { ...state, singleData: action.payload.data };
    case "HANDLE_ATTRIBUTES_DATA":
      return { ...state, attributes: action.payload.data };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextT | null>(null);
const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  // dispatch the created reducer here and pass it throughout the component tree

  const handleLoading = (bool: boolean) => {
    dispatch({ type: "HANDLE_LOADING", payload: { status: bool } });
  };
  
  const handlePageChange = (pageNo: number) => {
    getData({ page: pageNo });
  }
  
  const getData = async ({
    sortDirection = "desc",
    querySku = "",
    sortBy = "date",
    queryName = "",
    status = true,
    page = 1  
  }: {
    sortDirection?: "asc" | "desc";
    querySku?: string;
    queryName?: string;
    sortBy?: "price" | "name"|"date";
    status?: boolean;
    page?: number 
  }) => {
    try {
      handleLoading(true)
      const res = await clientSideFetch({
        url: "/products",
        handleLoading: handleLoading,
        method: "post",
        body: {
          status: status ? true : false,
          name: queryName,
          sku: querySku,
          sortBy: sortBy,
          sortDirection: sortDirection,
          page
        },
        toast: toast,
      });

      if (res?.status === 200 && res.data?.data?.data) {
        const productsData = res.data.data.data;
        dispatch({
          type: "HANDLE_INITIAL_DATA",
          payload: {
            listData: productsData,
            currentPage: res.data.data.current_page,
            totalPages: res.data.data.last_page,
          },
        });
      }
    } catch (error) {
      console.log("all data error", error);
    }
    finally{
      handleLoading(false);
    }
  };

  // getSingle Data
  const getSingleData = async (id: string | string[]) => {
    const res = await clientSideFetch({
      url: `/products/${id}`,
      handleLoading: handleLoading,
      debug: true,
      rawResponse: true,
      method: "get",
      toast: toast,
    });
    if (res) {
      dispatch({
        type: "HANDLE_SINGLE_DATA",
        payload: {
          data: res.data.data,
        },
      });
    }
  };
  
  // delete data
  const deleteData = async (id: string) => {
    const res = await clientSideFetch({
      url: `/products/destroy`,
      method: "post",
      body: {
        uuid: id,
      },
      toast: toast,
      handleLoading: handleLoading,
    });
    if (res?.status === 200) {
      getData({});
    }
  };
  
  const getAttributes = async () => {
    const response = await clientSideFetch({
      url: `/attributes?perPage=10000`,
      method: "post",
      toast: "skip"
    });
    if (response?.status === 200) {
      // Dispatch to store attributes in state
      dispatch({
        type: "HANDLE_ATTRIBUTES_DATA",
        payload: {
          data: response.data.data.data
        }
      });
      return response.data.data.data;
    }
    return [];
  }
  
  useEffect(() => {
    getAttributes();
  }, []);
  
  const handleEditLoading = (status: boolean) => {
    dispatch({ type: "HANDLE_EDIT_LOADING", payload: { status } });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        attributes: state.attributes, // Expose attributes directly
        getData,
        getSingleData,
        deleteData,
        handleEditLoading,
        handlePageChange,
        handleLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// custom hook to use the context globally within the component tree
export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a ContextProvider");
  }
  return context;
};

export { AppContext, ContextProvider };