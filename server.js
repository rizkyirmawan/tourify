const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

mongoose
	.connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.log(`Error: ${err}`));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Up and running on port ${port}...`));
