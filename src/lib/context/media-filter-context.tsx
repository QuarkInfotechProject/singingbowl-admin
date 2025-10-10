import React, { createContext, useContext, useState } from "react";

interface ContextType {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

//@ts-ignore
const MediaFilterContext = createContext<ContextType>(null);

export const useMediaFilter = () => useContext(MediaFilterContext);

interface Props {
  children: React.ReactNode;
}

function MediaFilterContextProvider({ children }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <MediaFilterContext.Provider value={{ search, setSearch, sortBy, setSortBy, category, setCategory }}>
      {children}
    </MediaFilterContext.Provider>
  );
}

export default MediaFilterContextProvider;