import React, { useState, useEffect, useContext } from 'react'
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	Modal,
	Button,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	Form,
	Input,
	FormGroup,
	FormFeedback,
	FormText,
} from 'reactstrap'
import axios from 'axios'
import { toast } from 'react-toastify'
import '../App.css'
import { TodosContext } from '../contexts/TodosContext'
import { LoggedInContext } from '../contexts/LoggedInContext'

const NavBar = () => {
	const { getTodos, setTodos } = useContext(TodosContext)

	const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext)
	// Sign Up Logic:
	// Open and close sign upModal
	const [openSignUpModal, setSignUpModal] = useState(false)

	// To handle and update signInEmail, signInPassword and signInUsername
	const [signInEmail, setSignInEmail] = useState('')
	const [signInUsername, setSignInUsername] = useState('')
	const [signInPassword, setSignInPassword] = useState('')

	// Initially set valid/invalid to null so that checkSignUpButton() will not crash. If not error: undefined has no property valid
	const [isSignInEmailValid, setSignInEmailValid] = useState({
		valid: null,
		invalid: null,
	})
	const [isSignInUsernameValid, setSignInUsernameValid] = useState({
		valid: null,
		invalid: null,
	})
	const [isSignInPasswordValid, setSignInPasswordValid] = useState({
		valid: null,
		invalid: null,
	})
	const [isSignUpDisabled, setSignUpDisabled] = useState(true)

	const checkSignUpButton = () => {
		if (
			isSignInEmailValid.valid === true &&
			isSignInPasswordValid.valid === true &&
			isSignInUsernameValid.valid === true
		) {
			setSignUpDisabled(false)
		} else {
			setSignUpDisabled(true)
		}
	}

	const updateAndValidateSignInUsername = (e) => {
		setSignInUsername(e.target.value)
		if (/^\S*$/.test(e.target.value) && e.target.value.length >= 1) {
			setSignInUsernameValid({ valid: true, invalid: false })
		} else {
			setSignInUsernameValid({ valid: false, invalid: true })
		}
	}
	const updateAndValidateSignInEmail = async (e) => {
		setSignInEmail(e.target.value)
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
			setSignInEmailValid({ valid: true, invalid: false })
		} else {
			setSignInEmailValid({ valid: false, invalid: true })
		}
	}
	const updateAndValidateSignInPassword = (e) => {
		setSignInPassword(e.target.value)
		if (/^\S*$/.test(e.target.value) && e.target.value.length >= 6) {
			setSignInPasswordValid({ valid: true, invalid: false })
		} else {
			setSignInPasswordValid({ valid: false, invalid: true })
		}
	}

	// To make send a sign up request to database
	const sendSignUpRequest = () => {
		axios({
			method: 'POST',
			header: 'Content-Type: application/json',
			url: '/account',
			data: {
				email: signInEmail,
				username: signInUsername,
				password: signInPassword,
			},
		})
			.then((res) => {
				console.log(res)
				setSignUpModal(false)
				toast.success('🦄 Sign Up Succesful!', {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
			})
			.catch((error) => {
				console.error(error)
			})
	}

	useEffect(() => {
		checkSignUpButton()
	}, [signInEmail, signInUsername, signInPassword])

	// Sign in logic:
	const [openLoginModal, setLoginModal] = useState(false)
	const [loginUsername, setLoginUsername] = useState('')
	const [loginPassword, setLoginPassword] = useState('')

	const [isLoginDisabled, setLoginDisabled] = useState(true)

	const checkLoginButton = () => {
		if (loginUsername.length >= 1 && loginPassword.length >= 1) {
			setLoginDisabled(false)
		} else {
			setLoginDisabled(true)
		}
	}

	useEffect(() => {
		checkLoginButton()
	}, [loginUsername, loginPassword])

	const sendSignInRequest = () => {
		axios({
			method: 'POST',
			header: 'Content-Type: application/json',
			url: '/account/authenticate',
			data: {
				username: loginUsername,
				password: loginPassword,
			},
		})
			.then((response) => {
				console.log(response.data.token)
				localStorage.setItem('jwt', response.data.token)
				getTodos()
				setLoggedIn(localStorage.getItem('jwt'))
				setLoginModal(false)
				toast.success('Logged In 👑', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
			})
			.catch((error) => {
				console.error(error)
				toast.error('Username / Password Incorrect 💩', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
			})
	}

	// Logout Logic:
	const logoutButton = () => {
		localStorage.removeItem('jwt')
		setLoggedIn(localStorage.getItem('jwt'))
		setTodos([])
		toast.success('Goodbye 🤡', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		})
	}

	return (
		<div>
			<Navbar className="navbar navbar-expand-sm bg-dark navbar-dark">
				<img
					src="https://to-do-cdn.microsoft.com/static-assets/c87265a87f887380a04cf21925a56539b29364b51ae53e089c3ee2b2180148c6/icons/logo.png"
					alt="logo"
					style={{ width: 30, height: 30 }}
					className="mr-1"
				></img>
				<NavbarBrand href="/">ToDo</NavbarBrand>
				<Nav className="ml-auto" navbar>
					{isLoggedIn ? (
						<>
							<NavItem>
								{/*Start: Logout*/}
								<Button color="danger" onClick={logoutButton}>
									Logout
								</Button>
								{/*End: Logout*/}
							</NavItem>
						</>
					) : (
						<>
							<NavItem>
								{/*Start: Sign Up*/}
								<Button
									className="mr-1"
									color="primary"
									onClick={() => {
										setSignUpModal(true)
									}}
								>
									Sign Up
								</Button>
								<Modal isOpen={openSignUpModal}>
									<ModalHeader>Sign Up</ModalHeader>
									<ModalBody>
										<Form>
											<FormGroup>
												<Label>Email</Label>
												<Input
													{...isSignInEmailValid}
													type="email"
													name="SignInemail"
													placeholder="johndoe@hotmail.com"
													onChange={updateAndValidateSignInEmail}
												/>
												<FormFeedback valid>Email is valid</FormFeedback>
												<FormFeedback invalid>Email is invalid </FormFeedback>
											</FormGroup>
											<FormGroup>
												<Label>Username</Label>
												<Input
													{...isSignInUsernameValid}
													type="text"
													name="SignInusername"
													placeholder="John"
													onChange={updateAndValidateSignInUsername}
												/>
												<FormFeedback valid>Username is valid</FormFeedback>
												<FormFeedback invalid>
													Username is invalid{' '}
												</FormFeedback>
											</FormGroup>
											<FormGroup>
												<Label>Password</Label>
												<Input
													{...isSignInPasswordValid}
													type="password"
													name="signInPassword"
													placeholder="password123"
													onChange={updateAndValidateSignInPassword}
												/>
												<FormText>
													Password has to be atleast 6 characters
												</FormText>
												<FormFeedback valid>Password is valid</FormFeedback>
												<FormFeedback invalid>
													Password is invalid{' '}
												</FormFeedback>
											</FormGroup>
										</Form>
									</ModalBody>
									<ModalFooter>
										<Button
											color="success"
											onClick={sendSignUpRequest}
											disabled={isSignUpDisabled}
										>
											Sign Up
										</Button>
										<Button
											color="danger"
											onClick={() => {
												setSignUpModal(false)
											}}
										>
											Cancel
										</Button>
									</ModalFooter>
								</Modal>
								{/*End: Sign Up*/}
							</NavItem>
							<NavItem>
								{/*Start: Login*/}
								<Button
									color="primary"
									onClick={() => {
										setLoginModal(true)
									}}
								>
									Login
								</Button>
								<Modal isOpen={openLoginModal}>
									<ModalHeader>Login</ModalHeader>
									<ModalBody>
										<Form>
											<FormGroup>
												<Label>Username</Label>
												<Input
													type="text"
													onChange={(e) => {
														setLoginUsername(e.target.value)
													}}
												/>
											</FormGroup>
											<FormGroup>
												<Label>Password</Label>
												<Input
													type="password"
													onChange={(e) => {
														setLoginPassword(e.target.value)
													}}
												/>
											</FormGroup>
										</Form>
									</ModalBody>
									<ModalFooter>
										<Button
											color="success"
											onClick={sendSignInRequest}
											disabled={isLoginDisabled}
										>
											Login
										</Button>
										<Button
											color="danger"
											onClick={() => {
												setLoginModal(false)
											}}
										>
											Cancel
										</Button>
									</ModalFooter>
								</Modal>
								{/*End: Login*/}
							</NavItem>
						</>
					)}
				</Nav>
			</Navbar>
		</div>
	)
}

export default NavBar
