import React, { useState } from 'react'
import {
	Modal,
	Button,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	Input,
	FormGroup,
} from 'reactstrap'
import axios from 'axios'

const EditTodo = (props) => {
	const { todo } = props
	const { getTodos } = props
	const [editModal, setEditModal] = useState(false)
	const [editedDescription, setEditedDescription] = useState(todo.description)

	const updateTodo = (e) => {
		e.preventDefault()
		axios({
			method: 'PUT',
			url: '/api/todo',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${localStorage.getItem('jwt')}`,
			},
			data: {
				description: editedDescription,
				todo_id: todo.todo_id,
			},
		})
			.then((response) => {
				console.log(response)
				setEditModal(false)
				getTodos()
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<>
			<button
				className="btn btn-primary"
				onClick={() => {
					setEditModal(true)
				}}
			>
				Edit
			</button>

			<Modal isOpen={editModal}>
				<ModalHeader>Update Task</ModalHeader>
				<ModalBody>
					<Form>
						<FormGroup>
							<Input
								type="text"
								value={editedDescription}
								onChange={(e) => {
									setEditedDescription(e.target.value)
								}}
							></Input>
						</FormGroup>
					</Form>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={(e) => updateTodo(e)}>
						Update
					</Button>
					<Button
						color="warning"
						onClick={() => {
							setEditModal(false)
							setEditedDescription(todo.description)
						}}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</>
	)
}

export default EditTodo
