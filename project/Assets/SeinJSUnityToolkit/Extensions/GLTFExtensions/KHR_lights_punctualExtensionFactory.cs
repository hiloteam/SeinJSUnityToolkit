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
        public override string GetExtensionName() { return "KHR_lights_punctual"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(Light) }; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Node, EExtensionType.Global }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var light = component as Light;
            if (ExporterSettings.Lighting.lightMap && light.bakingOutput.isBaked)
            {
                return;
            }

            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
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
                globalExtension = (KHR_lights_punctualExtension)entry.root.Extensions["KHR_lights_punctual"];
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
            var extension = new KHR_lights_punctualExtension();

            if (extensionToken == null)
            {
                return null;
            }

            extension.isGlobal = extensionToken.Value["lights"] != null;

            if (extension.isGlobal)
            {
                foreach(var light in extensionToken.Value["lights"])
                {
                    var l = new KHR_lights_punctualExtension.Light();

                    var type = light.Value<string>("type");
                    l.name = light.Value<string>("name");
                    l.intensity = light.Value<float>("intensity");
                    var c = light.Value<float[]>("color");
                    l.color = new Color(c[0], c[1], c[2]);

                    if (type == "directional")
                    {
                        l.type = LightType.Directional;
                    }
                    else if (type == "point")
                    {
                        l.type = LightType.Point;
                        l.range = light.Value<float>("range");
                    }
                    else if (type == "spot")
                    {
                        l.type = LightType.Spot;
                        l.range = light.Value<float>("range");
                        l.innerConeAngle = light.Value<float>("innerConeAngle");
                        l.outerConeAngle = light.Value<float>("outerConeAngle");
                    }

                }
            }
            else
            {
                extension.lightIndex = (int)extensionToken.Value["light"];
            }

            return extension;
        }
    }
}
