import { ECS, With } from 'raxis';
import './style.scss';
import { Canvas, CanvasSettings, KeysToTrack, Transform, defaultPlugins } from 'raxis-plugins';
import { SnakeEvent, SnakePlugin } from './snake';
import { ApplePlugin } from './apple';

const app = document.getElementById('app');

const ecs = new ECS()
	.insertPlugins(...defaultPlugins)
	.insertResource(new CanvasSettings({ target: app, width: 2000 }))
	.insertResource(new KeysToTrack(['w', 'a', 's', 'd']))
	.insertPlugin(SnakePlugin)
	.insertPlugin(ApplePlugin);

ecs.run().then((ecs) => ecs.getEventWriter(SnakeEvent).send(new SnakeEvent('spawn')));
