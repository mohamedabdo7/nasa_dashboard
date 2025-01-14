import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, months, years } from "../../utils/date";
import "./datepicker.scss";
import { BsCalendarDate } from "react-icons/bs";
import { i18n } from "../../utils";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  labelText?: string;
  dateFormat?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabled?: boolean;
  required?: boolean;
  formik?: any;
  name?: string;
  labelStyle?: any;
  iconBackground?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onChange,
  placeholderText,
  labelText,
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  disabled,
  required = false,
  formik,
  labelStyle,
  iconBackground,
  name,
}) => {
  return (
    <div
      className="custom-date-picker resident-date position-relative align-self-start m-1"
      // style={{ width: "100%" }}
    >
      <div>
        <label
          htmlFor=""
          style={
            i18n.language === "en"
              ? {
                  position: "absolute",
                  color: `${
                    formik?.touched[name!] && formik?.errors[name!]
                      ? "red"
                      : "var(--gray)"
                  }`,
                  backgroundColor: "var(--white-floating)",
                  top: "-11px",
                  left: "25px",
                  zIndex: "1",
                  ...labelStyle,
                }
              : {
                  position: "absolute",
                  color: `${
                    formik?.touched[name!] && formik?.errors[name!]
                      ? "red"
                      : "var(--gray)"
                  }`,
                  backgroundColor: "var(--white-floating)",
                  top: "-12px",
                  right: "25px",
                  zIndex: "1",
                  ...labelStyle,
                }
          }
        >
          {labelText} {required && "*"}
        </label>
      </div>
      <DatePicker
        name={name}
        required={required}
        disabled={disabled}
        selected={selectedDate}
        onChange={onChange}
        placeholderText={placeholderText}
        // className="resident-date error"
        className={`${
          formik?.touched[name!] && formik?.errors[name!] ? "formerror" : ""
        }`}
        dateFormat={dateFormat}
        minDate={minDate || undefined}
        maxDate={maxDate || undefined}
        showTimeSelect={false}
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
              zIndex: 999,
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

      {formik?.touched[name!] && formik?.errors[name!] && (
        <div className="error">
          {formik?.touched[name!] && formik?.errors[name!] ? (
            <span className="error" style={{ color: "red" }}>
              {formik?.errors[name!]}
            </span>
          ) : null}
        </div>
      )}

      {i18n.language === "en" ? (
        <BsCalendarDate
          style={{
            position: "absolute",
            top: "12px",
            right: "10px",
            width: "30px",
            height: "30px",
            padding: "5px",
            backgroundColor: iconBackground
              ? "transparent"
              : "var(--white-floating)",
            color: "grey",
          }}
        />
      ) : (
        <BsCalendarDate
          style={{
            position: "absolute",
            top: "12px",
            left: "10px",
            width: "30px",
            height: "30px",
            padding: "5px",
            backgroundColor: "var(--white-floating)",
            color: "grey",
          }}
        />
      )}
    </div>
  );
};

export default CustomDatePicker;
