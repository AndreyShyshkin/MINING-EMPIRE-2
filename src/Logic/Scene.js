import { Player } from '/src/Entities/Player.js'
import { TileController } from '/src/Entities/TileController.js'
import { Canvas } from '/src/Graphics/Canvas/Canvas.js'
export class Scene {
	Entities = []
	TC = new TileController(100, 1920)
	Draw() {
		this.Entities.forEach(entity => {
			entity.Draw(Canvas.Instance.GetLayerContext(entity.Layer), Player.Camera)
		})
		this.TC.LoadedLayers.forEach(layer => {
			layer.forEach(entity => {
				entity.Draw(
					Canvas.Instance.GetLayerContext(entity.Layer),
					Player.Camera
				)
			})
		})
	}
}
