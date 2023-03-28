const dotenv = require("dotenv");
const express = require("express");
const moongose = require("mongoose");

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config();

moongose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected.");
  })
  .catch((e) => {
    console.error("Failed to connect to DB!", e);
  });

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server is running at port ${port}.`);
});
