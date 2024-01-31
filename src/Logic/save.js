//import { getDatabase, ref, set } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import { app } from './firebase'
//import resource from './inventory'
import { SceneManager } from '/src/Logic/SceneManager.js'

let firebase = app

async function writeUserData() {
	const layersData = []
	let layerLog = SceneManager.Instance.mine.TC.GetLayer(20)
	console.log('🚀 ~ writeUserData ~ layerLog:', layerLog)

	// Loop through all layers from 0 to 150
	for (let layerIndex = 0; layerIndex <= 150; layerIndex++) {
		let layer = SceneManager.Instance.mine.TC.GetLayer(layerIndex)

		// Check if the layer exists before processing
		if (layer) {
			var simplifiedTilesArray = layer.map(function (tile) {
				return {
					IsActive: tile.IsActive,
					Type: tile.Type,
					Image: tile.Image.currentSrc,
					Y: tile.transform.Position.Y,
					X: tile.transform.Position.X,
					// Add other relevant properties as needed
				}
			})

			// Add the layer data to the array
			layersData.push({
				layerIndex: layerIndex,
				tiles: simplifiedTilesArray,
			})
		}
	}

	// Converting the layersData array to JSON
	var jsonString = JSON.stringify(layersData, null, 2)

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
