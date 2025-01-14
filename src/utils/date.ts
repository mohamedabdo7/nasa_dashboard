function range(start: any, end: any, step = 1) {
  const array = [];
  for (let i = start; i < end; i += step) {
    array.push(i);
  }
  return array;
}
// Function to get the full year from a date
export const getYear = (date: any) => date.getFullYear();

// Function to get the month index (0-11) from a date
export const getMonth = (date: any) => date.getMonth();

// Generating years from 1990 to current year
export const years = range(1900, getYear(new Date()) + 20);

// Months array
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
