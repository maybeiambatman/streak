// Date helper utilities for FitStreak
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isSameDay,
  isSameWeek,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  addDays,
  subDays,
  parseISO,
  isValid,
} from 'date-fns';

// Format date for display
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return format(parsed, formatStr);
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return formatDistanceToNow(parsed, { addSuffix: true });
};

// Get friendly date label (Today, Yesterday, or date)
export const getFriendlyDate = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';

  if (isToday(parsed)) return 'Today';
  if (isYesterday(parsed)) return 'Yesterday';
  return format(parsed, 'EEEE, MMM d');
};

// Check if two dates are the same day
export const areSameDay = (date1, date2) => {
  const parsed1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const parsed2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(parsed1, parsed2);
};

// Check if date is within current week
export const isThisWeek = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isSameWeek(parsed, new Date(), { weekStartsOn: 1 }); // Monday start
};

// Get week bounds
export const getWeekBounds = (date = new Date()) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfWeek(parsed, { weekStartsOn: 1 }),
    end: endOfWeek(parsed, { weekStartsOn: 1 }),
  };
};

// Get month bounds
export const getMonthBounds = (date = new Date()) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfMonth(parsed),
    end: endOfMonth(parsed),
  };
};

// Get days between two dates
export const getDaysBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start);
};

// Get hours between two dates
export const getHoursBetween = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInHours(end, start);
};

// Format time until (e.g., "6h 30m")
export const formatTimeUntil = (targetDate) => {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
  const now = new Date();

  const hours = differenceInHours(target, now);
  const minutes = differenceInMinutes(target, now) % 60;

  if (hours <= 0 && minutes <= 0) return 'Ready';
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

// Get hours since date
export const getHoursSince = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return differenceInHours(new Date(), parsed);
};

// Get date X days ago
export const getDaysAgo = (days) => {
  return subDays(new Date(), days);
};

// Get date X days from now
export const getDaysFromNow = (days) => {
  return addDays(new Date(), days);
};

// Get all dates in range (for calendar display)
export const getDatesInRange = (startDate, endDate) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const dates = [];
  let current = start;

  while (current <= end) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }

  return dates;
};

// Format duration (e.g., "35 min")
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// Format time of day (e.g., "6:30 PM")
export const formatTime = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return format(parsed, 'h:mm a');
};

// Get date key for storage (YYYY-MM-DD)
export const getDateKey = (date = new Date()) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'yyyy-MM-dd');
};

// Parse date key back to date
export const parseDateKey = (dateKey) => {
  return parseISO(dateKey);
};

// Check if date is in the past
export const isPast = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return parsed < new Date();
};

// Check if date is today or before
export const isTodayOrBefore = (date) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isToday(parsed) || isPast(parsed);
};

// Get week number of the year
export const getWeekNumber = (date = new Date()) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'w');
};

// Get month name
export const getMonthName = (date = new Date(), short = false) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, short ? 'MMM' : 'MMMM');
};

// Get day of week name
export const getDayName = (date, short = false) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, short ? 'EEE' : 'EEEE');
};

export default {
  formatDate,
  getRelativeTime,
  getFriendlyDate,
  areSameDay,
  isThisWeek,
  getWeekBounds,
  getMonthBounds,
  getDaysBetween,
  getHoursBetween,
  formatTimeUntil,
  getHoursSince,
  getDaysAgo,
  getDaysFromNow,
  getDatesInRange,
  formatDuration,
  formatTime,
  getDateKey,
  parseDateKey,
  isPast,
  isTodayOrBefore,
  getWeekNumber,
  getMonthName,
  getDayName,
};
