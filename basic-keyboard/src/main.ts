import { ECS } from 'raxis';
import './style.scss';
import { CanvasSettings, KeysToTrack, defaultPlugins } from 'raxis-plugins';
import { SquarePlugin } from './square';

const app = document.getElementById('app');

const ecs = new ECS()
	.insertPlugins(...defaultPlugins)
	.insertResource(new CanvasSettings({ target: app, width: 2000 }))
	.insertResource(new KeysToTrack(['w', 'a', 's', 'd']))
	.insertPlugin(SquarePlugin);

ecs.run();
