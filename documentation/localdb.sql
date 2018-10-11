CREATE TABLE message (
  UUID int,
  isBroadcast boolean,
  nickname string,
  timestamp datetime,
  message string
);

CREATE TABLE users (
  UUID int,
  nickname string,
  custom_nickname string,
  is_blocked boolean,
  is_muted boolean
);
