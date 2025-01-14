import { useState, useEffect, useRef } from "react";
import useDebounce from "./useDebounce";
import api from "../services/api/api";
import { useTranslation } from "react-i18next";

interface FetchError {
  message: string;
}

export const useFetchTableData = (
  searchValue: string,
  url: any,
  payload?: any,
  listiner?: any,
  canFetch: boolean = true,
  isOnlySearch: boolean = false
) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [count, setCount] = useState(0);
  const { i18n } = useTranslation();
  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const isInitialRender = useRef(true);

  const fetchData = async () => {
    if (canFetch) {
      setLoading(true);
      try {
        const response = await api.send<{
          data: {
            rows: any[];
            count: number;
            status: any;
          };
          message: string | null;
        }>(url, {
          ...payload,
          // [isOnlySearch ? "search" : "searchValue"]:
          //   i18n.language == "en" ? debouncedSearchValue : "",
          // searchValueAr: i18n.language == "ar" ? debouncedSearchValue : "",
          pageNumber: pageNumber + 1,
        });
        const newData: any[] = response?.data?.rows;
        setData(newData);
        setCount(response?.data?.count);
      } catch (error: any) {
        console.log("error", error);

        setError({ message: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    fetchData();
  }, [pageNumber]);

  useEffect(() => {
    if (isInitialRender.current) {
      return;
    }
    setPageNumber(0);
    fetchData();
  }, [debouncedSearchValue, listiner]);

  return {
    data,
    loading,
    error,
    setPageNumber,
    pageNumber,
    fetchData,
    count,
    setData,
  };
};
