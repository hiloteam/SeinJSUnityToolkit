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

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
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

            if (light.type == LightType.Directional)
            {

            }
            else if (light.type == LightType.Point)
            {
                l.range = light.range;
            }
            else if (light.type == LightType.Spot)
            {
                l.range = light.range;
                var spotAngleRad = light.spotAngle * (float)Math.PI / 180;
                spotAngleRad = spotAngleRad / 2;
                l.innerConeAngle = (spotAngleRad - (float)Math.PI / 180 * 5);
                l.outerConeAngle = spotAngleRad;
            }
            else if (light.type == LightType.Rectangle || light.type == LightType.Disc)
            {
                l.size = light.areaSize;
                l.mode = light.type == LightType.Rectangle ? "rect" : "disc";
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
                    var c = light.Value<JArray>("color");
                    l.color = new Color((float)c[0], (float)c[1], (float)c[2]);

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
                    } else if (type == "area")
                    {
                        l.mode = light.Value<string>("mode");
                        if (l.mode == "rect")
                        {
                            l.type = LightType.Rectangle;
                        } else
                        {
                            l.type = LightType.Disc;
                        }
                        var size = light.Value<JArray>("size");
                        l.size = new Vector2((float)size[0], (float)size[1]);
                    }

                    extension.lights.Add(l);
                }
            }
            else
            {
                extension.lightIndex = (int)extensionToken.Value["light"];
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var lightIndex = ((KHR_lights_punctualExtension)extension).lightIndex;
            var lights = (KHR_lights_punctualExtension)importer.root.Extensions[ExtensionName];

            var l = gameObject.AddComponent<Light>();
            var light = lights.lights[lightIndex];
            l.type = light.type;
            l.color = light.color;
            l.intensity = light.intensity;

            var type = light.type;
            if (type == LightType.Directional)
            {

            }
            else if (type == LightType.Point)
            {
                l.range = light.range;
            }
            else if (type == LightType.Spot)
            {
                l.range = light.range;
                l.spotAngle = light.outerConeAngle * 2 * 180 / (float)Math.PI;
            }
            else if (type == LightType.Rectangle || type == LightType.Disc)
            {
                l.areaSize = light.size;
            }

        }
    }
}
