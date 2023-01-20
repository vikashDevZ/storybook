import moment from 'moment';

const DEFAULT_FORMAT = 'DD/MM/YYYY hh:mm A';
/**
 * Get date from now using momentjs
 * @param date
 * @returns {*}
 */
export function getDateFromNow(date) {
  if (date) {
    return moment(date).toNow(true) + ' ago';
  } else {
    return null;
  }
}

/**
 * Get days remaining from current date
 * @returns {*}
 */
export function daysRemaining(date, flag = false) {
  var eventdate = moment(date);
  var todaysdate = moment();
  let diff = eventdate.diff(todaysdate, 'days');
  if (flag) {
    return diff;
  }
  return diff >= 0 ? diff : 0;
}
export function formatDate(date, format) {
  format = format || DEFAULT_FORMAT;
  const dateObj = moment(date);
  return dateObj.isValid() ? dateObj.format(format) : '';
}
