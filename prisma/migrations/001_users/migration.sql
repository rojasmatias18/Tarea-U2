CREATE TYPE "Role" AS ENUM ('USER','ADMIN');
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  role "Role" NOT NULL DEFAULT 'USER'
);
CREATE UNIQUE INDEX "User_email_key" ON "User"(email);
