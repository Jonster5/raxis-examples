import { Component, ECS, With } from 'raxis';
import { Inputs, Root, Sprite, Transform } from 'raxis-plugins';
import { Vec2 } from 'raxis/math';

export class Square extends Component {}

function setupSquare(ecs: ECS) {
	const root = ecs.query([], With(Root)).entity();

	const square = ecs.spawn(new Square(), new Transform(new Vec2(100, 100)), new Sprite('rectangle', 'royalblue'));

	root.addChild(square);
}

function moveSquare(ecs: ECS) {
	const [{ vel }] = ecs.query([Transform], With(Square)).single(); // Get the Square's Transform component and destructure the velocity vector
	const { keymap } = ecs.getResource(Inputs); // Grab the keyboard inputs

	vel.set(0, 0); // Reset the square's velocity

	if (keymap.get('w').isDown) vel.y += 300; //
	if (keymap.get('s').isDown) vel.y -= 300; //
	if (keymap.get('a').isDown) vel.x -= 300; //
	if (keymap.get('d').isDown) vel.x += 300; // Set the new velocity

	vel.clampMag(0, 300); // Clamp the magnitude of the velocity so you don't go faster diagonally
}

export function SquarePlugin(ecs: ECS) {
	ecs.addComponentType(Square).addStartupSystem(setupSquare).addMainSystem(moveSquare);
}
