import React, { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import InputTodo from './components/InputTodo'
import ListTodo from './components/ListTodo'
import { TodosContext } from './contexts/TodosContext'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import { LoggedInContext } from './contexts/LoggedInContext'

const App = () => {
	const [todos, setTodos] = useState([])

	// Check if logged in
	const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem('jwt'))

	const getTodos = () => {
		axios({
			method: 'GET',
			url: '/todos',
			headers: {
				Authorization: `${localStorage.getItem('jwt')}`,
			},
		})
			.then((response) => {
				console.log(response.data)
				setTodos(response.data)
			})
			.catch((err) => {
				console.error(err)
				toast.error('You need to sign in first', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
			})
	}

	return (
		<div>
			<ToastContainer />
			<LoggedInContext.Provider value={{ isLoggedIn, setLoggedIn }}>
				<TodosContext.Provider value={{ todos, setTodos, getTodos }}>
					<NavBar />
					<InputTodo />
					<ListTodo />
				</TodosContext.Provider>
			</LoggedInContext.Provider>
			<Footer />
		</div>
	)
}

export default App
