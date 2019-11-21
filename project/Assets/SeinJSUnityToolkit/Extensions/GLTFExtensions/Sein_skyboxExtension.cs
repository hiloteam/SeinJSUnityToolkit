/**
 * @File   : Sein_skyboxExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/19 0:00:00AM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public enum ESkyboxType {
        Color,
        Cube,
        Panoramic
    }

    public class Sein_skyboxExtension : Extension
    {
        
        public ESkyboxType type;

        // color, panoramic, cubemap
        public float factor;
        public GLTF.Math.Color color;

        // cubemap, panoramic
        public int textureId;
        public float rotation;
        public float exposure;

        // panoramic
        public int degrees;

        //@todo: procedural

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("type", type.ToString()),
                new JProperty("factor", factor)
            );

            if (color != null)
            {
                value.Add("color", JArray.FromObject(new float[] {
                    color.R,
                    color.G,
                    color.B,
                    color.A
                }));
            }

            if (type == ESkyboxType.Color)
            {
            }
            else if (type == ESkyboxType.Cube)
            {
                value.Add("texture", new JObject(new JProperty("index", textureId)));
                value.Add("rotation", rotation);
                value.Add("exposure", exposure);
            } else if (type == ESkyboxType.Panoramic)
            {
                value.Add("texture", new JObject(new JProperty("index", textureId)));
                value.Add("rotation", rotation);
                value.Add("exposure", exposure);
                value.Add("degrees", degrees);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_skyboxExtensionFactory)), value);
        }
    }
}