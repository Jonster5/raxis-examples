import './style.css';
import { ECS, With } from 'raxis';
import { CanvasSettings, KeysToTrack, Root, Sprite, Transform, defaultPlugins } from 'raxis-plugins';
import { Vec2 } from 'raxis/math';

const target = document.getElementById('app')!;

const ecs = new ECS()
	.insertPlugins(...defaultPlugins)
	.insertResource(new CanvasSettings({ target, width: 1500 })) // Set the target element for the canvas, and specify how many 'units' should be shown in the canvas window at default zoom
	.insertResource(new KeysToTrack([]))
	.addStartupSystem((ecs: ECS) => {
		const root = ecs.query([], With(Root)).entity()!; // Get access to the entity with Root on it

		const square = ecs.spawn(
			// Spawn a new entity and assign it to 'square'
			new Transform(new Vec2(100, 100)), // Insert a Transform component
			new Sprite('rectangle', 'white') // Insert a Sprite component
		);

		square.get(Transform)!.avel = Math.PI; // Get the Transform component and set it's angular velocity to half a rotation per second

		root.addChild(square); // Add the square entity as a child of the Root entity
	});

ecs.run(); // Start the ECS
