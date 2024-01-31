import { Player } from '/src/Entities/Player.js'
import resource from '/src/Logic/inventory.js'
let resource1 = document.querySelector('.resource1')
let resource2 = document.querySelector('.resource2')
let resource3 = document.querySelector('.resource3')
let createPick = document.querySelector('.createPick')

function forgeLogic() {
	//console.log(Player.Instance.damage)
	if (resource.lvlPick == 1) {
		resource1.innerHTML = 'Coal 10'
		resource2.innerHTML = 'Iron 10'
	}

	createPick.addEventListener('click', event => {
		if (resource.lvlPick == 1 && resource.res1 >= 10 && resource.res2 >= 10) {
			resource.lvlPick += 1
			resource.res1 -= 10
			resource.res2 -= 10
			resource1.innerHTML = 'Coal 10'
			resource2.innerHTML = 'Iron 30'
			resource3.innerHTML = 'Gold 20'
			Player.Instance.damage += 1
		} else if (
			resource.lvlPick == 2 &&
			resource.res1 >= 10 &&
			resource.res2 >= 30 &&
			resource.res3 >= 20
		) {
			resource.lvlPick += 1
			resource.res1 -= 10
			resource.res2 -= 30
			resource.res3 -= 20
			resource1.innerHTML = 'Coal 10'
			resource2.innerHTML = 'Gold 30'
			resource3.innerHTML = 'Tungsten 20'
			Player.Instance.damage += 1
		} else if (
			resource.lvlPick == 3 &&
			resource.res1 >= 10 &&
			resource.res3 >= 30 &&
			resource.res4 >= 20
		) {
			resource.lvlPick += 1
			resource.res1 -= 10
			resource.res3 -= 30
			resource.res4 -= 20
			resource1.innerHTML = 'Coal 10'
			resource2.innerHTML = 'Tungsten 30'
			resource3.innerHTML = 'Titanium 20'
			Player.Instance.damage += 1
		} else if (
			resource.lvlPick == 4 &&
			resource.res1 >= 10 &&
			resource.res4 >= 30 &&
			resource.res5 >= 20
		) {
			resource.lvlPick += 1
			resource.res1 -= 10
			resource.res4 -= 30
			resource.res5 -= 20
			resource1.innerHTML = 'Coal 10'
			resource2.innerHTML = 'Titanium 30'
			resource3.innerHTML = 'Jewel 20'
			Player.Instance.damage += 1
		} else if (
			resource.lvlPick == 5 &&
			resource.res1 >= 10 &&
			resource.res5 >= 30 &&
			resource.res6 >= 20
		) {
			resource.lvlPick += 1
			resource.res1 -= 10
			resource.res5 -= 30
			resource.res6 -= 50
			resource1.innerHTML = ''
			resource2.innerHTML = ''
			resource3.innerHTML = ''
			Player.Instance.damage += 1
		} else {
			alert("You don't have enough resources!")
		}
	})
}

export default forgeLogic
