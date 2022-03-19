import * as dayjs from 'dayjs';
export function convertTime(time: Date) {
  const convertTimeZone = time.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
  });
  return dayjs(convertTimeZone).format('DD MMMM YYYY, HH:mm');
}
