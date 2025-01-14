import React from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  TableInstance,
  Row,
} from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "./table.scss";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoChevronForwardSharp } from "react-icons/io5";

// import backgroundImageLeft from "../../assets/icons/andoramask.svg";
// import backgroundImageRight from "../../assets/icons/andoramaskright.svg";
import { useTranslation } from "react-i18next";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";

// Define a type for the row data
type RowData = {
  [key: string]: any;
};

// Define a type for the column
interface Column {
  Header: string | (() => JSX.Element);
  accessor: string; // keys from row data
  disableSortBy?: boolean;
}

interface ReactTableProps {
  columns: Column[];
  data: RowData[];
  pageNumber?: number;
  setPageNumber?: (page: number) => void;
  pageCount?: number;
  enableSorting?: boolean;
}
const TableComponent: React.FC<ReactTableProps> = ({
  columns,
  data,
  pageNumber,
  setPageNumber,
  pageCount,
  enableSorting = false,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      { columns, data },
      ...(enableSorting ? [useSortBy] : []),
      usePagination
    ) as TableInstance<RowData> & {
      canPreviousPage: boolean;
      canNextPage: boolean;
      page: any;
      pageOptions: number[];
      pageCount: number;
      nextPage: () => void;
      previousPage: () => void;
    };

  const { i18n } = useTranslation();

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of page buttons visible, excluding first and last pages.

    // Calculate start and end indices for visible page buttons
    let startPage = Math.max(pageNumber! - Math.floor(maxPageButtons / 2), 0);
    let endPage = Math.min(startPage! + maxPageButtons - 1, pageCount! - 1);

    // Adjust if the current page is near the start or end
    if (pageNumber! < Math.floor(maxPageButtons / 2)) {
      endPage = Math.min(maxPageButtons - 1, pageCount! - 1);
    } else if (pageCount! - pageNumber! <= Math.floor(maxPageButtons / 2)) {
      startPage = Math.max(pageCount! - maxPageButtons, 0);
    }

    // Show first page and ellipsis if needed
    if (startPage > 0) {
      pageNumbers.push(
        <button
          className="border-0 px-2 py-1 bg-transparent"
          key="page-1"
          onClick={() => setPageNumber?.(0)}
          style={{ color: "var(--primary)" }}
        >
          1
        </button>
      );
      if (startPage > 1) {
        pageNumbers.push(
          <span className="mt-1 me-2" key="ellipsis-start">
            ...
          </span>
        );
      }
    }
    // Generate buttons for visible page range
    for (let i = startPage; i <= endPage; i++) {
      const isActivePage = pageNumber === i;
      const buttonStyle = isActivePage
        ? {
            backgroundColor: "var(--secondary)",
            color: "black",
            padding: "2px 12px",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }
        : {
            backgroundColor: "transparent",
            color: "var(--primary)",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          };
      pageNumbers.push(
        <button
          key={`page-${i}`}
          disabled={isActivePage}
          onClick={() => setPageNumber?.(i)}
          className="border-0 me-3 rounded"
          style={buttonStyle}
          // disabled={isActivePage}
        >
          {i + 1}
        </button>
      );
    }

    // Show ellipsis and last page if needed
    if (endPage < pageCount! - 1) {
      if (endPage < pageCount! - 2) {
        pageNumbers.push(
          <span className="mt-1 me-2" key="ellipsis-end">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={`page-${pageCount! - 1}`}
          onClick={() => setPageNumber?.(pageCount! - 1)}
          className="border-0 px-2 py-1 bg-transparent"
          style={{ color: "var(--primary)" }}
        >
          {pageCount}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex w-100 flex-column justify-content-start align-items-end tableDiv">
      <div className="table-content d-flex w-100 flex-column justify-content-start align-items-end">
        <div
          style={{
            width: "100%",
            // overflowX: "auto", // Enable horizontal scrolling on smaller screens
          }}
        >
          <table
            {...getTableProps()}
            cellPadding="10"
            style={{ minWidth: "800px" }}
          >
            <thead
              style={{
                textAlign: "start",
                // backgroundImage:
                //   i18n.language === "en"
                //     ? `url(${backgroundImageLeft})`
                //     : `url(${backgroundImageRight})`,
                backgroundSize: "initial",
                backgroundPosition:
                  i18n.language === "en" ? "-15% 43%" : "115% 44%",
                backgroundRepeat: "no-repeat",
                height: "69px",
                fontWeight: "lighter !important",
                fontSize: "14px",
              }}
            >
              {headerGroups.map((headerGroup: any) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: RowData, i: number) => (
                    <th
                      {...column.getHeaderProps(
                        enableSorting
                          ? column.getSortByToggleProps()
                          : undefined
                      )}
                      style={{ textAlign: i == 0 ? "start" : "start" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: i == 0 ? "start" : "start",
                        }}
                      >
                        {column.render("Header")}
                        {enableSorting && column.canSort ? (
                          <span>
                            <TiArrowUpThick
                              style={{
                                marginLeft:
                                  i18n.language === "en" ? "5px" : "0",
                              }}
                              className={
                                column.isSorted
                                  ? column.isSortedDesc
                                    ? ""
                                    : "text-secondary"
                                  : ""
                              }
                            />
                            <TiArrowDownThick
                              style={{ marginLeft: "-3px" }}
                              className={
                                column.isSortedDesc ? "text-secondary" : ""
                              }
                            />
                          </span>
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              style={{
                color: "var(--primary) !important",
                borderSpacing: "0 50px",
              }}
            >
              {page.length > 0 ? (
                page.map((row: Row<RowData>) => {
                  prepareRow(row);
                  return (
                    <tr className="mb-2" {...row.getRowProps()}>
                      {row.cells.map((cell: any, i: number) => (
                        <td
                          style={{
                            textAlign: i == 0 ? "start" : "start",
                            // textAlign: i == 0 ? "center" : "center",
                            width:
                              row.cells.length == 3
                                ? `calc(100% / ${row.cells.length})`
                                : "unset",
                          }}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr style={{ backgroundColor: "var(--white)" }}>
                  <td
                    colSpan={columns.length}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No Data To Show
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination controls */}
      {page.length > 0 && (
        <div className="pagination mt-2 me-4 d-flex align-items-center justify-content-center">
          <button
            className="border-0 me-2 px-2 py-1 bg-transparent"
            style={{ fontSize: "22px" }}
            onClick={() => setPageNumber?.(pageNumber! - 1)}
            disabled={pageNumber! === 0}
          >
            {i18n.language === "en" ? (
              <IoChevronBackSharp style={{ color: "var(--primary)" }} />
            ) : (
              <IoChevronForwardSharp style={{ color: "var(--primary)" }} />
            )}
          </button>
          {renderPageNumbers()}
          <button
            className="border-0 ms-2 px-2 py-1 bg-transparent"
            style={{ fontSize: "24px" }}
            onClick={() => setPageNumber?.(pageNumber! + 1)}
            disabled={pageNumber! + 1 === pageCount}
          >
            {i18n.language === "en" ? (
              <IoChevronForwardSharp style={{ color: "var(--primary)" }} />
            ) : (
              <IoChevronBackSharp style={{ color: "var(--primary)" }} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
