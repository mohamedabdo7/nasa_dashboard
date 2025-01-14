export const truncateString = (
  str: string | null | undefined,
  isRtl?: boolean,
  maxLength: number = 20 // Default value set directly
): string => {
  if (!str) {
    return ""; // Handle null or undefined string
  }
  if (str.length > maxLength) {
    return isRtl
      ? `...${str.substring(0, maxLength)}`
      : `${str.substring(0, maxLength)}...`;
  }
  return str;
};
