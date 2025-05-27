import holidayList from "../constants/holiday-list";
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function isHoliday(date, holidays) {
  const dateString = formatDate(date);
  return holidays.includes(dateString);
}

export function formatDate(date) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const [month, day, year] = formattedDate.split(" ");
  return `${day.replace(/,/g, "")}-${month}-${year}`;
}

export const formatDateForInput = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isValidFileType = (file) => {
  const allowedExtensions = ['csv', 'xls', 'xlsx'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  return allowedExtensions.includes(fileExtension);
};


export const fetchFromAndToDates = (date) => {
  const today = new Date();
  const todayDate = today.toISOString();

  const getStartOfWeek = (d) => {
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const start = new Date(d.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getEndOfWeek = (startOfWeek) => {
    const end = new Date(startOfWeek);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  // Dates
  const startOfThisWeek = getStartOfWeek(new Date());
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
  const endOfLastWeek = getEndOfWeek(startOfLastWeek);

  // This Month Data
  const lastThirtyDays = new Date(today);
  lastThirtyDays.setDate(lastThirtyDays.getDate() - 30);
  const thisMonth = lastThirtyDays.toISOString();

  let from_date, to_date;

  if (date?.value === "today") {
    from_date = todayDate;
    to_date = todayDate;
  } else if (date?.value === "this-week") {
    from_date = startOfThisWeek.toISOString();
    to_date = todayDate;
  } else if (date?.value === "last-week") {
    from_date = startOfLastWeek.toISOString();
    to_date = endOfLastWeek.toISOString();
  } else if (date?.value === "this-month") {
    from_date = thisMonth;
    to_date = todayDate;
  } else if (date === "") {
    from_date = "";
    to_date = "";
  }

  return {
    from_date,
    to_date,
  };
};

export const formatDateString = (date) => {
  return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
  }).replace(/ /g, '-');
};

function generateDatesArray(startDate, endDate) {
  const datesArray = [];

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate, holidayList)) {
      datesArray.push(formatDate(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return datesArray;
}

export default generateDatesArray;


