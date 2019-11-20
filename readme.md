<h1>Tourify</h1>
<p>API pemesanan tour dengan fitur CRUD, autentikasi JWT, stripe payments, etc. <a href="https://tourify-bicksoe.herokuapp.com">Live demo</a></p>
<h2>Features</h2>
<ul>
	<li>Full authentication
		<ul>
			<li>Sign in</li>
			<li>Sign up (not yet implemented on SSR website)</li>
			<li>Password reset (not yet implemented on SSR website)</li>
			<li>Authorization (including user roles)</li>
		</ul>
	</li>
	<li>API sorting, filtering, field selecting and pagination</li>
	<li>Find tours within a certain radius (not yet implemented on SSR website)</li>
	<li>Get tours distances from specified point (not yet implemented on SSR website)</li>
	<li>Security best practices (helmet, XSS sanitization, etc.)</li>
</ul>
<h2>Built With</h2>
<ul>
	<li><a href="https://github.com/expressjs/express">Express</a> - Node.js Framework</li>
	<li><a href="https://github.com/mongodb/mongo">MongoDB</a> - Database</li>
	<li><a href="https://github.com/Automattic/mongoose">Mongoose</a> - ODM</li>
	<li><a href="https://github.com/pugjs/pug">Pug</a> - Template Engine</li>
</ul>
<h2>Installation</h2>
<ol>
	<li>Clone the repo</li>
	<li>Run terminal and navigate to the repo</li>
	<li>Run <code>npm install</code> to install all required dependencies</li>
	<li>Run <code>cp .env.example .env</code> to copy necessary configuration variables</li>
	<li>Modify <code>.env</code> file with your own credentials</li>
	<li>Run <code>npm run dev</code> to start application in development mode</li>
		<li>Application should be running at port <code>3001</code> by default</li>
</ol>
<h2>License</h2>
<a href="https://opensource.org/licenses/MIT">MIT</a>
