hour = current_time_hour()
minutes = current_time_minute()

indicator = "am"

if hour >= 12:
    indicator = "pm"

if hour == 0:
    hour = 12
elif hour > 12:
    hour = hour - 12

display_time(hour, minutes, indicator)