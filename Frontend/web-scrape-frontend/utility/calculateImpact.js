export const calculateImpactLevel = (percentage) => {
  percentage = parseFloat(percentage);
  if (percentage <= -200.0 || percentage >= 200.0) {
    return "Very_High";
  } else if (percentage <= -100.0 || percentage >= 100.0) {
    return "High";
  } else if (percentage <= -50.0 || percentage >= 50.0) {
    return "Medium";
  } else if (percentage <= -15.5 || percentage >= 15.5) {
    return "Low";
  } else {
    return "None";
  }
};
