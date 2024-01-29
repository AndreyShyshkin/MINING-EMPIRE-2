import { Vector2 } from '/src/Math/Vector2.js'
export class Transform {
	Position = Vector2.Zero
	Size = Vector2.One
	constructor(Position, size) {
		this.Position = Position
		this.Size = size
	}
}
