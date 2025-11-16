const armenianMonths = [
  "հունվար",
  "փետրվար",
  "մարտ",
  "ապրիլ",
  "մայիս",
  "հունիս",
  "հուլիս",
  "օգոստոս",
  "սեպտեմբեր",
  "հոկտեմբեր",
  "նոյեմբեր",
  "դեկտեմբեր",
];

export const getFullDateHy = (date: Date) => {
  const day = date.getDate();
  const month = armenianMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
