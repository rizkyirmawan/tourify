const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

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
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.log(`Error: ${err}`));

const port = process.env.PORT;
app.listen(port, () => console.log(`Up and running on port ${port}...`));
