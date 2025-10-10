"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import RootElement from "./RootElement";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import debounce from "lodash.debounce";
type OptionType = {
  value: string;
  label: string;
};

const Page = () => {
  const [customerOrder, setCustomerOrder] = useState({
    summary: {
      totalCustomers: 0,
      averageOrdersPerCustomer: 0,
      averageLifetimeSpend: 0,
      averageOrderValue: 0,
    },
    users: [],
    pagination: {
      currentPage: 0,
      lastPage: 0,
      perPage: 0,
      total: 0,
    },
  });

  const [customerSearchData, setCustomerSearchData] = useState({
    summary: {
      totalCustomers: 0,
      averageOrdersPerCustomer: 0,
      averageLifetimeSpend: 0,
      averageOrderValue: 0,
    },
    users: [],
    pagination: {
      currentPage: 0,
      lastPage: 0,
      perPage: 0,
      total: 0,
    },
  });
  const prevSelectedValuesRef = useRef([]);

  const [data, setData] = useState<OptionType[]>([]);
  const [selectedValues, setSelectedValues] = useState<OptionType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getCustomersOrder = async ({
    name,
    sortBy,
    sortDirection,
    page,
    perPage,
  }: any) => {
    setLoading(true);
    try {
      const formData = {
        name: name || "",
        sortBy: sortBy || "",
        sortDirection: sortDirection || "desc",
        page: page || "1",
        perPage: perPage || "25",
      };

      const res = await clientSideFetch({
        url: "/end-users/summary",
        method: "post",
        body: formData,
        debug: true,
      });
      if (res?.status === 200) {
        const newData = res?.data?.data || {
          summary: {},
          users: [],
          pagination: {},
        };
        if (name) {
          setCustomerSearchData({
            summary: newData.summary,
            users: [
              ...new Set(
                [...customerSearchData.users, ...newData.users].map(
                  (user) => user.id
                )
              ),
            ].map((id) =>
              [...customerSearchData.users, ...newData.users].find(
                (user) => user.id === id
              )
            ),
            // users: [...customerSearchData.users, ...newData.users],
            pagination: newData?.pagination,
          });
          setCustomerOrder({
            summary: {},
            users: [],
            pagination: newData?.pagination,
          });
        } else {
          setData([]);
          setCustomerSearchData({
            summary: {},
            users: [],
            pagination: {},
          });
          setCustomerOrder({
            summary: newData.summary,
            users: newData.users,
            pagination: newData?.pagination,
          });
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      setLoading(true);
      if (searchQuery === "") {
        setData([]);
        getCustomersOrder({
          name: "",
          sortBy: "",
          sortDirection: "desc",
        });
      } else {
        try {
          const formData = {
            name: searchQuery,
            sortBy: "",
            sortDirection: "desc",
          };
          const res = await clientSideFetch({
            url: "/end-users/summary",
            method: "post",
            body: formData,
            debug: true,
          });
          if (res?.status === 200) {
            const options =
              res?.data?.data?.users?.map(
                (item: { id: number; name: string }) => ({
                  value: item.name,
                  label: item.name,
                })
              ) || [];
            // Only set data when there's a search term
            setData((prevData) => [
              ...prevData,
              ...options?.filter(
                (option: any) =>
                  !prevData.some(
                    (prevOption) => prevOption.value === option.value
                  )
              ),
            ]);
          }
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      debouncedSearch(searchTerm);
    } else {
      setData([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedValues.length < prevSelectedValuesRef.current.length) {
      if (selectedValues.length === 0) {
        debouncedSearch("");
        setCustomerSearchData({
          summary: {},
          users: [],
          pagination: {},
        });
        setCustomerOrder({
          summary: {},
          users: [],
          pagination: {},
        });
      } else {
        const removedNames = prevSelectedValuesRef.current
          .filter((prevItem) => {
            return !selectedValues.some((currItem) => {
              const exactMatch = currItem.value === prevItem.value;
              const partialMatch = currItem.value.includes(prevItem.value);
              return exactMatch || partialMatch;
            });
          })
          .map((item) => item.value);
        setCustomerSearchData((prev) => ({
          ...prev,
          users: prev.users.filter((user) => !removedNames.includes(user.name)),
          pagination: prev.pagination,
        }));
      }

      prevSelectedValuesRef.current = selectedValues;
      return;
    }
    if (selectedValues.length > 0) {
      const debouncedGetCustomersOrder = debounce(async () => {
        const selectedMap = [...selectedValues];
        const item = selectedMap[selectedMap.length - 1];
        await getCustomersOrder({
          name: item.value,
          sortBy: "",
          sortDirection: "desc",
        });
      }, 500);

      debouncedGetCustomersOrder();
    }
    prevSelectedValuesRef.current = selectedValues;
  }, [selectedValues]);

  const handleInputChange = (newInputValue: string) => {
    setSearchTerm(newInputValue);
  };

  useEffect(() => {
    getCustomersOrder({
      name: "",
      sortBy: "",
      sortDirection: "desc",
    });
  }, []);

  const handleCouponsClickExcluded = (selectedOption: OptionType[]) => {
    const updatedSelection = selectedOption.map((option) => {
      if (option.value === searchTerm) {
        return { value: searchTerm, label: searchTerm };
      }
      return option;
    });

    setSelectedValues(updatedSelection);
  };

  const customerInformation =
    customerOrder?.users?.length > 0 ||
    Object.values(customerOrder.summary).some((value) => value > 0)
      ? customerOrder
      : customerSearchData;

  if (searchTerm.trim() !== "") {
    data[0] = {
      value: searchTerm,
      label: `All customers' names that include "${searchTerm}"`,
    };
  }

  return (
    <div>
      <RootElement
        data={data}
        handleCouponsClickExcluded={handleCouponsClickExcluded}
        customerOrder={customerInformation}
        selectedValues={selectedValues}
        customerSearchData={customerSearchData}
        getCustomersOrder={getCustomersOrder}
        handleInputChange={handleInputChange}
        searchTerms={searchTerm}
      />
    </div>
  );
};

export default Page;
