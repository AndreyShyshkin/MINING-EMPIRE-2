import { Player } from '/src/Entities/Player.js'
import { Canvas } from '/src/Graphics/Canvas/Canvas.js'
import { Images } from '/src/Graphics/Images.js'
import { Game } from '/src/Logic/Game.js'
import { CreateImageByPath } from '/src/Logic/RenderImage.js'
import { SceneManager } from '/src/Logic/SceneManager.js'
import resource from '/src/Logic/inventory.js'
import cave from '/src/Map/cave.js'
import village from '/src/Map/village.js'
import { Vector2 } from '/src/Math/Vector2.js'

let startGame = document.querySelector('#startGame')
let startScreen = document.querySelector('.startScreen')
let money = document.querySelector('.money')
let res1 = document.querySelector('.res1')
let res2 = document.querySelector('.res2')
let res3 = document.querySelector('.res3')
let res4 = document.querySelector('.res4')
let res5 = document.querySelector('.res5')
let res6 = document.querySelector('.res6')

let game = new Game(
	Start,
	Update,
	() => {},
	() => {},
	() => {}
)

let SM = new SceneManager()

let playerImg = CreateImageByPath('/src/assets/img/player1.png')
let player = new Player(
	new Vector2(920, 500),
	new Vector2(80, 80),
	playerImg,
	3,
	Vector2.Zero,
	SM
)

village(SM.town.TC)
cave()

window.onbeforeunload = function () {
	return 'Are you sure?'
}

startGame.addEventListener('click', event => {
	startScreen.style.display = 'none'
	game.Start()

	let element = document.documentElement

	if (element.requestFullscreen) {
		element.requestFullscreen()
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen()
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen()
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen()
	}
})

function Start() {
	Canvas.Instance.updateSize()
	Canvas.Instance.GetLayerContext(0).drawImage(Images.back, 0, 0)
}
function Update() {
	let entities = []
	SceneManager.Instance.currentScene.Entities.forEach(element => {
		entities.push(element)
	})
	SM.currentScene.TC.LoadedLayers.forEach(layer => {
		layer.forEach(entity => {
			entities.push(entity)
		})
	})
	SM.currentScene.TC.UpdateLoadted(Player.Camera.Y)
	player.Update(entities)
	Canvas.Instance.GetLayerContext(1).clearRect(0, 0, 1920, 1080)
	Canvas.Instance.GetLayerContext(2).clearRect(0, 0, 1920, 1080)
	Canvas.Instance.GetLayerContext(3).clearRect(0, 0, 1920, 1080)
	SM.currentScene.Draw()
	player.Draw(Canvas.Instance.GetLayerContext(player.Layer), Player.Camera)

	money.innerHTML = resource.money
	res1.innerHTML = resource.res1
	res2.innerHTML = resource.res2
	res3.innerHTML = resource.res3
	res4.innerHTML = resource.res4
	res5.innerHTML = resource.res5
	res6.innerHTML = resource.res6
}

function drawText(context, text, x, y, font, color, align = 'left') {
	context.font = font
	context.fillStyle = color
	context.textAlign = align
	context.fillText(text, x, y)
}
