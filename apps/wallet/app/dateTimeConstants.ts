const Minute = 60;
const Hour = Minute * 60;
const Day = Hour * 24;

export const DateTimeConstants = {
  InSeconds: {
    Day,
    Hour,
    Minute,
  },
  InMillies: {
    Day: Day * 1000,
    Hour: Hour * 1000,
    Minute: Minute * 1000,
    Seconds: 1000,
  },
};
