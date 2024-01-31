// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAt_Vgako8dtNXRu5a4TVH_p6fz_Y_cWhQ',
	authDomain: 'mining-empire-2.firebaseapp.com',
	databaseURL:
		'https://mining-empire-2-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'mining-empire-2',
	storageBucket: 'mining-empire-2.appspot.com',
	messagingSenderId: '550635237577',
	appId: '1:550635237577:web:3edacc6cef8b8bbd39dd18',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
