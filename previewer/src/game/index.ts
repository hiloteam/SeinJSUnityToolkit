/**
 * @File   : main.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: main.
 */
import * as Sein from 'seinjs';
import 'seinjs-audio';
import 'seinjs-inspector';
import * as CANNON from 'cannon-dtysky';

import {EModelEvents} from './types';
import {bindCameraControl, createNewModels, initEvents, createDefaultCamera, checkUpdate} from './script';

export {EModelEvents};

const preModels: Sein.SceneActor[] = [];

export async function main(canvas: HTMLCanvasElement): Promise<Sein.Game> {
  const engine = new Sein.Engine();

  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: new Sein.Color(.5, .5, .5, 1),
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      pixelRatio: window.devicePixelRatio
    }
  );

  engine.addGame(game);

  game.onError = (error: Sein.BaseException, details: any) => {
    game.event.trigger(EModelEvents.Error, {error, details});
  };
  game.addWorld('main', Sein.GameModeActor, Sein.LevelScriptActor);

  await game.start();
  const inspector = game.addActor('inspector', Sein.Inspector.Actor, {
    dom: document.getElementById('container'),
    updateRate: 10
  });
  game.world.enablePhysic(new Sein.CannonPhysicWorld(CANNON));
  game.resource.register('Audio', Sein.Audio.Loader);
  game.addActor('audioSystem', Sein.Audio.SystemActor);

  await initEvents(game);

  const loading = document.getElementById('loading');

  game.event.add(EModelEvents.New, async (sources: {name: string, url: string}[]) => {
    loading.style.display = 'block';
    const newModels = await createNewModels(game, sources, preModels);
    loading.style.display = 'none';
    preModels.slice(0, 0);
    game.event.trigger(EModelEvents.LoadStart);
    preModels.push(...newModels);
    game.event.trigger(EModelEvents.LoadEnd, {models: newModels});

    console.log(newModels);
  });

  game.event.add(EModelEvents.Loading, (state: {source: {name: string, url: string}}) => {
    loading.innerText = `Loading: ${state.source.name}`;
  });

  game.event.add(EModelEvents.LoadEnd, (params: any) => {
    const models = params.models as Sein.SceneActor[];
    let hasCamera = false;

    models.forEach(actor => {
      if (Sein.isPerspectiveCameraActor(actor) || Sein.isOrthographicCameraActor(actor)) {
        bindCameraControl(actor as Sein.PerspectiveCameraActor, models);
        hasCamera = true;
      }
    });

    if (!hasCamera) {
      createDefaultCamera(game, models);
    }

    inspector.syncVerticesInfo();
  });

  game.event.trigger(EModelEvents.New, [{name: 'scene.gltf', url: '/previewer/scene.gltf'}]);

  if (location.search.indexOf('qrcode=true') < 0) {
    checkUpdate();
  }

  return game;
}
