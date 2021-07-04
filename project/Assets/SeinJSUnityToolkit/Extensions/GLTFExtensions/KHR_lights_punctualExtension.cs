/**
 * @File   : KHR_lights_punctualExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using UnityEngine;

namespace SeinJS
{
    public class KHR_lights_punctualExtension : Extension
    {
        public struct Light
        {
            public LightType type;
            public string name;
            public Color color;
            public float intensity;

            // point
            public float range;

            // spot
            public float innerConeAngle;
            public float outerConeAngle;

            // area
            public string mode;
            public Vector2 size;
        }

        public bool isGlobal = false;

        // in node extension
        public int lightIndex = -1;

        // in global extension
        public List<Light> lights = new List<Light>();

        public JProperty Serialize()
        {
            var value = new JObject();

            if (isGlobal)
            {
                var eLights = new JArray();
                value.Add("lights", eLights);

                foreach (var light in lights)
                {
                    var l = new JObject();

                    l.Add("name", light.name);
                    l.Add("intensity", light.intensity);
                    l.Add("color", new JArray { light.color.r, light.color.g, light.color.b });

                    if (light.type == LightType.Directional)
                    {
                        l.Add("type", "directional");
                    }
                    else if (light.type == LightType.Point)
                    {
                        l.Add("type", "point");
                        l.Add("range", light.range);
                    }
                    else if (light.type == LightType.Spot)
                    {
                        l.Add("type", "spot");
                        l.Add("range", light.range);
                        l.Add("innerConeAngle", light.innerConeAngle);
                        l.Add("outerConeAngle", light.outerConeAngle);
                    }
                    else if (light.type == LightType.Rectangle || light.type == LightType.Disc)
                    {
                        l.Add("type", "area");
                        l.Add("mode", light.mode);
                        l.Add("size", new JArray { light.size.x, light.size.y });
                    }

                    eLights.Add(l);
                }
            }
            else
            {
                value.Add("light", lightIndex);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(KHR_lights_punctualExtensionFactory)), value);
        }
    }
}
