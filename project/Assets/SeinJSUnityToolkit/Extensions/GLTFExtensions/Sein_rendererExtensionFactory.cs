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
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(MeshRenderer) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var extension = new Sein_rendererExtension();
            var mr = component as MeshRenderer;

            var lightmapIndex = mr.lightmapIndex;
            if (ExporterSettings.Lighting.lightMap && lightmapIndex > -1)
            {
                Vector4 lightmapScaleOffset = mr.lightmapScaleOffset;
                var lightData = LightmapSettings.lightmaps[lightmapIndex];
                var lightTexture = lightData.lightmapColor;
                var lightTextureIndex = entry.SaveTextureHDR(lightTexture, ExporterSettings.Lighting.lightMapType, ExporterSettings.Lighting.lightMapSize);
                extension.uvScale = new Vector2(lightmapScaleOffset.x, lightmapScaleOffset.y);
                extension.uvOffset = new Vector2(lightmapScaleOffset.z, lightmapScaleOffset.w);
                extension.lightMapIndex = lightTextureIndex.Id;
            }

            extension.castShadows = mr.shadowCastingMode == UnityEngine.Rendering.ShadowCastingMode.On;
            extension.receiveShadows = mr.receiveShadows;
            extension.gammaCorrection = PlayerSettings.colorSpace == ColorSpace.Linear;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            //todo: complete
            return new Sein_rendererExtension();
        }
    }
}
