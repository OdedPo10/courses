const express = require('express');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const courseRouter = require('./routes/course');

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on PORT ${PORT}`);
});
