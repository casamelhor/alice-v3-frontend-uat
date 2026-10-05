export const dateFormatYearMonthDay = (arg) => {
  const date = new Date(arg);
  const formattedDate = date.toLocaleDateString('en-CA');
  return formattedDate;

}

export const formatTime12Hour = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';


  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
};

export const convertTo12Hour = (time24) => {
  if (!time24) return '';

  const [hours, minutes, seconds] = time24?.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minutes} ${ampm}`;
};


export const convertToTimestamp = (timeString) => {
  const [hours, minutes] = timeString?.split(':')?.map(Number);

  const now = new Date();
  const customDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  return customDate.toString();
};

export const convertDateYYYYMMDD = (dateString) => {
  const date = new Date(dateString);

  // Get year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// export const calculateNights = (checkIn, checkOut) => {
//   const checkInDate = new Date(checkIn);
//   const checkOutDate = new Date(checkOut);

//   const timeDifference = checkOutDate - checkInDate;
//   const nights = timeDifference / (1000 * 60 * 60 * 24);

//   return nights;
// };
export const calculateNights = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Normalize both dates to midnight before diffing. check_in_datetime and
  // check_out_datetime carry actual times (e.g. check-in 3 PM, check-out
  // 11 AM). Diffing the raw timestamps produces a fractional day (e.g.
  // 3.83), which callers were flooring/truncating to 3.
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);

  const timeDifference = checkOutDate - checkInDate;

  const nights = Math.round(timeDifference / (1000 * 60 * 60 * 24));

  return nights;
};

export const formatDateMonthYear = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// export const generateTimeOptions = (interval = 30) => {
//   const times = [];

//   for (let minutes = 30; minutes < 24 * 60; minutes += interval) {
//     const hrs = String(Math.floor(minutes / 60)).padStart(2, '0');
//     const mins = String(minutes % 60).padStart(2, '0');

//     const time = `${hrs}:${mins}`;

//     times.push({
//       label: time,
//       value: time
//     });
//   }

//   return times;
// };


// export const generateTimeOptions = (interval = 30) => {
//   const times = [];

//   for (let minutes = 30; minutes < 24 * 60; minutes += interval) {
//     let hrs = Math.floor(minutes / 60);
//     const mins = minutes % 60;

//     const period = hrs >= 12 ? 'PM' : 'AM';
//     hrs = hrs % 12 || 12;

//     const formattedTime = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;

//     times.push({
//       label: formattedTime,
//       value: formattedTime
//     });
//   }

//   return times;
// };
export const generateTimeOptions = (interval = 30) => {
  const times = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const formattedTime = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    times.push({
      label: formattedTime,
      value: formattedTime
    });
  }

  return times;
};

export const generateTimeOptions12Format = (interval = 30) => {
  const times = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
    const hrs24 = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const period = hrs24 >= 12 ? "PM" : "AM";
    const hrs12 = hrs24 % 12 === 0 ? 12 : hrs24 % 12;

    const formattedTime = `${String(hrs12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${period}`;

    times.push({
      label: formattedTime,
      value: formattedTime
    });
  }

  return times;
};

export const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};


export const formatYMD = (inputDate) => {
  const d = new Date(inputDate);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatStayDates = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);

  const options = { weekday: "short", day: "numeric", month: "short" };

  const startFormatted = start.toLocaleDateString("en-US", options);
  const endFormatted = end.toLocaleDateString("en-US", options);
  const year = end.getFullYear();

  const diffTime = end - start;
  const nights = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return `${startFormatted} - ${endFormatted}, ${year}, ${nights} night${nights > 1 ? "s" : ""}`;
};

export const formatRoomsAndGuests = (rooms = []) => {
  const roomCount = rooms.length;
  const guestCount = rooms.reduce(
    (sum, room) => sum + (room.adults || 0),
    0
  );

  return `${roomCount} room${roomCount > 1 ? "s" : ""} for ${guestCount} guest${guestCount > 1 ? "s" : ""}`;
};


export const formatDateRange = (checkIn, checkOut) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatSingleDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayName}, ${day} ${month}`;
  };

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const year = checkOutDate.getFullYear();

  return `${formatSingleDate(checkInDate)} - ${formatSingleDate(checkOutDate)}, ${year}`;
};

export const convertDatewithtime = (check_in_date) => {
  // const check_in_date = "2025-12-26 00:00:00+05:30";

  // Parse the date string
  const date = new Date(check_in_date);

  // Format the date to "Sat, 2 Aug, 2025, 2:00PM"
  const options = {
    weekday: 'short', // Short day name (Sat)
    day: 'numeric',   // Day of month (2)
    month: 'short',   // Short month name (Aug)
    year: 'numeric',  // Full year (2025)
    hour: 'numeric',  // Hour (2)
    minute: '2-digit', // Minute (00)
    hour12: true      // 12-hour format
  };

  // Create formatted string
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Further format to match exact required output
  const [weekday, month, day, year] = formattedDate.split(' ');
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();

  return `${weekday}, ${day} ${month}, ${year}, ${timeString}`;
};

export const getTimeinDatestring = (datestring) => {
  // Parse the date string
  const date = new Date(datestring);
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();

  return timeString
}

export const convertDatewith = (dateStr) => {
  const date = new Date(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${month}, ${year}`;
};
export const convertDatewithNotComma = (dateStr) => {
  const date = new Date(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const convertDayMonthcommaYear = (dateStr) => {
  const date = new Date(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};



export const calculateDaysDifference = (dateStr1, dateStr2) => {
  // Parse dates as UTC/local
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  // Calculate difference in milliseconds
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());

  // Convert to days
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
};

export function formatDaysDateMonthYear(dateString) {
  const date = new Date(dateString);

  // Get day name (short)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];

  // Get month name (short)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[date.getMonth()];

  // Get date
  const day = date.getDate();

  // Get year
  const year = date.getFullYear();

  return `${dayName}, ${day} ${monthName}, ${year}`;
}

export function getPreviousDate(dateStr) {
  const date = new Date(dateStr);
  const previousDate = new Date(date);
  previousDate.setDate(date.getDate() - 1);
  return previousDate;
}

export function getNextDate(dateStr) {
  const date = new Date(dateStr);
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  return nextDate;
}

export function checkDateEqualOrNot(dateStr) {

  // const targetDate = new Date(dateString);
  // const currentDate = new Date();

  // // Reset time to midnight for both dates for pure date comparison
  // targetDate.setHours(0, 0, 0, 0);
  // currentDate.setHours(0, 0, 0, 0);

  // return targetDate >= currentDate;

  const targetDate = new Date(dateStr);
  const currentDate = new Date();

  // Compare dates (removing time portion for date-only comparison)
  const isEqualOrGreater = targetDate <= currentDate;

  // If you want to compare only dates (ignoring time)
  const targetDateOnly = new Date(targetDate.toDateString());
  const currentDateOnly = new Date(currentDate.toDateString());
  const isEqualOrGreaterDateOnly = targetDateOnly <= currentDateOnly;

  console.log('With time:', isEqualOrGreater);
  console.log('Date only:', isEqualOrGreaterDateOnly);

  return isEqualOrGreater;
};

export const formatDatesForModal = (dateTo, dateFrom) => {
  const checkIn = new Date(dateTo);
  const checkOut = new Date(dateFrom);

  const startDay = checkIn.getDate(); // 7
  const endDay = checkOut.getDate(); // 10
  const month = checkIn.toLocaleString('en-US', { month: 'short' }); // Jan
  const year = checkIn.getFullYear(); // 2026

  return `${startDay}-${endDay} ${month}, ${year}`;
};

// export function formatDateRangeDashboard(startDateStr, endDateStr) {
//   const startDate = new Date(startDateStr);
//   const endDate = new Date(endDateStr);

//   // Format day without leading zero
//   const startDay = startDate.getDate();
//   const endDay = endDate.getDate();

//   // Get abbreviated month name
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const startMonth = months[startDate.getMonth()];
//   const endMonth = months[endDate.getMonth()];

//   // If same year, show year only at the end
//   if (startDate.getFullYear() === endDate.getFullYear()) {
//     return `${startDay} ${startMonth} – ${endDay} ${endMonth}, ${startDate.getFullYear()}`;
//   } else {
//     return `${startDay} ${startMonth}, ${startDate.getFullYear()} – ${endDay} ${endMonth}, ${endDate.getFullYear()}`;
//   }
// }
export function formatDateRangeDashboard(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Format day without leading zero
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  // Get abbreviated month name
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  // Same year and same month
  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay} – ${endDay} ${startMonth}, ${startYear}`;
  }

  // Same year, different months
  if (startYear === endYear) {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth}, ${startYear}`;
  }

  // Different years
  return `${startDay} ${startMonth}, ${startYear} – ${endDay} ${endMonth}, ${endYear}`;
}
export const extractDates = (dateString) => {
  const dates = dateString?.split(" - ");
  return {
    checkIn: new Date(dates?.[0]),
    checkOut: new Date(dates?.[1])
  };
};

export const getOneMonthBefore = (currentDateStr) => {
  const date = new Date(currentDateStr);
  date.setMonth(date.getMonth() - 1);

  return date.toISOString().split("T")[0];
};

export const formatToDayDate = (timeString) => {
  if (!timeString) return "";

  const date = new Date(timeString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const changeToNextDate = (dateStr) => {
  if (!dateStr) return null;


  const [year, month, day] = dateStr.split('-').map(Number);


  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);


  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');


  return `${yyyy}-${mm}-${dd}`;
};

export const isNotPastDate = (dateString) => {
  const selectedDate = new Date(dateString);

  // Set time to 00:00:00 for accurate comparison
  selectedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
};

export const formatLabel = (text = '') =>
  text
    .toLowerCase()
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const formatMonthYear = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

