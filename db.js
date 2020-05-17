// importing a package called pg (postgres)
const { Pool } = require('pg')

require('dotenv').config()

const devConfig = {
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE,
}

// Coming from heroku
const proConfig = {
	connectionString: process.env.DATABASE_URL,
}

// Using the pool class to create an object that is linked to our todo_db
const pool = new Pool(
	process.env.NODE_ENV === 'production' ? proConfig : devConfig
)

module.exports = pool
