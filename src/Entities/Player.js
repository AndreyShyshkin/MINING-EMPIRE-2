import { PlayerStates } from '/src/Entities/PlayerStates'
import { Tile } from '/src/Entities/Tile'
import forgeLogic from '/src/Entities/forge'
import marketLogic from '/src/Entities/market'
import { Images } from '/src/Graphics/Images'
import { PlayerAnimationController } from '/src/Graphics/PlayerAnimationController'
import { Input } from '/src/Logic/Input'
import { SceneManager } from '/src/Logic/SceneManager'
import { Time } from '/src/Logic/Time'
import resource from '/src/Logic/inventory.js'
import { Vector2 } from '/src/Math/Vector2.js'
import { Collisions } from '/src/Physics/Collisions.js'
import { Entity } from '/src/Physics/Entity.js'
import { EntityTypes } from '/src/Physics/EntityTypes.js'
import { Physics } from '/src/Physics/Physics.js'
import { Transform } from '/src/Physics/Transform.js'

let lastPressTime = 0
let market = document.querySelector('.market')
let sell = document.querySelector('.sell')
let buy = document.querySelector('.buy')
let sellBlock = document.querySelector('.sellBlock')
let buyBlock = document.querySelector('.buyBlock')
let forge = document.querySelector('.forge')
let selector = document.querySelector('.selector')

export class Player extends Entity {
	static Camera
	static Instance
	changeSceneFlag = false
	bottomCollision = false
	topCollision = false
	leftCollision = false
	rightCollision = false
	isLadder = false
	isAttack = false
	ladderUpFlag = false
	velocityY = 0
	speed = 500
	damage = 1
	SM
	Direction = 1 //1 - right, 2 - left
	PAC = new PlayerAnimationController()
	jumpForce = 700
	attackDelay = 0.2
	curAttackDelay = 0
	State = PlayerStates.Idle
	constructor(position, size, Image, Layer, Camera, SM) {
		super(new Transform(position, size), Image, Layer)
		Player.Camera = Camera
		this.SM = SM
		Player.Instance = this
		marketLogic()
		forgeLogic()
	}
	Update(Entities) {
		this.InputUpdate()
		this.UpdateAttack()
		this.PAC.Update()
		if ((!this.bottomCollision && !this.isLadder) || this.velocityY > 0) {
			this.velocityY -= Physics.G * Time.DeltaTime
		} else {
			if (this.velocityY < 0) {
				this.velocityY = 0
			}
		}
		this.CollisionCheck(Entities)
		this.curAttackDelay -= Time.deltaTime
		Player.Camera = new Vector2(
			-this.transform.Position.X + 920,
			this.transform.Position.Y - 500
		)
	}
	InputUpdate() {
		let stride = Vector2.Zero
		if (this.curAttackDelay <= 0 && !Input.GetKeyState(75)) {
			let walk = false
			if (
				Input.GetKeyState(65) &&
				!Input.GetKeyState(68) &&
				!this.leftCollision
			) {
				stride = stride.Add(Vector2.Right.Scale(this.speed * Time.DeltaTime))
				walk = true
				this.Direction = -1
			}
			if (
				Input.GetKeyState(68) &&
				!Input.GetKeyState(65) &&
				!this.rightCollision
			) {
				stride = stride.Add(Vector2.Left.Scale(this.speed * Time.DeltaTime))
				walk = true
				this.Direction = 1
			}
			if (
				this.velocityY == 0 &&
				!this.topCollision &&
				(this.isLadder || this.bottomCollision)
			) {
				if (Input.GetKeyState(32)) {
					//console.log('t')
					this.velocityY = this.jumpForce
				}
			}
			if (this.isLadder) {
				if (Input.GetKeyState(83) && !this.bottomCollision) {
					stride = stride.Add(Vector2.Up.Scale(this.speed * Time.DeltaTime))
				}
			}
			if (Input.GetKeyState(87)) {
				if (this.isLadder && !this.ladderUpFlag && !this.topCollision)
					stride = stride.Add(Vector2.Down.Scale(this.speed * Time.DeltaTime))
				else this.ladderUpFlag = true
			} else {
				this.ladderUpFlag = false
			}
			if (walk) {
				this.State = PlayerStates.Walk
				if (this.Direction == 1) {
					this.PAC.ChangeAnimation(this.PAC.WalkRight)
				} else {
					this.PAC.ChangeAnimation(this.PAC.WalkLeft)
				}
			} else {
				this.State = PlayerStates.Idle
				if (this.Direction == 1) {
					this.PAC.ChangeAnimation(this.PAC.IdleRight)
				} else {
					this.PAC.ChangeAnimation(this.PAC.IdleLeft)
				}
			}
		}
		if (!this.bottomCollision && !this.isLadder) {
			if (this.Direction == 1) this.PAC.ChangeAnimation(this.PAC.JumpRight)
			else this.PAC.ChangeAnimation(this.PAC.JumpLeft)
		}
		if (this.velocityY < 0 || !this.topCollision)
			stride = stride.Add(Vector2.Down.Scale(this.velocityY * Time.deltaTime))
		stride = Vector2.Round(stride)
		Player.Camera = Player.Camera.Add(stride)
		this.transform.Position = this.transform.Position.Add(
			new Vector2(-stride.X, stride.Y)
		)
		if (Input.GetKeyState(88)) {
			this.CreateLadder()
		}
		if (Input.GetKeyState(69)) {
			// "E"
			this.SM.currentScene.TC.LoadedLayers.forEach(layer => {
				const blockX = Math.floor(this.transform.Position.X / 100) * 100
				const blockY = Math.floor(this.transform.Position.Y / 100) * 100

				const blockIndex = layer.findIndex(
					entity =>
						entity.transform.Position.X === blockX &&
						entity.transform.Position.Y === blockY
				)

				if (blockIndex !== -1) {
					const block = layer[blockIndex]

					if (block.Image === Images.chest) {
						let r = Random(1, 10)
						if (
							this.transform.Position.Y >= 10 * 100 &&
							this.transform.Position.Y < 50 * 100
						) {
							resource.res1 += r
							resource.res2 += r - 1
							resource.money += r
						} else if (
							this.transform.Position.Y >= 50 * 100 &&
							this.transform.Position.Y < 150 * 100
						) {
							resource.res1 += r
							resource.res2 += r - 1
							resource.res3 += r - 2
							resource.money += r * 2
						} else if (
							this.transform.Position.Y >= 150 * 100 &&
							this.transform.Position.Y < 250 * 100
						) {
							resource.res2 += r
							resource.res3 += r - 1
							resource.res4 += r - 2
							resource.money += r * 3
						} else if (
							this.transform.Position.Y >= 250 * 100 &&
							this.transform.Position.Y < 350 * 100
						) {
							resource.res3 += r
							resource.res4 += r - 1
							resource.res5 += r - 2
							resource.money += r * 4
						} else if (this.transform.Position.Y >= 350 * 100) {
							resource.res4 += r
							resource.res5 += r - 1
							resource.res6 += r - 2
							resource.money += r * 5
						}
						layer.splice(blockIndex, 1)
					}
				}
			})
		}
	}
	UpdateAttack() {
		if (
			Input.GetKeyState(75) &&
			this.curAttackDelay <= 0 &&
			(this.bottomCollision || this.isLadder)
		) {
			// K
			if (SceneManager.Instance.currentScene == SceneManager.Instance.mine) {
				let col = []
				if (Input.GetKeyState(68)) {
					//right
					col = this.GetColliderDot(Vector2.Right.Scale(100))
					this.Direction = 1
				} else if (Input.GetKeyState(65)) {
					//left
					col = this.GetColliderDot(Vector2.Left.Scale(100))
					this.Direction = -1
				} else if (Input.GetKeyState(87)) {
					//top
					col = this.GetColliderDot(Vector2.Down.Scale(100))
				} else if (Input.GetKeyState(83)) {
					//down
					col = this.GetColliderDot(Vector2.Up.Scale(100))
				}
				let flag = false
				if (col.length == 2)
					this.SM.currentScene.TC.LoadedLayers.forEach(layer => {
						layer.forEach(entity => {
							if (
								entity.Type === EntityTypes.SolidTile ||
								entity.Type === EntityTypes.DestroyableTile
							)
								if (Collisions.AABBtoAABB(entity.GetCollider(), col)) {
									//
									flag = true
									if (this.Direction == 1)
										this.PAC.ChangeAnimation(this.PAC.AttackRight)
									else this.PAC.ChangeAnimation(this.PAC.AttackLeft)
									this.PAC.CurrentAnimation.Reset()
									this.curAttackDelay = this.attackDelay
									entity.GetDamage(this.damage)
									if (entity.curHp <= 0) {
										entity.OnDestroy()
									}
								}
						})
					})
				if (!flag) {
					this.State = PlayerStates.Idle
					if (this.Direction == 1) {
						this.PAC.ChangeAnimation(this.PAC.IdleRight)
					} else {
						this.PAC.ChangeAnimation(this.PAC.IdleLeft)
					}
				}
			}
		}
	}
	CollisionCheck(Entities) {
		let bottomFlag = false
		let topFlag = false
		let leftFlag = false
		let rightFlag = false
		let ladderFlag = false
		let offset = 10
		let Left = [
			new Vector2(
				this.transform.Position.X,
				this.transform.Position.Y + offset
			),
			new Vector2(
				this.transform.Position.X,
				this.transform.Position.Y + this.transform.Size.Y - offset
			),
		]
		let Right = [
			new Vector2(
				this.transform.Position.X + this.transform.Size.X,
				this.transform.Position.Y + offset
			),
			new Vector2(
				this.transform.Position.X + this.transform.Size.X,
				this.transform.Position.Y + this.transform.Size.Y - offset
			),
		]
		let Top = [
			new Vector2(
				this.transform.Position.X + offset,
				this.transform.Position.Y
			),
			new Vector2(
				this.transform.Position.X + this.transform.Size.X - offset,
				this.transform.Position.Y
			),
		]
		let Bottom = [
			new Vector2(
				this.transform.Position.X + offset * 1.5,
				this.transform.Position.Y + this.transform.Size.Y
			),
			new Vector2(
				this.transform.Position.X + this.transform.Size.X - offset * 1.5,
				this.transform.Position.Y + this.transform.Size.Y
			),
		]
		Entities.forEach(entity => {
			if (!(entity === this)) {
				if (entity.Type === EntityTypes.SolidTile) {
					if (
						Collisions.AABBtoAABB(entity.GetCollider(), Left) ||
						this.transform.Position.X <= -5000
					) {
						this.leftCollision = true
						leftFlag = true
					}
					if (
						Collisions.AABBtoAABB(entity.GetCollider(), Right) ||
						this.transform.Position.X >= 4900
					) {
						this.rightCollision = true
						rightFlag = true
					}
					if (Collisions.AABBtoAABB(entity.GetCollider(), Top)) {
						topFlag = true
						this.topCollision = true
						if (this.velocityY > 0) {
							this.velocityY = 0
						}
					}
					if (
						Collisions.AABBtoAABB(entity.GetCollider(), Bottom) ||
						this.transform.Position.Y >= 99000
					) {
						bottomFlag = true
						this.bottomCollision = true
						this.velocityY = 0
						if (this.transform.Position.Y <= 99000)
							this.transform.Position.Y =
								entity.transform.Position.Y - this.transform.Size.Y
						else this.transform.Position.Y = 99000
						let d =
							this.transform.Position.Y -
							(entity.transform.Position.Y - this.transform.Size.Y)
						if (d > 0) {
							d = Math.floor(d)
						} else if (d < 0) {
							d = Math.ceil(d)
						}
						this.transform.Position.Y += d
						Player.Camera.Y += d
					}
				}
				if (entity.Type === EntityTypes.Ladder) {
					if (Collisions.AABBtoAABB(entity.GetCollider(), this.GetCollider())) {
						ladderFlag = true
						this.isLadder = true
					}
				}
			}
			this.CaveCheck(entity)
			this.MarketCheck(entity)
			this.ForgeCheck(entity)
		})
		if (!bottomFlag) {
			this.bottomCollision = false
		}
		if (!topFlag) {
			this.topCollision = false
		}
		if (!leftFlag) {
			this.leftCollision = false
		}
		if (!rightFlag) {
			this.rightCollision = false
		}
		if (!ladderFlag) {
			this.isLadder = false
		}
	}
	CaveCheck(entity) {
		if (entity.Type === EntityTypes.Cave) {
			if (Input.GetKeyState(69)) {
				// E
				if (Collisions.AABBtoAABB(this.GetCollider(), entity.GetCollider())) {
					if (!this.changeSceneFlag) {
						SceneManager.Instance.ChangeScene()
					}
					this.changeSceneFlag = true
				}
			} else {
				this.changeSceneFlag = false
			}
		}
	}

	MarketCheck(entity) {
		if (entity.Type === EntityTypes.Market) {
			if (Collisions.AABBtoAABB(this.GetCollider(), entity.GetCollider())) {
				if (Input.GetKeyState(69) && Date.now() - lastPressTime >= 500) {
					// E
					if (market.style.display == 'none' || market.style.display == '') {
						market.style.display = 'block'
						sellBlock.style.display = 'none'
						buyBlock.style.display = 'none'
						forge.style.display = 'none'
						selector.style.display = 'flex'
					} else {
						market.style.display = 'none'
						sellBlock.style.display = 'block'
						buyBlock.style.display = 'block'
						forge.style.display = 'none'
					}
					lastPressTime = Date.now()
				}
			} else {
				market.style.display = 'none'
			}
		}
	}

	ForgeCheck(entity) {
		if (entity.Type === EntityTypes.Forge) {
			if (Collisions.AABBtoAABB(this.GetCollider(), entity.GetCollider())) {
				if (Input.GetKeyState(69) && Date.now() - lastPressTime >= 500) {
					// E
					if (forge.style.display == 'none' || forge.style.display == '') {
						forge.style.display = 'block'
						market.style.display = 'none'
					} else {
						forge.style.display = 'none'
						market.style.display = 'none'
					}
					lastPressTime = Date.now()
				}
			} else {
				forge.style.display = 'none'
			}
		}
	}
	CreateLadder() {
		let layer = SceneManager.Instance.mine.TC.GetLayerByPos(
			this.transform.Position.Y
		)
		let x = this.transform.Position.X + 40
		let y = this.transform.Position.Y + 40
		x /= SceneManager.Instance.mine.TC.tileSize
		x = Math.floor(x)
		x *= SceneManager.Instance.mine.TC.tileSize
		y /= SceneManager.Instance.mine.TC.tileSize
		y = Math.floor(y)
		y *= SceneManager.Instance.mine.TC.tileSize
		let flag = false
		if (
			layer != null &&
			SceneManager.Instance.currentScene == SceneManager.Instance.mine
		) {
			let col = [
				new Vector2(x, y).Add(50, 50),
				new Vector2(x, y).Add(new Vector2(50, 50)),
			]
			layer.forEach(element => {
				if (
					element.Type === EntityTypes.Ladder ||
					element.Type === EntityTypes.DestroyableTile ||
					element.Type === EntityTypes.SolidTile
				) {
					if (
						element.transform.Position.X == x &&
						element.transform.Position.Y == y
					) {
						flag = true
					}
				}
			})
			if (!flag)
				layer.push(
					new Tile(
						new Vector2(x, y),
						new Vector2(100, 100),
						Images.ladder,
						3,
						EntityTypes.Ladder,
						SceneManager.Instance.mine
					)
				)
		}
	}
	GetColliderDot(direction) {
		return [
			this.transform.Position.Add(
				this.transform.Size.Scale(0.5).Add(direction)
			),
			this.transform.Position.Add(
				this.transform.Size.Scale(0.5).Add(direction)
			),
		]
	}
	Draw(Context, Camera) {
		Context.drawImage(
			this.PAC.CurrentAnimation.CurrentFrame,
			this.transform.Position.X + Camera.X,
			this.transform.Position.Y - Camera.Y,
			this.transform.Size.X,
			this.transform.Size.Y
		)
	}
}

function Random(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min)
}
