const getAgeGroup = (age) => {
  if (age >= 3 && age <= 12) return "3-12";
  if (age >= 13 && age <= 19) return "12-19";
  if (age >= 20 && age <= 45) return "20-45";
  if (age >= 46 && age <= 60) return "45-60";
  return null;
};

export default getAgeGroup;
