const ReadRateWPM = 200;

export function calculateReadingTime(text) {
  return Math.ceil(text.split(" ").length / ReadRateWPM);
}
