import { Input } from '/src/Logic/Input.js'
import { Time } from '/src/Logic/Time.js'
export class Game {
	ShouldStop = false
	IsPause = false
	constructor(onStart, onUpdate, onStop, onStartPause, onClearPause) {
		this.onStart = onStart
		this.onUpdate = onUpdate
		this.onStop = onStop
		this.onStartPause = onStartPause
		this.onClearPause = onClearPause
	}
	Start() {
		this.onStart()
		Time.Init()
		Input.Init()
		window.requestAnimationFrame(this.Update.bind(this))
	}
	Update() {
		if (!this.ShouldStop) {
			Time.Update()
			this.onUpdate()
			window.requestAnimationFrame(this.Update.bind(this))
		}
	}
}
