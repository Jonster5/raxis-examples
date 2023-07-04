import { Component, ECS, With } from 'raxis';
import { Inputs, Root, Sprite, Transform, Tween, addTween, getTween, removeTween } from 'raxis-plugins';
import {
	BackOut,
	CircIn,
	CubicIn,
	CubicOut,
	ElasticIn,
	ExpoIn,
	QuadIn,
	QuadInOut,
	QuintIn,
	QuintOut,
	SineIn,
	SineInOut,
	Vec2,
	linear,
} from 'raxis/math';

export class Square extends Component {}

function setupSquare(ecs: ECS) {
	const root = ecs.query([], With(Root)).entity();

	const square = ecs.spawn(new Square(), new Transform(new Vec2(100, 100)), new Sprite('rectangle', 'royalblue'));

	root.addChild(square);
}

function moveSquare(ecs: ECS) {
	const squareQuery = ecs.query([Transform], With(Square));
	const [{ vel }] = squareQuery.single();
	const square = squareQuery.entity();

	const { keymap } = ecs.getResource(Inputs); // Grab the keyboard inputs

	const w = keymap.get('w');
	const a = keymap.get('a');
	const s = keymap.get('s');
	const d = keymap.get('d');

	if (w.isDown && s.isUp) {
		// Going up

		removeTween(square, 'stop-vert'); // Gets rid of the stop tween
		removeTween(square, 'down'); // Gets rid of the down tween

		if (!getTween(square, 'up'))
			// If there isn't already an up tween
			addTween(
				// Add a new tween
				square, // To the square entity's TweenManager component (which is automatically inserted if it doesn't exist)
				'up', // With the label 'up'
				new Tween( // New Tween
					vel, // On the square's velocity vector
					{ y: 500 }, // Have the target be a y value of 500
					100, // Over a duration of 100ms
					linear // Using the linear easing function (can be whatever you want)
				).onCompletion(() => removeTween(square, 'up')) // When the tween is done, remove it automatically to avoid issues
			);
	} else if (s.isDown && w.isUp) {
		// Going down

		removeTween(square, 'stop-vert');
		removeTween(square, 'up');

		if (!getTween(square, 'down'))
			addTween(
				square,
				'down',
				new Tween(vel, { y: -500 }, 100, linear).onCompletion(() => removeTween(square, 'down'))
			);
	} else if ((w.isUp && s.isUp) || (w.isDown && s.isDown)) {
		// Not moving vertically

		removeTween(square, 'up');
		removeTween(square, 'down');

		if (!getTween(square, 'stop-vert'))
			addTween(
				square,
				'stop-vert',
				new Tween(vel, { y: 0 }, 200, linear).onCompletion(() => removeTween(square, 'stop-vert'))
			);
	}

	if (a.isDown && d.isUp) {
		// Going left

		removeTween(square, 'stop-hori');
		removeTween(square, 'right');

		if (!getTween(square, 'left'))
			addTween(
				square,
				'left',
				new Tween(vel, { x: -500 }, 100, linear).onCompletion(() => removeTween(square, 'left'))
			);
	} else if (d.isDown && a.isUp) {
		// Going right

		removeTween(square, 'stop-hori');
		removeTween(square, 'left');

		if (!getTween(square, 'right'))
			addTween(
				square,
				'right',
				new Tween(vel, { x: 500 }, 100, linear).onCompletion(() => removeTween(square, 'right'))
			);
	} else if ((a.isUp && d.isUp) || (a.isDown && d.isDown)) {
		// Not moving horizontaly

		removeTween(square, 'left');
		removeTween(square, 'right');

		if (!getTween(square, 'stop-hori'))
			addTween(
				square,
				'stop-hori',
				new Tween(vel, { x: 0 }, 200, linear).onCompletion(() => removeTween(square, 'stop-hori'))
			);
	}

	vel.clampMag(0, 500); // Clamp the magnitude of the velocity so you don't go faster diagonally
}

export function SquarePlugin(ecs: ECS) {
	ecs.addComponentType(Square).addStartupSystem(setupSquare).addMainSystem(moveSquare);
}
