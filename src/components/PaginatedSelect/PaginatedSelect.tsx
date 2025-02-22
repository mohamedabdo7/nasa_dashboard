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
  labelBackgroundColor?: string;
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
  labelBackgroundColor = "var(--white)",
  onChange,
}) => {
  const defaultStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: "auto",
      minHeight: "50px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "var(--primary)" : "var(--primary)",
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
    placeholder: (base: any) => ({
      ...base,
      textAlign: "left", // Align placeholder text to the start
      color: "var(--primary)", // Optional: Placeholder color
      margin: "0", // Remove any default margin
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
            // backgroundColor: "var(--white)",
            backgroundColor: labelBackgroundColor,
            zIndex: "1",
            color: "var(--primary)",
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
