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

export const getFullDateTimeHy = (date: Date) => {
  const day = date.getDate();
  const month = armenianMonths[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day} ${month}, ${year} ${hours}:${minutes}`;
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "refunded":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
