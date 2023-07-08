import './style.css';
import { ECS } from 'raxis';
import { CanvasSettings, KeysToTrack, Sprite, Transform, defaultPlugins } from 'raxis-plugins';
import { Vec2 } from 'raxis/math';

const target = document.getElementById('app')!;

const ecs = new ECS()
	.insertPlugins(...defaultPlugins)
	.insertResource(new CanvasSettings({ target, width: 1500 })) // Set the target element for the canvas, and specify how many 'units' should be shown in the canvas window at default zoom
	.insertResource(new KeysToTrack([]))
	.addStartupSystem((ecs: ECS) => {
		ecs.spawn(
			// Spawn a new entity and assign it to 'square'
			new Transform(new Vec2(100, 100), new Vec2(), 0, new Vec2(), Math.PI), // Insert a Transform component with a size of 100x100 and an angular velocity of PI
			new Sprite('rectangle', 'white') // Insert a Sprite component
		);
	});

ecs.run(); // Start the ECS
