-- CreateTable
CREATE TABLE "ApplicationLogger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "msg" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "level" TEXT,
    "context" TEXT,
    "req" TEXT,
    "res" TEXT,
    "extra" TEXT
);
