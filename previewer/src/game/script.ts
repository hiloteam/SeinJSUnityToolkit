/**
 * @File   : script.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: script.
 */
import * as Sein from 'seinjs';
import 'seinjs-camera-controls';

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
    console.log(game.resource.get(name));
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

export function bindCameraControl(camera: Sein.PerspectiveCameraActor, actors: Sein.SceneActor[]) {
  const bounds = calcModelsBound(actors);
  const target = new Sein.Vector3(
    (bounds.x0 + bounds.x1) / 2,
    (bounds.y0 + bounds.y1) / 2,
    (bounds.z0 + bounds.z1) / 2
  );
  camera.lookAt(target);

  camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
    enableDamping: true,
    dampingFactor: .2,
    zoomMax: 1000,
    zoomMin: .01,
    target
  });

  camera.getWorld().setMainCamera(camera);
}

export async function createDefaultCamera(game: Sein.Game, actors: Sein.SceneActor[]) {
  const {world} = game;

  const camera = world.addActor('camera', Sein.PerspectiveCameraActor, {
    far: 1000,
    near: .01,
    fov: 60,
    aspect: game.screenWidth / game.screenHeight,
    position: new Sein.Vector3(0, 0, 5)
  });

  let target: Sein.Vector3;

  const bounds = calcModelsBound(actors);

  const radius = Math.sqrt(
    (((bounds.x1 - bounds.x0) / 2) ** 2)
    + (((bounds.y1 - bounds.y0) / 2) ** 2)
    + (((bounds.z1 - bounds.z0) / 2) ** 2),
  ) * 2;

  camera.transform.setPosition(
    (bounds.x0 + bounds.x1) / 2,
    (bounds.y0 + bounds.y1) / 2,
    (bounds.z0 + bounds.z1) + radius,
  );

  target = new Sein.Vector3(camera.transform.x, camera.transform.y, (bounds.z0 + bounds.z1) / 2);
  camera.lookAt(target);

  camera.addComponent('control', Sein.CameraControls.CameraOrbitControlComponent, {
    enableDamping: true,
    dampingFactor: .2,
    zoomMax: 1000,
    zoomMin: .01,
    target
  });
}

function calcModelsBound(actors: Sein.SceneActor[]) {
  const bounds = {
    x0: 0, x1: 0, y0: 0, y1: 0, z0: 0, z1: 0,
  };
  actors.forEach((actor) => {
    const b = actor.getBounds();

    if (!b) {
      return;
    }

    bounds.x0 = b.xMin < bounds.x0 ? b.xMin : bounds.x0;
    bounds.x1 = b.xMax > bounds.x1 ? b.xMax : bounds.x1;
    bounds.y0 = b.yMin < bounds.y0 ? b.yMin : bounds.y0;
    bounds.y1 = b.yMax > bounds.y1 ? b.yMax : bounds.y1;
    bounds.z0 = b.zMin < bounds.z0 ? b.zMin : bounds.z0;
    bounds.z1 = b.zMax > bounds.z1 ? b.zMax : bounds.z1;
  });

  return bounds;
}

export async function createDefaultLights(game: Sein.Game) {
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

export async function checkUpdate() {
  const res = await Sein.HTTP.get('/heart-beat-and-update');

  if (res.data && res.data.update) {
    location.reload();
  }

  setTimeout(() => checkUpdate(), 1000);
}
