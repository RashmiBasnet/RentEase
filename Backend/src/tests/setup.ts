// Runs before each test file. Provide deterministic, safe defaults so importing the
// app (which reads env at load time) never depends on a developer's real .env.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rentease_test";
