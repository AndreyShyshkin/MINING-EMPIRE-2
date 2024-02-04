import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Cave } from '/src/Entities/Cave.js'
import { Tile } from '/src/Entities/Tile.js'
import { Images } from '/src/Graphics/Images.js'
import { SceneManager } from '/src/Logic/SceneManager.js'
import { Vector2 } from '/src/Math/Vector2.js'
import { EntityTypes } from '/src/Physics/EntityTypes.js'

import axios from 'axios'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { app } from '../Logic/firebase'

let firebase = app
const auth = getAuth()

function cave() {
	for (let x = -62; x < 62; x++)
		if (x % 4 == 0 && x != 8) {
			tree(SceneManager.Instance.mine.Entities, x)
		}
	SceneManager.Instance.mine.Entities.push(
		new Cave(
			new Vector2(800, 400),
			new Vector2(300, 200),
			Images.cave,
			2,
			EntityTypes.Cave,
			SceneManager.Instance.mine
		)
	)
	for (let y = 6; y < 1000; y++) {
		for (let x = -62; x < 62; x++) {
			if (y == 6) {
				if (x >= -50 && x <= 50) {
					lvl1_grass(SceneManager, x, y, 5)
				} else {
					lvl1_grass(SceneManager, x, y, 100000)
				}
			} else if (y < 10) {
				if (x >= -50 && x <= 50) {
					lvl(Images.lvl1, SceneManager, x, y, 5)
				} else {
					lvl(Images.lvl1, SceneManager, x, y, 100000)
				}
			} else {
				let r = Random(1, 100)
				let rd = Random(1, 2000)
				if (rd == 1 && y > 15 && x > -40 && x < 40) {
					let yStart = y
					let xStart = x
					let a = 0
					let i = 0
					for (a = 0; a < 4; a++) {
						if (a == 0) {
							y = yStart
						} else {
							y -= 1
						}
						for (i = 0; i < 9; i++) {
							if (i == 0) {
								x = xStart
							} else {
								x -= 1
							}
							removeBlockAtCoordinates(x, y)
							if (a == 0 && i == 3) {
								chest(SceneManager, x, y)
							} else {
								cross(SceneManager, x, y)
							}
							if (y >= 10 && y < 50) {
								lvlBg(Images.lvl1bg, SceneManager, x, y)
							} else if (y >= 50 && y < 150) {
								lvlBg(Images.lvl2bg, SceneManager, x, y)
							} else if (y >= 150 && y < 250) {
								lvlBg(Images.lvl3bg, SceneManager, x, y)
							} else if (y >= 250 && y < 350) {
								lvlBg(Images.lvl4bg, SceneManager, x, y)
							} else if (y >= 350) {
								lvlBg(Images.lvl5bg, SceneManager, x, y)
							}
						}
						x = xStart
					}
					y = yStart
				} else {
					if (y >= 10 && y < 50) {
						if (x >= -50 && x <= 50) {
							if (r < 5) {
								lvlRes(Images.lvl1_res2, SceneManager, x, y, 6)
							} else if (r < 15) {
								lvlRes(Images.lvl1_res1, SceneManager, x, y, 7)
							} else lvl(Images.lvl1, SceneManager, x, y, 5)
						} else {
							lvl(Images.lvl1, SceneManager, x, y, 10000)
						}
					} else if (y >= 50 && y < 150) {
						if (x >= -50 && x <= 50) {
							if (r < 2) {
								lvlRes(Images.lvl2_res3, SceneManager, x, y, 18)
							} else if (r < 5) {
								lvlRes(Images.lvl2_res1, SceneManager, x, y, 16)
							} else if (r < 10) {
								lvlRes(Images.lvl2_res2, SceneManager, x, y, 17)
							} else lvl(Images.lvl2, SceneManager, x, y, 15)
						} else {
							lvl(Images.lvl2, SceneManager, x, y, 10000)
						}
					} else if (y >= 150 && y < 250) {
						if (x >= -50 && x <= 50) {
							if (r < 2) {
								lvlRes(Images.lvl3_res4, SceneManager, x, y, 28)
							} else if (r < 5) {
								lvlRes(Images.lvl3_res3, SceneManager, x, y, 27)
							} else if (r < 10) {
								lvlRes(Images.lvl3_res2, SceneManager, x, y, 26)
							} else lvl(Images.lvl3, SceneManager, x, y, 25)
						} else {
							lvl(Images.lvl3, SceneManager, x, y, 10000)
						}
					} else if (y >= 250 && y < 350) {
						if (x >= -50 && x <= 50) {
							if (r < 2) {
								lvlRes(Images.lvl4_res5, SceneManager, x, y, 38)
							} else if (r < 5) {
								lvlRes(Images.lvl4_res4, SceneManager, x, y, 37)
							} else if (r < 10) {
								lvlRes(Images.lvl4_res3, SceneManager, x, y, 36)
							} else lvl(Images.lvl4, SceneManager, x, y, 35)
						} else {
							lvl(Images.lvl4, SceneManager, x, y, 10000)
						}
					} else if (y >= 350) {
						if (x >= -50 && x <= 50) {
							if (r < 2) {
								lvlRes(Images.lvl5_res6, SceneManager, x, y, 48)
							} else if (r < 5) {
								lvlRes(Images.lvl5_res5, SceneManager, x, y, 47)
							} else if (r < 10) {
								lvlRes(Images.lvl5_res4, SceneManager, x, y, 46)
							} else lvl(Images.lvl5, SceneManager, x, y, 45)
						} else {
							lvl(Images.lvl5, SceneManager, x, y, 10000)
						}
					}
				}
			}
		}
	}
}

async function loadWorldFromFirebase() {
	try {
		onAuthStateChanged(auth, async user => {
			if (user) {
				const uid = user.uid
				const storage = getStorage()
				try {
					const storageRef = await ref(
						storage,
						`some-child/tilesData${uid}.json`
					)
					const downloadURL = await getDownloadURL(storageRef)
					const response = await axios.get(downloadURL)
					const worldData = await response.json()

					const layers = worldData // Adjust the property name accordingly

					for (const layerData of layers) {
						const tiles = layerData.tiles
						for (let x = -62; x < 62; x++)
							if (x % 4 == 0 && x != 8) {
								tree(SceneManager.Instance.mine.Entities, x)
							}
						SceneManager.Instance.mine.Entities.push(
							new Cave(
								new Vector2(800, 400),
								new Vector2(300, 200),
								Images.cave,
								2,
								EntityTypes.Cave,
								SceneManager.Instance.mine
							)
						)
						for (const tileData of tiles) {
							const x = tileData.X
							const y = tileData.Y
							const blockType = tileData.Block
							const entityType = tileData.Type

							if (y == 6) {
								if (entityType == SolidTile) {
									if (x >= -50 && x <= 50) {
										lvl1_grass(SceneManager, x, y, 5)
									} else {
										lvl1_grass(SceneManager, x, y, 100000)
									}
								} else if (entityType == BackGroundTile) {
									if (x >= -50 && x <= 50) {
										lvlBg(SceneManager, x, y, 5)
									} else {
										lvlBg(SceneManager, x, y, 100000)
									}
								}
							} else if (y < 10) {
								if (x >= -50 && x <= 50) {
									lvlBg(SceneManager, x, y, 5)
								} else {
									lvlBg(SceneManager, x, y, 100000)
								}
							} else {
								if (x >= -50 && x <= 50) {
									if (blockType == chest) {
										chest(SceneManager, x, y)
									} else if (blockType == cross) {
										cross(SceneManager, x, y)
									}
									if (blockType == lvl1) {
										lvl(Images.lvl1, SceneManager, x, y, 5)
									} else if (blockType == lvl1bg) {
										lvlBg(Images.lvl1bg, SceneManager, x, y)
									} else if (blockType == lvl1_res1) {
										lvlRes(Images.lvl1_res1, SceneManager, x, y, 7)
									} else if (blockType == lvl1_res2) {
										lvlRes(Images.lvl1_res2, SceneManager, x, y, 6)
									} else if (blockType == lvl2) {
										lvl(Images.lvl2, SceneManager, x, y, 15)
									} else if (blockType == lvl2bg) {
										lvlBg(Images.lvl2bg, SceneManager, x, y)
									} else if (blockType == lvl2_res1) {
										lvlRes(Images.lvl2_res1, SceneManager, x, y, 16)
									} else if (blockType == lvl2_res2) {
										lvlRes(Images.lvl2_res2, SceneManager, x, y, 17)
									} else if (blockType == lvl2_res3) {
										lvlRes(Images.lvl2_res3, SceneManager, x, y, 18)
									} else if (blockType == lvl3) {
										lvl(Images.lvl3, SceneManager, x, y, 25)
									} else if (blockType == lvl3bg) {
										lvlBg(Images.lvl3bg, SceneManager, x, y)
									} else if (blockType == lvl3_res2) {
										lvlRes(Images.lvl3_res2, SceneManager, x, y, 26)
									} else if (blockType == lvl3_res3) {
										lvlRes(Images.lvl3_res3, SceneManager, x, y, 27)
									} else if (blockType == lvl3_res4) {
										lvlRes(Images.lvl3_res4, SceneManager, x, y, 28)
									} else if (blockType == lvl4) {
										lvl(Images.lvl4, SceneManager, x, y, 35)
									} else if (blockType == lvl4bg) {
										lvlBg(Images.lvl4bg, SceneManager, x, y)
									} else if (blockType == lvl4_res3) {
										lvlRes(Images.lvl4_res3, SceneManager, x, y, 36)
									} else if (blockType == lvl4_res4) {
										lvlRes(Images.lvl4_res4, SceneManager, x, y, 37)
									} else if (blockType == lvl4_res5) {
										lvlRes(Images.lvl4_res5, SceneManager, x, y, 38)
									} else if (blockType == lvl5) {
										lvl(Images.lvl5, SceneManager, x, y, 45)
									} else if (blockType == lvl5bg) {
										lvlBg(Images.lvl5bg, SceneManager, x, y)
									} else if (blockType == lvl5_res4) {
										lvlRes(Images.lvl5_res4, SceneManager, x, y, 46)
									} else if (blockType == lvl3_res5) {
										lvlRes(Images.lvl5_res5, SceneManager, x, y, 47)
									} else if (blockType == lvl3_res6) {
										lvlRes(Images.lvl5_res6, SceneManager, x, y, 48)
									}
								} else {
									if (blockType == lvl1) {
										lvl(Images.lvl1, SceneManager, x, y, 100000)
									} else if (blockType == lvl2) {
										lvl(Images.lvl2, SceneManager, x, y, 100000)
									} else if (blockType == lvl3) {
										lvl(Images.lvl3, SceneManager, x, y, 100000)
									} else if (blockType == lvl4) {
										lvl(Images.lvl4, SceneManager, x, y, 100000)
									} else if (blockType == lvl5) {
										lvl(Images.lvl5, SceneManager, x, y, 100000)
									}
								}
							}
						}
					}
				} catch (error) {
					console.error(
						'Error fetching world data from Firebase Storage:',
						error
					)
				}
			} else {
				console.log('ERROR user not login')
			}
		})
	} catch (error) {
		console.error('Error loading world data from Firebase:', error)
	}
}

function lvl(lvlX, SceneManager, x, y, Hp) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			lvlX,
			2,
			EntityTypes.SolidTile,
			SceneManager.Instance.mine,
			Hp
		)
	)
}

function lvlBg(lvlX, SceneManager, x, y) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			lvlX,
			1,
			EntityTypes.BackGroundTile,
			SceneManager.Instance.mine
		)
	)
}

function lvlRes(lvlX, SceneManager, x, y, Hp) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			lvlX,
			2,
			EntityTypes.SolidTile,
			SceneManager.Instance.mine,
			Hp
		)
	)
}

function lvl1_grass(SceneManager, x, y, Hp) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			Images.lvl1_grass,
			2,
			EntityTypes.SolidTile,
			SceneManager.Instance.mine,
			Hp
		)
	)
}

function chest(SceneManager, x, y) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			Images.chest,
			2,
			EntityTypes.BackGroundTile,
			SceneManager.Instance.mine
		)
	)
}

function cross(SceneManager, x, y) {
	SceneManager.Instance.mine.TC.GetLayer(y).push(
		new Tile(
			new Vector2(0 + 100 * x, 100 * y),
			new Vector2(100, 100),
			Images.cross,
			2,
			EntityTypes.BackGroundTile,
			SceneManager.Instance.mine
		)
	)
}

function tree(Entities, x) {
	Entities.push(
		new Tile(
			new Vector2(100 * x + 50, 300),
			new Vector2(200, 300),
			Images.tree,
			2,
			EntityTypes.Building,
			SceneManager.Instance.town
		)
	)
}

function Random(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function removeBlockAtCoordinates(x, y) {
	const layer = SceneManager.Instance.mine.TC.GetLayer(y)
	//console.log(SceneManager.Instance.mine.TC.GetLayer(20))
	for (let i = 0; i < layer.length; i++) {
		const block = layer[i]
		if (
			block.transform.Position.X === x * 100 &&
			block.transform.Position.Y === y * 100
		) {
			layer.splice(i, 1)
			break
		}
	}
}

//export default cave
export default loadWorldFromFirebase
