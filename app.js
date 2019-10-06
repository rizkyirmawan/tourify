const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// Define Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Use Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Up and running on port ${port}...`));
