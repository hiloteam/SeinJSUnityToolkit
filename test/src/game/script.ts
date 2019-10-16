/**
 * @File   : script.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: script.
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls/lib/CameraOrbitControlComponent';

import {EModelEvents} from './types';

export async function initEvents(game: Sein.Game) {
  // Register model events
  game.event.register(EModelEvents.New);
  game.event.register(EModelEvents.LoadStart);
  game.event.register(EModelEvents.Loading);
  game.event.register(EModelEvents.LoadEnd);
  game.event.register(EModelEvents.Error);
}

export async function createNewModels(
  game: Sein.Game,
  sources: {name: string, url: string}[],
  oldModels: Sein.SceneActor[]
): Promise<Sein.SceneActor[]> {
  const {world} = game;
  const newModels: Sein.SceneActor[] = [];

  // Load all new resources
  for (let index = 0; index < sources.length; index += 1) {
    const {name, url} = sources[index];
    game.event.trigger(EModelEvents.Loading, {source: {name, url}});
    await game.resource.load({type: 'GlTF', name, url});
  }

  // Remove all old models
  oldModels.forEach(actor => world.removeActor(actor));

  // Instantiate all new modes
  for (let index = 0; index < sources.length; index += 1) {
    const actors = game.resource.instantiate<'GlTF'>(sources[index].name);
    newModels.push(...actors.array);
  }

  return newModels;
}

export async function createCamera(game: Sein.Game) {
  const {world} = game;

  const camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
    far: 1000,
    near: .01,
    fov: 60,
    aspect: game.screenWidth / game.screenHeight,
    position: new Sein.Vector3(0, 0, -4)
  });
  camera.lookAt(new Sein.Vector3(0, 0, 0));

  camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
    enableDamping: true,
    dampingFactor: .2,
    zoomMax: 100,
    zoomMin: .1,
    target: new Sein.Vector3(0, 0, 0)
  });
}

export async function createLights(game: Sein.Game) {
  const {world} = game;

  world.addActor('aLight', Sein.AmbientLightActor, {
    color: new Sein.Color(1, 1, 1),
    amount: .5
  });
  world.addActor('dLight', Sein.DirectionalLightActor, {
    direction: new Sein.Vector3(0, -1, 1),
    color: new Sein.Color(1, 1, 1),
    amount: 2
  });
}
