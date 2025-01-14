export const generateRandomPassword = () => {
  const length = 10; // Length of the password
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "#@&$";

  const allChars = lowercase + uppercase + numbers + specialChars;
  let retVal = "";

  // Ensure one character from each required group
  retVal += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  retVal += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  retVal += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );
  retVal += numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Fill the rest of the length with random characters from all groups
  for (let i = retVal.length; i < length; ++i) {
    retVal += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the generated password to mix the guaranteed characters
  retVal = retVal
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return retVal;
};
