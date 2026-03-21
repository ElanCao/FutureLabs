const { defineConfig } = require("@prisma/config");
module.exports = defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:1DB4P0WT6tniQgZ@101.133.227.183:54321/postgres",
  },
  migrate: {
    url: process.env.DATABASE_URL || "postgresql://postgres:1DB4P0WT6tniQgZ@101.133.227.183:54321/postgres",
  },
});
