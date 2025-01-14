import React, { useState, useEffect } from "react";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

interface AsyncSelectDropdownProps {
  fetchOptions: (searchTerm: string, page: number) => Promise<Option[]>;
}

const AsyncSelectDropdown: React.FC<AsyncSelectDropdownProps> = ({
  fetchOptions,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Fetch options when the component mounts or page changes
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      try {
        const result = await fetchOptions("", page);
        console.log("Fetched options:", result); // Debugging: Log fetched data
        if (Array.isArray(result)) {
          setOptions((prevOptions) => [...prevOptions, ...result]);
        } else {
          console.error("fetchOptions did not return an array:", result);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [fetchOptions, page]);

  // Handle input changes for search
  const handleInputChange = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const searchOptions = await fetchOptions(searchTerm, 1);
      console.log("Search options:", searchOptions); // Debugging: Log search results
      if (Array.isArray(searchOptions)) {
        setOptions(searchOptions);
      } else {
        console.error("fetchOptions did not return an array:", searchOptions);
      }
    } catch (error) {
      console.error("Error fetching options for search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle menu scroll to fetch the next page
  const handleMenuScroll = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Select
      menuIsOpen
      options={options}
      onInputChange={(inputValue) => {
        console.log("Input value changed:", inputValue); // Debugging
        handleInputChange(inputValue);
      }}
      onMenuScrollToBottom={handleMenuScroll}
      isLoading={isLoading}
      isSearchable
      placeholder="Select an option..."
      getOptionLabel={(e) => e.label}
      getOptionValue={(e) => e.value}
      styles={{
        menu: (provided) => ({
          ...provided,
          maxHeight: "200px", // Set the maximum height
          overflowY: "auto", // Enable vertical scrolling
        }),
      }}
    />
  );
};

export default AsyncSelectDropdown;

// import React, { useState, useEffect } from "react";
// import Select from "react-select";

// interface Option {
//   value: string;
//   label: string;
// }

// interface AsyncSelectDropdownProps {
//   fetchOptions: (searchTerm: string, page: number) => Promise<Option[]>;
// }

// const AsyncSelectDropdown: React.FC<AsyncSelectDropdownProps> = ({
//   fetchOptions,
// }) => {
//   const [options, setOptions] = useState<Option[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [page, setPage] = useState<number>(1);

//   // Fetch options when the component mounts or page changes
//   useEffect(() => {
//     const loadOptions = async () => {
//       setIsLoading(true);
//       try {
//         const result = await fetchOptions("", page);
//         setOptions((prevOptions) => [...prevOptions, ...(result || [])]); // Ensure result is iterable
//       } catch (error) {
//         console.error("Error fetching options:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadOptions();
//   }, [fetchOptions, page]);

//   // Handle input changes for search
//   const handleInputChange = async (searchTerm: string) => {
//     setIsLoading(true);
//     try {
//       const searchOptions = await fetchOptions(searchTerm, 1); // Search always fetches the first page
//       setOptions(searchOptions);
//     } catch (error) {
//       console.error("Error fetching options for search:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle menu scroll to fetch the next page
//   const handleMenuScroll = (event: React.SyntheticEvent) => {
//     const target = event.target as HTMLDivElement;
//     if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   return (
//     <Select
//       options={options}
//       onInputChange={handleInputChange}
//       onMenuScrollToBottom={(event) =>
//         handleMenuScroll(event as unknown as React.SyntheticEvent)
//       }
//       isLoading={isLoading}
//       isSearchable
//       placeholder="Select an option..."
//       getOptionLabel={(e) => e.label}
//       getOptionValue={(e) => e.value}
//     />
//   );
// };

// export default AsyncSelectDropdown;

// import React, { useState } from "react";
// import { AsyncPaginate } from "react-select-async-paginate";
// import type { LoadOptions } from "react-select-async-paginate";
// import type { GroupBase } from "react-select";

// interface OptionType {
//   value: string | number;
//   label: string;
// }

// interface Additional {
//   page: number;
// }

// interface PaginatedSelectProps {
//   apiEndpoint: string;
//   valueKey?: string; // The key to map for option values
//   labelKey?: string; // The key to map for option labels
//   onChange: (selected: OptionType | null) => void;
//   placeholder?: string;
//   limit?: number; // Number of items to fetch per request
//   additionalParams?: Record<string, string | number>; // Additional query parameters
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   apiEndpoint,
//   valueKey = "id",
//   labelKey = "name",
//   onChange,
//   placeholder = "Search...",
//   limit = 10,
//   additionalParams = {},
// }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const loadOptions: LoadOptions<
//     OptionType,
//     GroupBase<OptionType>,
//     Additional
//   > = async (search = "", loadedOptions = [], additional = { page: 1 }) => {
//     const page = additional.page;

//     try {
//       setIsLoading(true);

//       const url = new URL(apiEndpoint);
//       url.searchParams.append("search", search);
//       url.searchParams.append("page", page.toString());
//       url.searchParams.append("limit", limit.toString());
//       Object.entries(additionalParams).forEach(([key, value]) =>
//         url.searchParams.append(key, value.toString())
//       );

//       const response = await fetch(url.toString());
//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.statusText}`);
//       }

//       const data = await response.json();

//       const options: OptionType[] = data.results.map((item: any) => ({
//         value: item[valueKey],
//         label: item[labelKey],
//       }));

//       return {
//         options,
//         hasMore: !!data.next, // Check if there's a `next` link for pagination
//         additional: { page: page + 1 },
//       };
//     } catch (error) {
//       console.error("Error in loadOptions:", error);
//       return { options: [], hasMore: false };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AsyncPaginate<OptionType, GroupBase<OptionType>, Additional>
//       loadOptions={loadOptions}
//       onChange={onChange}
//       placeholder={placeholder}
//       isLoading={isLoading}
//       additional={{ page: 1 }}
//     />
//   );
// };

// export default PaginatedSelect;

// import React, { useState } from "react";
// import { AsyncPaginate } from "react-select-async-paginate";
// import type { LoadOptions } from "react-select-async-paginate";
// import type { GroupBase } from "react-select";

// interface OptionType {
//   value: string | number;
//   label: string;
// }

// interface Additional {
//   page: number;
// }

// interface PaginatedSelectProps {
//   apiEndpoint: string;
//   valueKey?: string;
//   labelKey?: string;
//   onChange: (selected: OptionType | null) => void;
//   placeholder?: string;
//   limit?: number;
//   additionalParams?: Record<string, string | number>;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   apiEndpoint,
//   valueKey = "id",
//   labelKey = "name",
//   onChange,
//   placeholder = "Search...",
//   limit = 10,
//   additionalParams = {},
// }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const loadOptions: LoadOptions<
//     OptionType,
//     GroupBase<OptionType>,
//     Additional
//   > = async (search, loadedOptions, additional) => {
//     const page = additional?.page || 1;

//     try {
//       setIsLoading(true);

//       const url = new URL(apiEndpoint);
//       url.searchParams.append("search", search || "");
//       url.searchParams.append("page", page.toString());
//       url.searchParams.append("limit", limit.toString());
//       Object.entries(additionalParams).forEach(([key, value]) =>
//         url.searchParams.append(key, value.toString())
//       );

//       const response = await fetch(url.toString());
//       const data = await response.json();

//       const options: OptionType[] = data.results.map((item: any) => ({
//         value: item[valueKey],
//         label: item[labelKey],
//       }));

//       return {
//         options,
//         hasMore: data.next !== null,
//         additional: {
//           page: page + 1,
//         },
//       };
//     } catch (error) {
//       console.error("Error fetching options:", error);
//       return { options: [], hasMore: false };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AsyncPaginate<OptionType, GroupBase<OptionType>, Additional>
//       placeholder={placeholder}
//       loadOptions={loadOptions}
//       onChange={onChange}
//       isLoading={isLoading}
//       additional={{
//         page: 1,
//       }}
//     />
//   );
// };

// export default PaginatedSelect;
