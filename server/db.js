// importing a package called pg (postgres)
const { Pool } = require('pg')

// Using the pool class to create an object that is linked to our todo_db
const pool = new Pool({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: '5432',
	database: 'todo_db',
})

module.exports = pool
