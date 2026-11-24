CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE "Reservation" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "roomId" TEXT,
  "checkIn" DATE NOT NULL,
  "checkOut" DATE NOT NULL,
  CONSTRAINT fechas_validas CHECK ("checkOut" > "checkIn"),
  CONSTRAINT reservas_sin_cruce EXCLUDE USING gist
    ("roomId" WITH =, daterange("checkIn","checkOut",'[)') WITH &&)
);
CREATE INDEX "Reservation_roomId_idx" ON "Reservation"("roomId");
