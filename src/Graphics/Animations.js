import { Animation } from '/src/Graphics/Animation'
import { CreateImageByPath } from '/src/Logic/RenderImage.js'
export class Animations {
	static PlayerWalkRight = new Animation(
		[
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run1.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run2.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run3.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run4.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run5.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkRight/Player_run6.png'),
		],
		0.15
	)
	static PlayerWalkLeft = new Animation(
		[
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run1.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run2.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run3.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run4.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run5.png'),
			new CreateImageByPath('/src/assets/img/Player/WalkLeft/Player_run6.png'),
		],
		0.15
	)
	static PlayerIdleRight = new Animation(
		[
			new CreateImageByPath(
				'/src/assets/img/Player/IdleRight/Player_idle1.png'
			),
			new CreateImageByPath(
				'/src/assets/img/Player/IdleRight/Player_idle2.png'
			),
		],
		0.3
	)
	static PlayerIdleLeft = new Animation(
		[
			new CreateImageByPath('/src/assets/img/Player/IdleLeft/Player_idle1.png'),
			new CreateImageByPath('/src/assets/img/Player/IdleLeft/Player_idle2.png'),
		],
		0.3
	)
	static PlayerAttackRight = new Animation(
		[
			new CreateImageByPath(
				'/src/assets/img/Player/Attack_right/Player_attack1.png'
			),
			new CreateImageByPath(
				'/src/assets/img/Player/Attack_right/Player_attack2.png'
			),
		],
		0.1
	)
	static PlayerAttackLeft = new Animation(
		[
			new CreateImageByPath(
				'/src/assets/img/Player/Attack_left/Player_attack1.png'
			),
			new CreateImageByPath(
				'/src/assets/img/Player/Attack_left/Player_attack2.png'
			),
		],
		0.1
	)
	static PlayerJumpRight = new Animation(
		[
			new CreateImageByPath(
				'/src/assets/img/Player/Jump/Player_jump_right.png'
			),
		],
		0.1
	)
	static PlayerJumpLeft = new Animation(
		[new CreateImageByPath('/src/assets/img/Player/Jump/Player_jump_left.png')],
		0.1
	)
}
