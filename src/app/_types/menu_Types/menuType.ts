export interface DataT {
    id: number;
    title: string;
    sortOrder: number;
    icon: string | null;
    url: string | null;
    status: number;
    parentId: number;
  }
  export interface MenuT {
    id: number;
    title: string;
    sortOrder: number;
    icon: string | null;
    url: string | null;
    status: number;
    parentId: number;
    children?: DataT[];
  }
  
  export interface MenuResponseT {
    code: number;
    message: string;
    data: MenuT[];
  }
  