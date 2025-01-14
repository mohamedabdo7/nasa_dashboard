import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsClock } from "react-icons/bs";
import { i18n } from "../../utils";
import "./datepicker.scss";
import CustomInput from "./CustomInput";

interface CustomTimePickerProps {
  selectedTime: Date | null;
  onChange: (time: Date | null) => void;
  placeholderText?: string;
  labelText?: string;
  disabled?: boolean;
  minTime?: Date;
  maxTime?: Date;
  timeIntervals?: number;
  readonly?: boolean;
  customInputComponent?: boolean;
  required?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  selectedTime,
  onChange,
  placeholderText,
  labelText,
  disabled,
  minTime,
  maxTime,
  timeIntervals,
  readonly = false,
  customInputComponent,
  required = false,
}) => {
  return (
    <div
      className="resident-time position-relative align-self-start mt-1"
      // style={{ width: "100%", zIndex: "1" }}
    >
      <div>
        <label
          htmlFor=""
          style={
            i18n.language === "en"
              ? {
                  position: "absolute",
                  color: "var(--gray)",
                  backgroundColor: "var(--white-floating)",
                  top: "-11px",
                  left: "15px",
                  zIndex: "1",
                  padding: "0 5px",
                }
              : {
                  position: "absolute",
                  color: "var(--gray)",
                  backgroundColor: "var(--white-floating)",
                  top: "-12px",
                  right: "15px",
                  zIndex: "1",
                  padding: "0 5px",
                }
          }
        >
          {`${labelText}${required ? " *" : ""}`}
        </label>
      </div>
      <DatePicker
        disabled={disabled}
        selected={selectedTime}
        onChange={onChange}
        placeholderText={placeholderText}
        className="resident-time error"
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals || 15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        minTime={minTime}
        maxTime={maxTime}
        readOnly={readonly}
        customInput={
          customInputComponent && (
            <CustomInput readOnly placeholder={placeholderText} />
          )
        }
      />

      {i18n.language === "en" ? (
        <BsClock
          style={{
            position: "absolute",
            top: "12px",
            right: "10px",
            width: "30px",
            height: "30px",
            padding: "5px",
            backgroundColor: "var(--white-floating)",
            color: "grey",
          }}
        />
      ) : (
        <BsClock
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

export default CustomTimePicker;
