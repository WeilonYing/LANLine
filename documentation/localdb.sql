-- Local sqlite db for storing information about other users
CREATE TABLE users (
  id CHAR(36), -- uuid4 is 36 characters long
  nickname VARCHAR(100), -- other user's preferred nickname, max length up for discussion
  custom_nickname VARCHAR(100), -- this user's custom nickname for the other user
  is_blocked BOOLEAN,
  is_muted BOOLEAN
);

CREATE TABLE message (
  FOREIGN KEY (sender) REFERENCES users(id),
  message TEXT,
  isBroadcast BOOLEAN
)
