let hour = currentTimeHour();
let minutes = currentTimeMinute();

let indicator = "am";

if (hour >= 12) {
  indicator = "pm";
}

if (hour === 0) {
  hour = 12;
} else if (hour > 12) {
  hour = hour - 12;
}

displayTime(hour, minutes, indicator);