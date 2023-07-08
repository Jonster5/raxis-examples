import { Component, ECS, ECSEvent } from 'raxis';

export class Apple extends Component {}

export class EatAppleEvent extends ECSEvent {}

function setupApple(ecs: ECS) {
	ecs.getEventWriter(EatAppleEvent).send();
}

function moveApple(ecs: ECS) {
	if (ecs.getEventReader(EatAppleEvent).empty()) return;
}

export function ApplePlugin(ecs: ECS) {
	ecs.addComponentType(Apple).addEventType(EatAppleEvent).addStartupSystem(setupApple).addMainSystem(moveApple);
}
