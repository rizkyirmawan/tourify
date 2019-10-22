const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const dbDev = process.env.DATABASE_LOCAL;
const dbProd = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(dbDev, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.log(`Error: ${err}`));

const port = process.env.PORT;
app.listen(port, () => console.log(`Up and running on port ${port}...`));
