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

function BasicMaterial({
  uniforms,
  options,
  ...opts
}) {
  const lt = uniforms.lightType.value;
  const lightType: any = lt === 0 ? 'NONE' : lt === 1 ? 'PHONE' : lt === 2 ? 'BLINN-PHONE' : 'LAMBERT';

  console.log(lightType)

  return new Sein.BasicMaterial({
    lightType,
    diffuse: (uniforms.u_diffuseMap || uniforms.u_diffuse || {}).value,
    ambient: (uniforms.u_ambientMap || {}).value,
    specular: (uniforms.u_specularMap || uniforms.u_specular || {}).value,
    normalMap: (uniforms.u_normalMap || {}).value,
    normalMapScale: (uniforms.u_normalMapScale || {}).value,
    emission: (uniforms.u_emissionMap || uniforms.u_emission || {}).value,
    shininess: (uniforms.u_shininess || {}).value,
    reflectivity: (uniforms.u_reflectivity || {}).value,
    refractivity: (uniforms.u_refractivity || {}).value,
    refractRatio: (uniforms.u_refractRatio || {}).value,
    ...opts
  });
}

(Sein as any).BasicMaterial.prototype.initCommonOptions = () => {}
(Sein as any).MetaSMaterials['BasicMaterial'] = BasicMaterial;


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

      actor.findComponentsByClass(Sein.StaticMeshComponent).forEach(c => {
        // c.material.useHDR = false;
        c.material.exposure = 1.5;
        c.material.gammaCorrection = true;
      });
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
