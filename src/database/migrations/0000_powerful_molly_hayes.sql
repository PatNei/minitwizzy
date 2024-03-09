CREATE TABLE `follower` (
	`who_id` integer,
	`whom_id` integer
);
--> statement-breakpoint
CREATE TABLE `message` (
	`message_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`text` text NOT NULL,
	`pub_date` integer,
	`flagged` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`pw_hash` text NOT NULL
);
