import { FC, SetStateAction } from "react";
import { Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TimeProps ={
    selectedDate:Date|null
    setSelectedDate:React.Dispatch<SetStateAction<Date|null>>
    slots:number[][]
    placeholderText:string
    setEnable:React.Dispatch<SetStateAction<boolean>>
    selectedTime:Date | null
    setSelectedTime:React.Dispatch<SetStateAction<Date | null>>
}
const TimeSlotPicker: FC<TimeProps> = ({
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    placeholderText,
    setEnable,
    slots
}) => {
  // const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const includeTimes = slots.map((slot:number[]) => {
    const date = new Date(); // Create a new Date object
    date.setHours(slot[0], slot[1], 0, 0); // Set hours and minutes
    return date; // Return the Date object
  });

    // Handle date selection
    const handleDateChange = (date: Date | null) => {
      if (date) {
        // If the date changes, reset the time selection
        setSelectedTime(null);
        // Set the selected date (time will not be applied until chosen)
        const selectedOnlyDate = new Date(date.setHours(0, 0, 0, 0));
        setSelectedDate(selectedOnlyDate);
      } else {
        setSelectedDate(null); // Handle clearing the date
      }
    };
  
    // Handle time selection
    const handleTimeChange = (time: Date | null) => {
      if (time && selectedDate) {
        // Combine the selected date and time
        const combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(time.getHours(), time.getMinutes());
        setSelectedDate(combinedDateTime);
        setEnable(false)
        setSelectedTime(time);
      }
    };

  return (
    // <DatePicker
    //   selected={selectedDate}
    //   onChange={handleDateChange}
    //   showTimeSelect
    //   timeIntervals={15}
    //   dateFormat="MMMM d, yyyy h:mm aa"
    //   includeTimes={includeTimes} // Pass the array of Date objects to includeTimes
    //   placeholderText={placeholderText}
    // />
    <Row>
      <Col lg={6} md={12}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText={placeholderText}
          dateFormat="MMMM d, yyyy"
        />
      </Col>
      <Col lg={6} md={12}>
        <DatePicker
          selected={selectedTime}
          onChange={handleTimeChange}
          disabled={!selectedDate}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          includeTimes={includeTimes}
          placeholderText="Select a time"
        />
      </Col>
    </Row>
  );
};

export default TimeSlotPicker;
