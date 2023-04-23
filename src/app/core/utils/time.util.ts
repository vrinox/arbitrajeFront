export const sleep = ({ ms }: { ms: number }) => new Promise((resolve) => setTimeout(resolve, ms));
export const msToTime = (duration: number): string => {
  let seconds: number = Math.trunc((duration / 1000) % 60);
  let minutes: number = Math.trunc((duration / (1000 * 60)) % 60);
  let hours: number = Math.trunc((duration / (1000 * 60 * 60)) % 24);

  let hoursS = hours !== 0 ? `${hours} hours` : "";
  let minutesS = minutes  !== 0 ? `${minutes} min`: "";
  let secondsS = seconds  !== 0 ? `${seconds} segs`: "";

  return `${hoursS} ${minutesS} ${secondsS}`;
}
export const getCurrentDateTime = () => {
  const now = new Date();
  return formatDate(now);
}
export const formatDate= (date:Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}