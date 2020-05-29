import React, { useState, useContext } from 'react'
import axios from 'axios'
import { TodosContext } from '../contexts/TodosContext'
import { toast } from 'react-toastify'

const InputTodo = () => {
	const [description, setDescription] = useState('')
	const { getTodos } = useContext(TodosContext)

	const addDescription = (e) => {
		e.preventDefault()
		axios({
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${localStorage.getItem('jwt')}`,
			},
			url: '/api/todo',
			data: {
				description: description,
			},
		})
			.then((response) => {
				console.log(response)
				setDescription('')
				getTodos()
			})
			.catch((err) => {
				console.error(err)
				toast.error('Sign in first 💩', {
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
			<h1 className="text-center mt-3">To-Do List</h1>
			<form className="d-flex ml-5 mr-5 mt-3">
				<input
					type="text"
					className="form-control border border-success"
					value={description}
					onChange={(e) => {
						setDescription(e.target.value)
					}}
				></input>
				<button className="btn btn-success ml-1" onClick={addDescription}>
					Add
				</button>
			</form>
		</div>
	)
}

export default InputTodo
