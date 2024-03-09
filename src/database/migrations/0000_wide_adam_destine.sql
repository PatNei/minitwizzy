CREATE TABLE `follower` (
	`whoId` integer NOT NULL,
	`whomId` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `latestAction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actionId` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`messageId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`authorId` integer NOT NULL,
	`text` text NOT NULL,
	`pubDate` integer,
	`flagged` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`userId` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
