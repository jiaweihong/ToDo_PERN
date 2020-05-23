const express = require('express')
const cors = require('cors')
const pool = require('./db')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const path = require('path')

const app = express()

const jwtKey = process.env.JWT_SECRET_Key
const PORT = process.env.PORT || 5000

app.use(
	cors({
		credentials: true,
	})
)

// express.json() gives us access to the req.body
// which allows us to access the key-value pairs sent to us in the request
app.use(express.json())

// Loads static files from the build file
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	// Catch all error page
	// This forwards all HTTP get requests to client's index
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

// Create an account
app.post('/account', async (req, res) => {
	try {
		const { username } = req.body
		const { email } = req.body
		const { password } = req.body

		// 'Returning *' allows you to get the information of your query
		const newAccount = await pool.query(
			'INSERT INTO account (username, email, password) VALUES ($1, $2, $3) RETURNING *',
			[username, email, password]
		)

		// newAccount.row[0] gives just the information of the query that was added
		res.json(newAccount.rows[0])
	} catch (error) {
		console.error(error)
	}
})

// Sign in with JWT
app.post('/account/authenticate', async (req, res) => {
	try {
		const { username, password } = req.body

		// Checking if it matches an account in the database
		const getAccountId = await pool.query(
			'SELECT account_id FROM account WHERE username = $1 and password = $2',
			[username, password]
		)

		if (!getAccountId.rows[0]) {
			return res.status(401).end()
		}

		const token = jwt.sign(
			{ account_id: `${getAccountId.rows[0].account_id}` },
			jwtKey
		)

		res.json({ token: `${token}` })
	} catch (error) {
		console.error(error)
	}
})

//Create a todo
app.post('/todo', async (req, res) => {
	try {
		const token = req.header('authorization')
		const { description } = req.body

		// If no token is sent
		if (token === 'null') {
			return res.status(401).end()
		}

		//decodes the jwt and gets account_id
		const decoded = jwt.verify(token, jwtKey)
		const account_id = decoded.account_id

		const newTodo = await pool.query(
			'INSERT INTO todo (account_id, description) VALUES ($1, $2) RETURNING *',
			[account_id, description]
		)

		res.json(newTodo.rows[0])
	} catch (error) {
		console.error(error)
	}
})

// Get all todo
app.get('/todos', async (req, res) => {
	try {
		const token = req.header('authorization')

		if (token === 'null') {
			return res.status(401).end()
		}

		const decoded = jwt.verify(token, jwtKey)
		const account_id = decoded.account_id

		const getTodos = await pool.query(
			'SELECT * FROM todo WHERE account_id = $1',
			[account_id]
		)

		// The values of the rows key is an array of todos
		// So we want the entire array instead of rows[0]
		res.json(getTodos.rows)
	} catch (error) {
		console.log(error)
	}
})

// Update a todo
app.put('/todo', async (req, res) => {
	try {
		const token = req.header('authorization')

		if (token === 'null') {
			return res.status(401).end()
		}

		const decoded = jwt.verify(token, jwtKey)

		const account_id = decoded.account_id
		const { todo_id } = req.body
		const { description } = req.body

		const updateTodo = await pool.query(
			'UPDATE todo SET description = $1 WHERE todo_id = $2 and account_id =$3 RETURNING *',
			[description, todo_id, account_id]
		)

		res.json(updateTodo.rows[0])
	} catch (error) {
		console.error(error)
	}
})

// Delete a todo
app.delete('/todo', async (req, res) => {
	try {
		const token = req.header('authorization')

		if (token === 'null') {
			return res.status(401).end()
		}

		const decoded = jwt.verify(token, jwtKey)
		const account_id = decoded.account_id

		const { todo_id } = req.body

		const deleteTodo = await pool.query(
			'DELETE FROM todo WHERE todo_id = $1 and account_id = $2 RETURNING *',
			[todo_id, account_id]
		)

		res.json(deleteTodo.rows[0])
	} catch (error) {
		console.error(error)
	}
})

app.listen(PORT, () => {
	console.log('Server Running')
})
