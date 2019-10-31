const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Uncaught Exception Error Handler
process.on('uncaughtException', err => {
	console.log(`Uncaught Exception: ${err.name} - ${err.message}`);
	process.exit(1);
});

dotenv.config({ path: './.env' });

const app = require('./app');

let db;

if (process.env.NODE_ENV === 'development') {
	db = process.env.DATABASE_LOCAL;
} else {
	db = process.env.DATABASE.replace(
		'<password>',
		process.env.DATABASE_PASSWORD
	);
}

mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB connected!'));

const port = process.env.PORT;
const server = app.listen(port, () =>
	console.log(`Up and running on port ${port}...`)
);

// Unhandled Rejections Error Handler
process.on('unhandledRejection', err => {
	console.log(`Unhandled Rejection: ${err.name} - ${err.message}`);
	server.close(() => {
		process.exit(1);
	});
});
