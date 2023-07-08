import { Component, ECS, ECSEvent, Resource, With } from 'raxis';
import { Inputs, Sprite, Time, Transform } from 'raxis-plugins';
import { Vec2 } from 'raxis/math';

export class Snake extends Component {
	// Component that the parent snake entity will have
	constructor(public trail: number[]) {
		super();
	}
}

export class SnakePart extends Component {} // Component all pieces of the snake have on them

export class SnakeEvent extends ECSEvent {
	// Event that gets triggered for all snake related events
	constructor(public type: 'spawn' | 'grow') {
		super();
	}
}

export class Direction extends Resource {
	// Direction resource holds all the possible directions the snake could be moving in
	constructor(
		public current: 'none' | 'up' | 'down' | 'left' | 'right',
		public last: 'none' | 'up' | 'down' | 'left' | 'right'
	) {
		super();
	}
}

function spawnSnake(ecs: ECS) {
	const sEvent = ecs.getEventReader(SnakeEvent);
	if (sEvent.empty()) return;
	if (sEvent.get().every((s) => s.type !== 'spawn')) return; // If the snake is not being spawned, return

	const oldSnake = ecs.query([], With(Snake));
	if (!oldSnake.empty()) oldSnake.entities().map((e) => ecs.destroy(e)); // If the snake is being spawned, and an old snake still exists, destroy that old snake

	const sTrail = [];
	const snake = ecs.spawn(new Snake(sTrail), new Transform(new Vec2(), new Vec2(-1050, -1050)), new Sprite('none')); // Create the Snake entity, which will be the parent entity of all

	const head = ecs.spawn(
		new SnakePart(),
		new Transform(new Vec2(100, 100), new Vec2(1000, 1000)),
		new Sprite('rectangle', 'green')
	); // Create the first trail piece

	sTrail.push(head.id());
	snake.addChild(head);
}

class SnakeTimer extends Resource {
	constructor(public tLeft: number) {
		super();
	}
}

function moveSnake(ecs: ECS) {
	if (!ecs.hasLocalResource(SnakeTimer)) ecs.insertLocalResource(new SnakeTimer(0));
	const time = ecs.getResource(Time); // 						//
	ecs.getLocalResource(SnakeTimer).tLeft -= time.delta; //	//
	if (ecs.getLocalResource(SnakeTimer).tLeft > 0) return; //	// Logic for system timer

	const snakeQuery = ecs.query([Snake]);
	if (snakeQuery.empty()) return;

	const dir = ecs.getResource(Direction);
	if (dir.current === 'none') return;

	const trail = snakeQuery.single()[0].trail.map((t) => ecs.entity(t)); // Get all the trail pieces in order

	trail.reverse().forEach((pt, i) => {
		// Moves each piece of the snake except the first one to the place of the piece in front of it
		if (i + 1 === trail.length) return;
		const nt = trail[i + 1];

		pt.get(Transform).pos.set(nt.get(Transform).pos);
	});

	const spos = trail.at(-1).get(Transform).pos; // grab the first snake piece

	// Move the first piece in the current direction
	if (dir.current === 'left') spos.x -= 100;
	else if (dir.current === 'right') spos.x += 100;
	else if (dir.current === 'up') spos.y += 100;
	else spos.y -= 100;

	dir.last = dir.current;

	ecs.getLocalResource(SnakeTimer).tLeft = 200; // Logic for system Timer
}

function growSnake(ecs: ECS) {
	const snakeEvent = ecs.getEventReader(SnakeEvent);
	if (snakeEvent.empty()) return;
}

function changeDirection(ecs: ECS) {
	const dir = ecs.getResource(Direction);
	const { keymap } = ecs.getResource(Inputs);

	if (keymap.get('w').isDown && dir.current !== 'down' && dir.last !== 'down') dir.current = 'up';
	if (keymap.get('a').isDown && dir.current !== 'right' && dir.last !== 'right') dir.current = 'left';
	if (keymap.get('s').isDown && dir.current !== 'up' && dir.last !== 'up') dir.current = 'down';
	if (keymap.get('d').isDown && dir.current !== 'left' && dir.last !== 'left') dir.current = 'right';
}

export function SnakePlugin(ecs: ECS) {
	ecs.addComponentTypes(Snake, SnakePart)
		.addEventType(SnakeEvent)
		.addMainSystems(spawnSnake, moveSnake, changeDirection)
		.insertResource(new Direction('none', 'none'));
}
