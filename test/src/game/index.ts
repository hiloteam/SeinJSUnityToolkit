/**
 * @File   : main.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: main.
 */
import * as Sein from 'seinjs';
import * as CANNON from 'cannon-dtysky';

import {EModelEvents} from './types';
import {createCamera, createLights, createNewModels, initEvents} from './script';

export {EModelEvents};

const preModels: Sein.SceneActor[] = [];

export async function main(canvas: HTMLCanvasElement): Promise<Sein.Game> {
  const engine = new Sein.Engine();

  const game = new Sein.Game(
    'intro-game',
    {
      canvas,
      clearColor: new Sein.Color(0, .6, .9, 1),
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
  game.world.enablePhysic(new Sein.CannonPhysicWorld(CANNON));

  await initEvents(game);
  await createCamera(game);
  await createLights(game);

  game.event.add(EModelEvents.New, async (sources: {name: string, url: string}[]) => {
    const newModels = await createNewModels(game, sources, preModels);
    preModels.slice(0, 0);
    game.event.trigger(EModelEvents.LoadStart);
    preModels.push(...newModels);
    game.event.trigger(EModelEvents.LoadEnd, {models: newModels});

    console.log(newModels);
  });

  game.event.add(EModelEvents.LoadEnd, (params: any) => {
    const models = params.models as Sein.SceneActor[];

    models.forEach(m => {
      if (m.animator) {
        createFaker(m as Sein.SceneActor, game.world);
        console.log(m.animator);
        m.animator.play(null, Infinity);
      }
    })
  });

  // test
  game.event.trigger(EModelEvents.New, [{name: 'miku.gltf', url: require('assets/scene.gltf')}]);

  return game;
}

function createFaker(actor: Sein.SceneActor, world: Sein.World) {
  const faker = world.addActor('faker', Sein.SceneActor);
  faker.transform.matrix.copy(actor.transform.matrix);

  const keys = Object.keys((actor.root.hiloNode.anim as any).nodeNameMap) as string[];
  keys.forEach(key => {
    faker.addComponent(key, Sein.BSPSphereComponent, {
      material: new Sein.BasicMaterial({diffuse: new Sein.Color(1, 0, 0)}),
      radius: .1
    })
  });

  console.log(faker.findComponentsByFilter(c => Sein.isComponent(c)));

  faker.onUpdate = () => {
    keys.forEach(key => {
      faker.findComponentByName<Sein.SceneComponent>(key).matrix.copy(
        (actor.root.hiloNode.anim as any).nodeNameMap[key].matrix
      );
    });
  }
}
