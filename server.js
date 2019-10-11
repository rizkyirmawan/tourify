const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Up and running on port ${port}...`));
