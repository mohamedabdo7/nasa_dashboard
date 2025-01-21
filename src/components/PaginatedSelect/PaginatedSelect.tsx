import React, { useState, useEffect, useCallback } from "react";
import Select, {
  SingleValue,
  MultiValue,
  InputActionMeta,
  ActionMeta,
} from "react-select";
import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing
import { i18n } from "../../utils";

interface Option {
  value: string | number;
  label: string;
}

interface PaginatedSelectProps {
  options: Option[];
  labelName?: string;
  required?: boolean;
  disabled?: boolean;
  loadMoreOptions: (page: number, search?: string) => Promise<Option[]>;
  placeholder?: string;
  isClearable?: boolean;
  isMulti?: boolean;
  onChange?: (
    newValue: SingleValue<Option> | MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
}

const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
  options,
  labelName,
  required,
  disabled,
  loadMoreOptions,
  placeholder = "Select an option",
  isClearable = true,
  isMulti = false,
  onChange,
}) => {
  const defaultStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: "auto",
      minHeight: "50px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "var(--primary)" : null,
      boxShadow: "unset",
      "&:hover": {
        borderColor: "unset",
      },
      background: "transparent",
    }),
    menu: (base: any) => ({
      ...base,
      maxHeight: "160px",
      zIndex: "999",
      padding: "4px",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
      padding: "3px",
      scrollBehavior: "smooth",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
        ? "#f8f9fa"
        : base.backgroundColor,
      color: state.isFocused ? "#000" : base.color,
      "&:hover": {
        backgroundColor: "var(--primary)",
        color: "#fff",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const [allOptions, setAllOptions] = useState<Option[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Merge existing options with incoming options, avoiding duplicates
    setAllOptions((prevOptions) => {
      const existingValues = new Set(prevOptions.map((o) => o.value));
      return [
        ...prevOptions,
        ...options.filter((o) => !existingValues.has(o.value)),
      ];
    });
  }, [options]);

  const fetchOptions = async (page: number, search?: string) => {
    setIsLoading(true);
    try {
      const newOptions = await loadMoreOptions(page, search);
      setAllOptions((prevOptions) => {
        const existingValues = new Set(prevOptions.map((o) => o.value));
        return [
          ...prevOptions,
          ...newOptions.filter((o) => !existingValues.has(o.value)),
        ];
      });
      setHasMore(newOptions.length > 0); // Check if more options are available
    } catch (error) {
      console.error("Failed to fetch options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedInputChange = useCallback(
    debounce((inputValue: string) => {
      setSearchTerm(inputValue);
      setPage(1);
      fetchOptions(1, inputValue);
    }, 300),
    []
  );

  const handleInputChange = (
    inputValue: string,
    actionMeta: InputActionMeta
  ) => {
    if (actionMeta.action === "input-change") {
      debouncedInputChange(inputValue);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      fetchOptions(nextPage, searchTerm);
      setPage(nextPage);
    }
  };

  return (
    <div
      className={`position-relative single-select-container`}
      style={{ margin: "0.2rem" }}
    >
      {labelName && (
        <label
          style={{
            position: "absolute",
            top: "-12px",
            left: i18n.language === "en" ? "10px" : "",
            right: i18n.language === "ar" ? "10px" : "",
            backgroundColor: "var(--white)",
            zIndex: "1",
            color: "var(--gray)",
          }}
        >
          <span className="mx-2">{labelName}</span>
          {required && <span className="mt-1">*</span>}
        </label>
      )}
      <Select
        options={allOptions}
        isClearable={isClearable}
        isMulti={isMulti}
        placeholder={placeholder}
        onInputChange={handleInputChange}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        onChange={onChange}
        menuPortalTarget={document.body}
        styles={defaultStyles}
        isDisabled={disabled}
      />
    </div>
  );
};

export default PaginatedSelect;

// import React, { useState, useEffect, useCallback } from "react";
// import Select, {
//   SingleValue,
//   MultiValue,
//   InputActionMeta,
//   ActionMeta,
// } from "react-select";
// import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing
// import { i18n } from "../../utils";

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface PaginatedSelectProps {
//   options: Option[];
//   labelName?: string;
//   required?: boolean;
//   loadMoreOptions: (page: number, search?: string) => Promise<Option[]>;
//   placeholder?: string;
//   isClearable?: boolean;
//   isMulti?: boolean;
//   onChange?: (
//     newValue: SingleValue<Option> | MultiValue<Option>,
//     actionMeta: ActionMeta<Option>
//   ) => void;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   options,
//   labelName,
//   required,
//   loadMoreOptions,
//   placeholder = "Select an option",
//   isClearable = true,
//   isMulti = false,
//   onChange,
// }) => {
//   const defaultStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       height: "50px",
//       minHeight: "50px",
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "var(--primary)" : null,
//       boxShadow: "unset",
//       "&:hover": {
//         borderColor: "unset",
//       },
//       background: "transparent",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       maxHeight: "160px",
//       zIndex: "999",
//       padding: "4px",
//     }),
//     menuList: (base: any) => ({
//       ...base,
//       maxHeight: "150px",
//       overflowY: "auto",
//       padding: "3px",
//       scrollBehavior: "smooth",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "var(--primary)"
//         : state.isFocused
//         ? "#f8f9fa"
//         : base.backgroundColor,
//       color: state.isFocused ? "#000" : base.color,
//       "&:hover": {
//         backgroundColor: "var(--primary)",
//         color: "#fff",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//   };

//   const [allOptions, setAllOptions] = useState<Option[]>(options);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     setAllOptions(options);
//   }, [options]);

//   const fetchOptions = async (page: number, search?: string) => {
//     setIsLoading(true);
//     try {
//       const newOptions = await loadMoreOptions(page, search);
//       setAllOptions((prevOptions) =>
//         page === 1 ? newOptions : [...prevOptions, ...newOptions]
//       );
//       setHasMore(newOptions.length > 0); // Check if more options are available
//     } catch (error) {
//       console.error("Failed to fetch options:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const debouncedInputChange = useCallback(
//     debounce((inputValue: string) => {
//       setSearchTerm(inputValue);
//       setPage(1);
//       fetchOptions(1, inputValue);
//     }, 300),
//     []
//   );

//   const handleInputChange = (
//     inputValue: string,
//     actionMeta: InputActionMeta
//   ) => {
//     if (actionMeta.action === "input-change") {
//       debouncedInputChange(inputValue);
//     }
//   };

//   const handleMenuScrollToBottom = () => {
//     if (!isLoading && hasMore) {
//       const nextPage = page + 1;
//       fetchOptions(nextPage, searchTerm);
//       setPage(nextPage);
//     }
//   };

//   // Add a loader at the end of the options
//   const customOptions =
//     hasMore || isLoading
//       ? [
//           ...allOptions,
//           { value: "loading", label: isLoading ? "Loading..." : "Load more" },
//         ]
//       : allOptions;

//   return (
//     <div
//       className={`position-relative single-select-container`}
//       style={{ margin: "0.2rem" }}
//     >
//       {labelName && (
//         <label
//           style={{
//             position: "absolute",
//             top: "-12px",
//             left: i18n.language === "en" ? "10px" : "",
//             right: i18n.language === "ar" ? "10px" : "",
//             backgroundColor: "var(--white)",
//             zIndex: "1",
//             color: "var(--gray)",
//             // color: error && isTouched ? "red" : "var(--gray)",
//             // ...labelStyle,
//           }}
//           // className={`rounded single-select-label ${
//           //   error && isTouched && "label-error"
//           // }`}
//         >
//           <span className="mx-2">{labelName}</span>
//           {required && <span className="mt-1">*</span>}
//         </label>
//       )}
//       <Select
//         options={customOptions}
//         isClearable={isClearable}
//         isMulti={isMulti}
//         placeholder={placeholder}
//         onInputChange={handleInputChange}
//         onMenuScrollToBottom={handleMenuScrollToBottom}
//         onChange={onChange}
//         menuPortalTarget={document.body}
//         styles={defaultStyles}
//       />
//     </div>
//   );
// };

// export default PaginatedSelect;

// import React, { useState, useEffect, useCallback } from "react";
// import Select, {
//   SingleValue,
//   MultiValue,
//   InputActionMeta,
//   ActionMeta,
// } from "react-select";
// import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface PaginatedSelectProps {
//   options: Option[];
//   loadMoreOptions: (page: number, search?: string) => Promise<Option[]>;
//   placeholder?: string;
//   isClearable?: boolean;
//   isMulti?: boolean;
//   onChange?: (
//     newValue: SingleValue<Option> | MultiValue<Option>,
//     actionMeta: ActionMeta<Option>
//   ) => void;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   options,
//   loadMoreOptions,
//   placeholder = "Select an option",
//   isClearable = true,
//   isMulti = false,
//   onChange,
// }) => {
//   const defaultStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       height: "50px",
//       minHeight: "50px",
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "var(--primary)" : null,
//       boxShadow: "unset",
//       "&:hover": {
//         borderColor: "unset",
//       },
//       background: "transparent",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       maxHeight: "160px",
//       zIndex: "999",
//       padding: "4px",
//     }),
//     menuList: (base: any) => ({
//       ...base,
//       maxHeight: "150px",
//       overflowY: "auto",
//       padding: "3px",
//       scrollBehavior: "smooth",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "var(--primary)"
//         : state.isFocused
//         ? "#f8f9fa"
//         : base.backgroundColor,
//       color: state.isFocused ? "#000" : base.color,
//       "&:hover": {
//         backgroundColor: "var(--dark-gray)",
//         color: "#fff",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//   };

//   const [allOptions, setAllOptions] = useState<Option[]>(options);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     setAllOptions(options);
//   }, [options]);

//   const fetchOptions = async (page: number, search?: string) => {
//     setIsLoading(true);
//     try {
//       const newOptions = await loadMoreOptions(page, search);
//       setAllOptions((prevOptions) =>
//         page === 1 ? newOptions : [...prevOptions, ...newOptions]
//       );
//       setHasMore(newOptions.length > 0); // Check if more options are available
//     } catch (error) {
//       console.error("Failed to fetch options:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const debouncedInputChange = useCallback(
//     debounce((inputValue: string) => {
//       setSearchTerm(inputValue);
//       setPage(1);
//       fetchOptions(1, inputValue);
//     }, 300),
//     []
//   );

//   const handleInputChange = (
//     inputValue: string,
//     actionMeta: InputActionMeta
//   ) => {
//     if (actionMeta.action === "input-change") {
//       debouncedInputChange(inputValue);
//     }
//   };

//   const handleMenuScrollToBottom = () => {
//     if (!isLoading && hasMore) {
//       const nextPage = page + 1;
//       fetchOptions(nextPage, searchTerm);
//       setPage(nextPage);
//     }
//   };

//   // Add a loader at the end of the options
//   const customOptions =
//     hasMore || isLoading
//       ? [
//           ...allOptions,
//           { value: "loading", label: isLoading ? "Loading..." : "Load more" },
//         ]
//       : allOptions;

//   return (
//     <Select
//       options={customOptions}
//       isClearable={isClearable}
//       isMulti={isMulti}
//       placeholder={placeholder}
//       onInputChange={handleInputChange}
//       onMenuScrollToBottom={handleMenuScrollToBottom}
//       onChange={onChange}
//       menuPortalTarget={document.body}
//       styles={defaultStyles}
//     />
//   );
// };

// export default PaginatedSelect;

// import React, { useState, useEffect, useCallback } from "react";
// import Select, {
//   SingleValue,
//   MultiValue,
//   InputActionMeta,
//   ActionMeta,
// } from "react-select";
// import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface PaginatedSelectProps {
//   options: Option[];
//   loadMoreOptions: (page: number, search?: string) => Promise<Option[]>;
//   placeholder?: string;
//   isClearable?: boolean;
//   isMulti?: boolean;
//   onChange?: (
//     newValue: SingleValue<Option> | MultiValue<Option>,
//     actionMeta: ActionMeta<Option>
//   ) => void;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   options,
//   loadMoreOptions,
//   placeholder = "Select an option",
//   isClearable = true,
//   isMulti = false,
//   onChange,
// }) => {
//   const defaultStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       height: "50px",
//       minHeight: "50px",
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "var(--primary)" : null,
//       boxShadow: "unset",
//       "&:hover": {
//         borderColor: "unset",
//       },
//       background: "transparent",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       maxHeight: "160px",
//       zIndex: "999",
//       padding: "4px",
//     }),
//     menuList: (base: any) => ({
//       ...base,
//       maxHeight: "150px",
//       overflowY: "auto",
//       padding: "3px",
//       scrollBehavior: "smooth", // Add smooth scrolling
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "var(--primary)"
//         : state.isFocused
//         ? "#f8f9fa"
//         : base.backgroundColor,
//       color: state.isFocused ? "#000" : base.color,
//       "&:hover": {
//         backgroundColor: "var(--dark-gray)",
//         color: "#fff",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//   };

//   const [allOptions, setAllOptions] = useState<Option[]>(options);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     setAllOptions(options);
//   }, [options]);

//   const fetchOptions = async (page: number, search?: string) => {
//     setIsLoading(true);
//     try {
//       const newOptions = await loadMoreOptions(page, search);
//       setAllOptions((prevOptions) =>
//         page === 1 ? newOptions : [...prevOptions, ...newOptions]
//       );
//     } catch (error) {
//       console.error("Failed to fetch options:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const debouncedInputChange = useCallback(
//     debounce((inputValue: string) => {
//       setSearchTerm(inputValue);
//       setPage(1);
//       fetchOptions(1, inputValue);
//     }, 300), // Adjust debounce delay as needed
//     []
//   );

//   const handleInputChange = (
//     inputValue: string,
//     actionMeta: InputActionMeta
//   ) => {
//     if (actionMeta.action === "input-change") {
//       debouncedInputChange(inputValue);
//     }
//   };

//   const handleMenuScrollToBottom = () => {
//     const nextPage = page + 1;
//     fetchOptions(nextPage, searchTerm);
//     setPage(nextPage);
//   };

//   return (
//     <Select
//       options={allOptions}
//       isClearable={isClearable}
//       isMulti={isMulti}
//       placeholder={placeholder}
//       onInputChange={handleInputChange} // Handles input changes
//       onMenuScrollToBottom={handleMenuScrollToBottom} // Handles infinite scrolling
//       onChange={onChange} // Triggered on value change
//       isLoading={isLoading}
//       menuPortalTarget={document.body}
//       styles={defaultStyles}
//     />
//   );
// };

// export default PaginatedSelect;

////////

// import React, { useState, useEffect, useCallback } from "react";
// import Select, { ActionMeta, SingleValue, MultiValue } from "react-select";
// import debounce from "lodash.debounce"; // Install lodash.debounce for debouncing

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface PaginatedSelectProps {
//   options: Option[];
//   loadMoreOptions: (page: number, search?: string) => Promise<Option[]>;
//   placeholder?: string;
//   isClearable?: boolean;
//   isMulti?: boolean;
//   onChange?: (
//     newValue: SingleValue<Option> | MultiValue<Option>,
//     actionMeta: ActionMeta<Option>
//   ) => void;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   options,
//   loadMoreOptions,
//   placeholder = "Select an option",
//   isClearable = true,
//   isMulti = false,
//   onChange,
// }) => {
//   const [allOptions, setAllOptions] = useState<Option[]>(options);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     setAllOptions(options);
//   }, [options]);

//   const fetchOptions = async (page: number, search?: string) => {
//     setIsLoading(true);
//     try {
//       const newOptions = await loadMoreOptions(page, search);
//       setAllOptions((prevOptions) =>
//         page === 1 ? newOptions : [...prevOptions, ...newOptions]
//       );
//     } catch (error) {
//       console.error("Failed to fetch options:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const debouncedInputChange = useCallback(
//     debounce((inputValue: string) => {
//       setSearchTerm(inputValue);
//       setPage(1);
//       fetchOptions(1, inputValue);
//     }, 300), // Adjust debounce delay as needed
//     []
//   );

//   const handleInputChange = (
//     inputValue: string,
//     { action }: ActionMeta<any>
//   ) => {
//     if (action === "input-change") {
//       debouncedInputChange(inputValue);
//     }
//   };

//   const handleMenuScrollToBottom = () => {
//     const nextPage = page + 1;
//     fetchOptions(nextPage, searchTerm);
//     setPage(nextPage);
//   };

//   return (
//     <Select
//       options={allOptions}
//       isClearable={isClearable}
//       isMulti={isMulti}
//       placeholder={placeholder}
//       onInputChange={handleInputChange}
//       onMenuScrollToBottom={handleMenuScrollToBottom}
//       onChange={onChange}
//       isLoading={isLoading}
//       menuPortalTarget={document.body}
//       styles={{
//         control: (base) => ({ ...base, minHeight: "50px" }),
//       }}
//     />
//   );
// };

// export default PaginatedSelect;

// import React, { useState, useEffect } from "react";
// import Select from "react-select";

// interface Option {
//   value: string | number;
//   label: string;
// }

// interface PaginatedSelectProps {
//   options: Option[];
//   loadMoreOptions: (page: number) => Promise<Option[]>;
//   placeholder?: string;
//   isClearable?: boolean;
//   isMulti?: boolean;
// }

// const PaginatedSelect: React.FC<PaginatedSelectProps> = ({
//   options,
//   loadMoreOptions,
//   placeholder = "Select an option",
//   isClearable = true,
//   isMulti = false,
// }) => {
//   const defaultStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       height: "50px",
//       minHeight: "50px",
//       // border: hasError ? "1px solid red" : "1px solid #7D7D7D", // Apply red border if there's an error
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "var(--primary)" : null,
//       boxShadow: "unset",
//       "&:hover": {
//         borderColor: "unset",
//       },
//       background: "transparent",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       maxHeight: "160px",
//       zIndex: "999",
//       padding: "4px",
//     }),
//     menuList: (base: any) => ({
//       ...base,
//       maxHeight: "150px",
//       overflowY: "auto",
//       padding: "3px",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "var(--primary)"
//         : state.isFocused
//         ? "#f8f9fa"
//         : base.backgroundColor,

//       color: state.isFocused ? "#FFF" : base.color,
//       "&:hover": {
//         backgroundColor: "var(--primary)",
//         color: "#fff",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//     // ...customStyles,
//   };

//   const [allOptions, setAllOptions] = useState<Option[]>(options);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     setAllOptions(options);
//   }, [options]);

//   const handleMenuScrollToBottom = async () => {
//     setIsLoading(true);
//     const newPage = page + 1;
//     try {
//       const newOptions = await loadMoreOptions(newPage);
//       setAllOptions((prevOptions) => [...prevOptions, ...newOptions]);
//       setPage(newPage);
//     } catch (error) {
//       console.error("Failed to load more options:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Select
//       options={allOptions}
//       isClearable={isClearable}
//       isMulti={isMulti}
//       placeholder={placeholder}
//       onMenuScrollToBottom={handleMenuScrollToBottom}
//       isLoading={isLoading}
//       menuPortalTarget={document.body} // Optional: render menu to the body
//       styles={defaultStyles}
//       // styles={{
//       //   menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//       // }}
//     />
//   );
// };

// export default PaginatedSelect;

// import React, { useState, useEffect, useCallback } from "react";
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
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   const defaultStyles = {
//     control: (base: any, state: any) => ({
//       ...base,
//       height: "50px",
//       minHeight: "50px",
//       borderRadius: "8px",
//       borderColor: state.isFocused ? "var(--primary)" : null,
//       boxShadow: "unset",
//       "&:hover": {
//         borderColor: "unset",
//       },
//       background: "transparent",
//     }),
//     menu: (base: any) => ({
//       ...base,
//       maxHeight: "160px",
//       zIndex: "999",
//       padding: "4px",
//     }),
//     menuList: (base: any) => ({
//       ...base,
//       maxHeight: "150px",
//       overflowY: "auto",
//       padding: "3px",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "var(--primary)"
//         : state.isFocused
//         ? "#f8f9fa"
//         : base.backgroundColor,
//       color: state.isFocused ? "#000" : base.color,
//       "&:hover": {
//         backgroundColor: "var(--dark-gray)",
//         color: "#fff",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//   };

//   // Function to fetch options and manage state
//   const loadOptions = useCallback(
//     async (term: string, currentPage: number) => {
//       setIsLoading(true);
//       try {
//         const result = await fetchOptions(term, currentPage);
//         if (Array.isArray(result)) {
//           setOptions((prevOptions) =>
//             currentPage === 1 ? result : [...prevOptions, ...result]
//           );
//         } else {
//           console.error("fetchOptions did not return an array:", result);
//         }
//       } catch (error) {
//         console.error("Error fetching options:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [fetchOptions]
//   );

//   // Initial fetch or when page or searchTerm changes
//   useEffect(() => {
//     loadOptions(searchTerm, page);
//   }, [loadOptions, searchTerm, page]);

//   // Handle input changes for search
//   const handleInputChange = (inputValue: string) => {
//     setSearchTerm(inputValue); // Update search term
//     setPage(1); // Reset page to 1 for new search
//   };

//   // Handle menu scroll to fetch the next page
//   const handleMenuScroll = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   return (
//     <Select
//       options={options}
//       onInputChange={handleInputChange}
//       onMenuScrollToBottom={handleMenuScroll}
//       isLoading={isLoading}
//       isSearchable
//       placeholder="Select an option..."
//       getOptionLabel={(e) => e.label}
//       getOptionValue={(e) => e.value}
//       styles={defaultStyles}
//     />
//   );
// };

// export default AsyncSelectDropdown;

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
