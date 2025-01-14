import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, months, years } from "../../utils/date";
import { useTranslation } from "react-i18next";
import "./datepicker.scss";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange?: (date: Date | null) => void;
  placeholderText?: string;
  labelText?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
  maxTime?: Date;
  formik?: any;
  name: string;
  filterTime?: any;
  required: boolean;
  disabled?: boolean;
}

const CustomDateTimePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  placeholderText,
  labelText,
  // dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  formik,
  name,
  minTime,
  maxTime,
  filterTime,
  required = false,
  disabled,
}) => {
  const { i18n } = useTranslation();

  const calculateCurrentTimeIfToday = (
    selectedDate: Date | null
  ): Date | undefined => {
    if (!selectedDate) return undefined;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return today.getTime() === selectedDate.getTime() ? now : undefined;
  };

  const currentTimeOrUndefined = calculateCurrentTimeIfToday(
    formik.values[name]
  );

  return (
    <div className={`resident-date  position-relative align-self-start mt-1`}>
      <div>
        <label
          htmlFor=""
          style={{
            position: "absolute",
            color: `${
              formik?.touched[name] && formik?.errors[name]
                ? "red"
                : "var(--gray)"
            }`,

            backgroundColor: "var(--white-floating)",
            top: i18n.language === "en" ? "-11px" : "-12px",
            left: `${i18n.language == "en" ? "25px" : "unset"}`,
            right: `${i18n.language == "en" ? "unset" : "25px"}`,
            zIndex: "1",
          }}
        >
          {`${labelText} ${required ? "   *" : ""}`}
        </label>
      </div>
      <DatePicker
        selected={formik.values[name]}
        onChange={
          onChange
            ? onChange
            : (date: Date) => {
                formik.setFieldValue(name, date);
              }
        }
        disabled={disabled}
        placeholderText={placeholderText}
        className={`${
          formik?.touched[name] && formik?.errors[name] ? "formerror" : ""
        }`}
        showTimeSelect
        minDate={minDate}
        maxDate={maxDate || null}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeIntervals={1}
        filterTime={filterTime}
        minTime={currentTimeOrUndefined || minTime}
        maxTime={maxTime}
        timeCaption="time"
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div
            style={{
              margin: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
            >
              {"<"}
            </button>
            <select
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(Number(value))}
            >
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) =>
                changeMonth(months.indexOf(value))
              }
            >
              {months.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              onClick={(e) => {
                e.preventDefault();
                increaseMonth();
              }}
              disabled={nextMonthButtonDisabled}
            >
              {">"}
            </button>
          </div>
        )}
      />

      {formik?.touched[name] && formik?.errors[name] && (
        <div className="error">
          {formik?.touched[name] && formik?.errors[name] ? (
            <span className="error" style={{ color: "red" }}>
              {formik?.errors[name]}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
