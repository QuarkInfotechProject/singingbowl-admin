import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import makeAnimated from "react-select/animated";
import { FaCloudDownloadAlt } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Selects from "react-select";
import { ChevronLeft, ChevronRight } from "lucide-react";
const Root = ({
  data,
  handleCouponsClickExcluded,
  selectedValues,
  customerOrder,
  handleInputChange,
  getCustomersOrder,
  searchTerms,
  customerSearchData,
}: any) => {
  const [orderSort, setOrderSort] = useState("desc");
  const [handleSpend, sethandleSpend] = useState("desc");
  const [dateRegister, setDateRegister] = useState("desc");
  const [lastActive, setLastActive] = useState("desc");
  const [name, setName] = useState("desc");
  const animatedComponents = makeAnimated();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const TotalCustomers = customerSearchData?.users?.length || 0;
  const totalOrders =
    customerSearchData?.users?.reduce((sum, item) => sum + item.orders, 0) || 0;
  const totalRevenue =
    customerSearchData?.users?.reduce(
      (sum, item) => sum + parseFloat(item.total),
      0
    ) || 0;
  // Correcting the variable names and syntax
  const totalCustomersSearch = TotalCustomers;
  const averageOrdersPerCustomerSearch =
    totalCustomersSearch > 0 ? totalOrders / totalCustomersSearch : 0;
  const averageLifetimeSpendSearch =
    totalCustomersSearch > 0 ? totalRevenue / totalCustomersSearch : 0;
  const averageOrderValueSearch =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;
  // You can now use these values in your code or set them in your state

  // color
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    const excludedSentence = "All customers' names that include";
    if (text.includes(excludedSentence)) {
      const parts = text.split(excludedSentence);
      return (
        <>
          {parts[0]}
          {excludedSentence}
          {highlightText(parts[1], searchTerm)}
        </>
      );
    }
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ fontWeight: "bold", color: "blue" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleOrder = () => {
    setOrderSort((prev) => {
      if (prev === "desc") {
        return "asc";
      } else {
        return "desc";
      }
    });
    getCustomersOrder({
      name: "",
      sortBy: "orders",
      sortDirection: orderSort,
    });
  };
  const handletotalSpend = () => {
    const newSortDirection = handleSpend === "desc" ? "asc" : "desc";
    sethandleSpend(newSortDirection);
    getCustomersOrder({
      name: "",
      sortBy: "total_spend",
      sortDirection: newSortDirection,
    });
  };

  const HandleDateregistered = () => {
    setDateRegister((prev) => {
      if (prev === "desc") {
        return "asc";
      } else {
        return "desc";
      }
    });
    getCustomersOrder({
      name: "",
      sortBy: "date_registered",
      sortDirection: dateRegister,
    });
  };
  const handleClickLastActive = () => {
    setLastActive((prev) => {
      if (prev === "desc") {
        return "asc";
      } else {
        return "desc";
      }
    });
    getCustomersOrder({
      name: "",
      sortBy: "last_active",
      sortDirection: lastActive,
    });
  };
  const handleNameSort = () => {
    setName((prev) => {
      if (prev === "desc") {
        return "asc";
      } else {
        return "desc";
      }
    });
    getCustomersOrder({
      name: "",
      sortBy: "name",
      sortDirection: name,
    });
  };
  const handleDownloadCSV = () => {
    const headers = [
      "Name",
      "Username",
      "Last Active",
      "Date Registered",
      "Email",
      "Orders",
      "Total Spend",
      "AOV",
      "Country/Region",
      "Province",
      "City",
      "Zone",
      "Address",
    ];
    const csvRows = [];
    csvRows.push(headers.join(","));
    customerOrder?.users.forEach((user: any) => {
      const row = [
        user.name,
        user.name.replace(/\s/g, ""),
        user.lastActive,
        user.dateRegistered,
        user.email,
        user.orders,
        user.total,
        user.aov,
        user.address?.country || "N/A",
        user.address?.province || "N/A",
        user.address?.city || "N/A",
        user.address?.zone || "N/A",
        user.address?.location || "N/A",
      ];
      const csvRow = row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",");

      csvRows.push(csvRow);
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "customer.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // pagination logic

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= customerOrder?.pagination?.total) {
      setPage(newPage);
      getCustomersOrder({
        sortDirection: "desc",
        page: newPage,
        perPage: rowsPerPage.toString(),
      });
    }
  };

  const handleRowsPerPageChange = (value: any) => {
    const newRowsPerPage = Number(value);
    if (newRowsPerPage > 0) {
      setRowsPerPage(newRowsPerPage);
      getCustomersOrder({
        sortDirection: "desc",
        page: page,
        perPage: newRowsPerPage.toString(),
      });
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Number(e.target.value);
    if (newPage > 0 && newPage <= customerOrder?.pagination?.total) {
      setPage(newPage);
      getCustomersOrder({
        sortDirection: "desc",
        page: newPage,
        perPage: rowsPerPage.toString(),
      });
    }
  };

  return (
    <section>
      <div className="flex flex-col">
        <div className="p-5">
          <div className="flex justify-around space-x-4 items-center">
            <div className="justify-center items-center flex space-x-2 flex-grow">
              {" "}
              <p className="font-bold text-lg"> Customer</p>
              <Selects
                className="w-full"
                isMulti
                components={animatedComponents}
                options={data}
                onChange={handleCouponsClickExcluded}
                value={selectedValues}
                onInputChange={handleInputChange}
                placeholder="Search..."
                components={{ DropdownIndicator: null }}
                getOptionLabel={(e) => highlightText(e.label, searchTerms)}
              />
            </div>
            <div className="flex gap-2 mr-auto">
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                className="border-none bg-gray-100 flex space-x-3 justify-center items-center cursor-pointer"
              >
                <FaCloudDownloadAlt size={24} />
                <p className="font-semibold">Download</p>
              </Button>
              <div></div>
            </div>
          </div>
        </div>
        {/* table */}

        <div className="my-4 overflow-x-auto text-md">
          <Table className="min-w-full table-auto border-collapse">
            <TableHeader className="font-semibold">
              <TableRow className="bg-gray-100 ">
                <TableHead
                  className="px-6 py-3  cursor-pointer"
                  onClick={handleNameSort}
                >
                  <p className="flex justify-center items-center space-x-1">
                    Name{" "}
                    {name === "desc" ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowUp size={20} />
                    )}
                  </p>
                </TableHead>
                <TableHead
                  className="px-6 py-3  cursor-pointer whitespace-nowrap"
                  onClick={handleClickLastActive}
                >
                  <p className="flex justify-center items-center space-x-1">
                    Last active{" "}
                    {lastActive === "desc" ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowUp size={20} />
                    )}
                  </p>
                </TableHead>
                <TableHead
                  className="px-6 py-3  cursor-pointer whitespace-nowrap"
                  onClick={HandleDateregistered}
                >
                  <p className="flex space-x-1 justify-center items-center">
                    Date registered{" "}
                    {dateRegister === "desc" ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowUp size={20} />
                    )}
                  </p>
                </TableHead>
                <TableHead className="px-6 py-3 ">Email</TableHead>
                <TableHead
                  className="px-6 py-3  cursor-pointer "
                  onClick={handleOrder}
                >
                  <p className="flex justify-center items-center space-x-1">
                    {" "}
                    Orders
                    {orderSort === "desc" ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowUp size={20} />
                    )}
                  </p>
                </TableHead>
                <TableHead
                  className="px-6 py-3  cursor-pointer whitespace-nowrap"
                  onClick={handletotalSpend}
                >
                  <p className="flex space-x-1 justify-center items-center">
                    Total spend{" "}
                    {handleSpend === "desc" ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowUp size={20} />
                    )}
                  </p>
                </TableHead>
                <TableHead className="px-10 py-3 ">AOV</TableHead>
                <TableHead className="px-6 py-3  whitespace-nowrap">
                  Country/Region
                </TableHead>
                <TableHead className="px-6 py-3 ">Province</TableHead>
                <TableHead className="px-6 py-3 ">City</TableHead>
                <TableHead className="px-6 py-3 ">Zone</TableHead>
                <TableHead className="px-6 py-3 ">Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerOrder?.users.map((order, index) => (
                <TableRow key={index} className="hover:bg-gray-50 gap-4">
                  <TableCell className="px-6 py-3  whitespace-nowrap">
                    {order?.name}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {order?.lastActive}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {order?.dateRegistered}
                  </TableCell>
                  <TableCell className="px-6 py-3">{order.email}</TableCell>
                  <TableCell className="px-10 py-3">{order.orders}</TableCell>
                  <TableCell className="px-8 py-3 whitespace-nowrap">
                    Rs{" "}
                    {parseFloat(order.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-3 whitespace-nowrap">
                    Rs{" "}
                    {parseFloat(order?.aov).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })}
                  </TableCell>
                  <TableCell className="px-10 py-3">
                    {order?.address.country}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {order?.address.province}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {order?.address.city}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {order?.address.zone}
                  </TableCell>
                  <TableCell className="px-6 py-3 whitespace-nowrap">
                    {order?.address.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/*  */}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-10 mt-8">
          <div className="flex justify-center items-center gap-4 space-x-5  shadow-md p-2 rounded-md">
            <button
              className="flex justify-center items-center  "
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={20} className="text-black mt-1" /> <p>Prev</p>
            </button>
            <div>
              <p className="font-semibold">
                Page {page} of {customerOrder?.pagination.lastPage}
              </p>
            </div>
            <button
              className=" flex justify-center items-center  "
              onClick={() => handlePageChange(page + 1)}
              disabled={page === customerOrder?.pagination?.lastPage}
            >
              <p>Next</p> <ChevronRight size={20} className="text-black mt-1" />
            </button>
          </div>
          {/* Go to Page */}
          <div className="flex justify-center items-center space-x-4 w-64">
            <p className="whitespace-nowrap font-semibold">Go to Page</p>
            <Input
              type="number"
              value={page}
              onChange={handlePageInputChange}
              min={1}
              max={customerOrder?.pagination?.total}
            />
          </div>

          {/* Rows per page */}
          <div className="flex justify-center items-center space-x-5 ">
            <p className="whitespace-nowrap font-semibold">Rows per page</p>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>{rowsPerPage}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="75">75</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {customerOrder?.summary && (
          <div className="flex justify-center items-center space-x-6 text-md py-10">
            <p>
              <span className="font-bold space-x-1">
                {TotalCustomers || customerOrder?.summary?.totalCustomers || 0}
              </span>{" "}
              customers
            </p>
            <p>
              <span className="font-bold space-x-1">
                {TotalCustomers !== 0
                  ? averageOrdersPerCustomerSearch
                    ? averageOrdersPerCustomerSearch.toLocaleString(undefined, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 2,
                      })
                    : "0"
                  : customerOrder?.summary?.averageOrdersPerCustomer
                  ? parseFloat(
                      customerOrder?.summary.averageOrdersPerCustomer
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 3,
                      minimumFractionDigits: 2,
                    })
                  : "0"}{" "}
              </span>
              {"  "}
              Average orders
            </p>
            <p>
              <span className="font-bold space-x-1">
                Rs{" "}
                {TotalCustomers !== 0
                  ? averageLifetimeSpendSearch &&
                    !isNaN(averageLifetimeSpendSearch)
                    ? averageLifetimeSpendSearch.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })
                    : "0"
                  : customerOrder?.summary?.averageLifetimeSpend &&
                    !isNaN(customerOrder?.summary.averageLifetimeSpend)
                  ? parseFloat(
                      customerOrder?.summary.averageLifetimeSpend
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })
                  : "0"}
              </span>
              {"  "}
              Average lifetime spend
            </p>
            <p>
              <span className="font-bold space-x-1">
                Rs{" "}
                {TotalCustomers !== 0
                  ? averageOrderValueSearch && !isNaN(averageOrderValueSearch)
                    ? averageOrderValueSearch.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })
                    : "0"
                  : customerOrder?.summary?.averageOrderValue &&
                    !isNaN(customerOrder?.summary.averageOrderValue)
                  ? parseFloat(
                      customerOrder?.summary.averageOrderValue
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })
                  : "0"}
              </span>
              {"  "}
              Average order value
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Root;
