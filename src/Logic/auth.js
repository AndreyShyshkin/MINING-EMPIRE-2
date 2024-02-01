import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth'
import { app } from './firebase'

let googleLogin = document.querySelector('#googleLogin')
let singOutUser = document.querySelector('#singOut')
let registerUserBtn = document.querySelector('#registerUserBtn')
let loginUserBtn = document.querySelector('#loginUserBtn')
let username
let email
let password

const firebase = app
const auth = getAuth()
const provider = new GoogleAuthProvider()

onAuthStateChanged(auth, user => {
	if (user) {
		const uid = user.uid
		console.log(uid)
	} else {
		console.log('user not login')
	}
})

const registerUser = () => {
	email = document.querySelector('#emailRegister').value
	password = document.querySelector('#passwordRegister').value

	createUserWithEmailAndPassword(auth, email, password)
		.then(userCredential => {
			// Signed in
			const user = userCredential.user
			console.log(user)
		})
		.catch(error => {
			const errorCode = error.code
			const errorMessage = error.message
		})
}

const loginUser = () => {
	email = document.querySelector('#emailLogin').value
	password = document.querySelector('#passwordLogin').value

	signInWithEmailAndPassword(auth, email, password)
		.then(userCredential => {
			// Signed up
			const user = userCredential.user
			console.log(user)
		})
		.catch(error => {
			const errorCode = error.code
			const errorMessage = error.message
			// ..
		})
}

const userSingIn = async () => {
	signInWithPopup(auth, provider)
		.then(result => {
			const user = result.user
			console.log(user)
		})
		.catch(error => {
			const errorCode = error.code
			const errorMessage = error.message
		})
}

const userSingOut = () => {
	signOut(auth)
		.then(() => {
			console.log('signOut')
		})
		.catch(error => {
			const errorCode = error.code
			const errorMessage = error.message
		})
}

googleLogin.addEventListener('click', userSingIn)
singOutUser.addEventListener('click', userSingOut)
registerUserBtn.addEventListener('click', registerUser)
loginUserBtn.addEventListener('click', loginUser)
