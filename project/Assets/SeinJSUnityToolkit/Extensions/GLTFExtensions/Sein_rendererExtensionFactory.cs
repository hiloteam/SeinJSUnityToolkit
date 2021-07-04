/**
 * @File   : Sein_rendererExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/10 0:00:00PM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEditor;
using UnityEngine;

namespace SeinJS
{
    public class Sein_rendererExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_renderer"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(MeshRenderer), typeof(SkinnedMeshRenderer) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            Sein_rendererExtension extension;

            if (component == null)
            {
                extension = new Sein_rendererExtension {
                    isGlobal = true,
                    gammaCorrection = PlayerSettings.colorSpace == ColorSpace.Linear,
                    //@todo: support hdr
                    useHDR = false,
                    exposure = 0
                };
            }
            else
            {
                extension = new Sein_rendererExtension { isGlobal = false };
                var mr = component as Renderer;

                var lightmapIndex = mr.lightmapIndex;
                if (ExporterSettings.Lighting.lightMap && lightmapIndex > -1)
                {
                    Vector4 lightmapScaleOffset = mr.lightmapScaleOffset;
                    var lightData = LightmapSettings.lightmaps[lightmapIndex];
                    var lightTexture = lightData.lightmapColor;
                    var lightTextureIndex = entry.SaveTexture(lightTexture, maxSize: ExporterSettings.Lighting.lightMapSize);
                    extension.uvScale = new Vector2(lightmapScaleOffset.x, lightmapScaleOffset.y);
                    extension.uvOffset = new Vector2(lightmapScaleOffset.z, lightmapScaleOffset.w);
                    extension.lightMapIndex = lightTextureIndex.Id;
                }

                extension.castShadows = mr.shadowCastingMode == UnityEngine.Rendering.ShadowCastingMode.On;
                extension.receiveShadows = mr.receiveShadows;
            }

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_rendererExtension();

            if (extensionToken.Value["castShadows"] == null)
            {
                extension.gammaCorrection = (bool)extensionToken.Value["gammaCorrection"];
                extension.useHDR = (bool)extensionToken.Value["useHDR"];
                extension.exposure = (float)extensionToken.Value["exposure"];
            }
            else
            {
                extension.castShadows = (bool)extensionToken.Value["castShadows"];
                extension.receiveShadows = (bool)extensionToken.Value["receiveShadows"];
            }

            return new Sein_rendererExtension();
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var mr = gameObject.GetComponent<Renderer>();
            var r = (Sein_rendererExtension)extension;

            if (mr != null)
            {
                mr.shadowCastingMode = r.castShadows ? UnityEngine.Rendering.ShadowCastingMode.On : UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows = r.receiveShadows;
            }
        }
    }
}
