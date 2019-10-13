/**
 * @File   : KHR_lights_punctualExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class KHR_lights_punctualExtensionFactory : SeinExtensionFactory
    {
        public new static string EXTENSION_NAME = "KHR_lights_punctual";
        public new static List<Type> BINDED_COMPONENTS = new List<Type> { typeof(Light) };

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null)
        {
            var light = component as Light;
            if (ExporterSettings.Lighting.lightMap && light.bakingOutput.isBaked)
            {
                return;
            }

            KHR_lights_punctualExtension globalExtension;
            if (!entry.root.Extensions.ContainsKey(ExtensionName))
            {
                globalExtension = new KHR_lights_punctualExtension();
                globalExtension.isGlobal = true;
                AddExtension(entry.root.Extensions, globalExtension);
            }
            else
            {
                globalExtension = (KHR_lights_punctualExtension)extensions["KHR_lights_punctual"];
            }

            var l = new KHR_lights_punctualExtension.Light();
            l.type = light.type;
            l.name = light.name;
            l.intensity = light.intensity;
            l.color = light.color;
            l.range = light.range;

            if (light.type == LightType.Directional)
            {

            }
            else if (light.type == LightType.Point)
            {
                l.range = light.range;
            }
            else if (light.type == LightType.Spot)
            {
                var spotAngleRad = light.spotAngle * (float)Math.PI / 180;
                spotAngleRad = spotAngleRad / 2;
                l.innerConeAngle = (spotAngleRad - (float)Math.PI / 180 * 5);
                l.outerConeAngle = spotAngleRad;
            }
            else
            {
                throw new Exception("Only support light type 'directional', 'point' or 'spot' now!");
            }

            globalExtension.lights.Add(l);

            var extension = new KHR_lights_punctualExtension();
            extension.lightIndex = globalExtension.lights.Count - 1;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new KHR_lights_punctualExtension();
        }
    }
}
