import { Cave } from '/src/Entities/Cave.js'
import { Tile } from '/src/Entities/Tile.js'
import { Images } from '/src/Graphics/Images.js'
import { SceneManager } from '/src/Logic/SceneManager.js'
import { Vector2 } from '/src/Math/Vector2.js'
import { EntityTypes } from '/src/Physics/EntityTypes.js'
function village() {
	for (let x = -62; x < 62; x++) {
		if (x % 4 == 0 && (x < 4 || x > 16)) {
			tree(SceneManager.Instance.town.Entities, x, 3)
		} else if (x == 7 || x == 10) {
			tree(SceneManager.Instance.town.Entities, x, 3)
		} else if (x == 15) {
			tree(SceneManager.Instance.town.Entities, x - 0.25, 3)
		}
	}
	SceneManager.Instance.town.Entities.push(
		new Cave(
			new Vector2(800, 400),
			new Vector2(300, 200),
			Images.cave,
			2,
			EntityTypes.Cave,
			SceneManager.Instance.town
		)
	)
	SceneManager.Instance.town.Entities.push(
		new Tile(
			new Vector2(350, 200),
			new Vector2(400, 400),
			Images.market,
			2,
			EntityTypes.Market,
			SceneManager.Instance.town
		)
	)
	SceneManager.Instance.town.Entities.push(
		new Tile(
			new Vector2(1150, 200),
			new Vector2(400, 400),
			Images.forge,
			2,
			EntityTypes.Forge,
			SceneManager.Instance.town
		)
	)
	for (let y = 3; y < 1000; y++) {
		for (let x = -62; x < 62; x++) {
			if (y == 3 && x % 4 == 0 && x < 1 && x > -10) {
				let r = Random(1, 3)
				switch (r) {
					case 1:
						home1(SceneManager.Instance.town.Entities, x - 0.65, y)
						break
					case 2:
						home2(SceneManager.Instance.town.Entities, x - 0.65, y)
						break
					case 3:
						home3(SceneManager.Instance.town.Entities, x - 0.65, y)
						break
				}
			} else if (y == 3 && x % 4 == 0 && x > 12 && x < 25) {
				let r = Random(1, 3)
				switch (r) {
					case 1:
						home1(SceneManager.Instance.town.Entities, x - 1, y)
						break
					case 2:
						home2(SceneManager.Instance.town.Entities, x - 1, y)
						break
					case 3:
						home3(SceneManager.Instance.town.Entities, x - 1, y)
						break
				}
			} else if (y == 6) {
				SceneManager.Instance.town.TC.GetLayer(y).push(
					new Tile(
						new Vector2(100 * x, 100 * y),
						new Vector2(100, 100),
						Images.lvl1_grass,
						2,
						EntityTypes.SolidTile,
						SceneManager.Instance.town
					)
				)
			} else if (y > 6 && y < 15) {
				SceneManager.Instance.town.TC.GetLayer(y).push(
					new Tile(
						new Vector2(100 * x, 100 * y),
						new Vector2(100, 100),
						Images.lvl1,
						2,
						EntityTypes.SolidTile,
						SceneManager.Instance.town
					)
				)
			}
		}
	}
}

function home1(Entities, x, y) {
	Entities.push(
		new Tile(
			new Vector2(110 * x, 100 * (y - 1)),
			new Vector2(400, 400),
			Images.home1,
			2,
			EntityTypes.Building,
			SceneManager.Instance.town
		)
	)
}

function home2(Entities, x, y) {
	Entities.push(
		new Tile(
			new Vector2(110 * x, 100 * (y - 1)),
			new Vector2(400, 400),
			Images.home2,
			2,
			EntityTypes.Building,
			SceneManager.Instance.town
		)
	)
}

function home3(Entities, x, y) {
	Entities.push(
		new Tile(
			new Vector2(110 * x, 100 * (y - 1)),
			new Vector2(400, 400),
			Images.home3,
			2,
			EntityTypes.Building,
			SceneManager.Instance.town
		)
	)
}

function tree(Entities, x, y) {
	Entities.push(
		new Tile(
			new Vector2(100 * x, 100 * y),
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

export default village
