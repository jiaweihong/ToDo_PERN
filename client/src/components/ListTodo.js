import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import EditTodo from './EditTodo'
import { TodosContext } from '../contexts/TodosContext'
import { LoggedInContext } from '../contexts/LoggedInContext'

const ListTodo = () => {
	const { todos, getTodos } = useContext(TodosContext)
	const { isLoggedIn } = useContext(LoggedInContext)

	// So that when the page reloads, it will automatically call getTodos
	useEffect(() => {
		if (isLoggedIn) {
			getTodos()
		}
	}, [])

	const deleteTodo = (todo) => {
		axios({
			method: 'DELETE',
			url: '/todo',
			headers: {
				Authorization: `${localStorage.getItem('jwt')}`,
			},
			data: {
				todo_id: todo.todo_id,
			},
		})
			.then((response) => {
				console.log(response)
				getTodos()
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className="ml-5 mr-5 mt-3">
			<table className="table">
				<thead className="thead-light">
					<tr>
						<th>Todos</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{todos.map((todo) => {
						return (
							<tr key={todo.todo_id}>
								<td class="w-50">{todo.description}</td>
								<td>
									<EditTodo todo={todo} getTodos={getTodos} />
								</td>
								<td>
									<button
										className="btn btn-warning"
										onClick={() => {
											deleteTodo(todo)
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default ListTodo
