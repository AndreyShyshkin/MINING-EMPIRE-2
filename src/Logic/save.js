//import { getDatabase, ref, set } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import { app } from './firebase'
//import resource from './inventory'
import { SceneManager } from '/src/Logic/SceneManager.js'

let firebase = app

async function writeUserData() {
	let layer = SceneManager.Instance.mine.TC.GetLayer(20)
	var simplifiedTilesArray = layer.map(function (tile) {
		return {
			IsActive: tile.IsActive,
			Type: tile.Type,
			Image: tile.Image.currentSrc,
			// Add other relevant properties as needed
		}
	})

	// Converting the simplified array to JSON
	var jsonString = JSON.stringify(simplifiedTilesArray, null, 2)

	const storage = getStorage()

	// Upload the JSON string directly to Firebase Storage
	const storageRef = ref(storage, 'some-child/tilesData.json')
	await uploadString(storageRef, jsonString, 'raw')

	// Retrieve the download URL for the uploaded file
	const downloadURL = await getDownloadURL(storageRef)

	console.log('JSON file uploaded successfully!')
	console.log('Download URL:', downloadURL)
	/*
	const db = getDatabase()
	set(ref(db, 'users/' + '1'), {
		lvlPick: resource.lvlPick,
		money: resource.money,
		res1: resource.res1,
		res2: resource.res2,
		res3: resource.res3,
		res4: resource.res4,
		res5: resource.res5,
		res6: resource.res6,
	})*/
}

export default writeUserData
