/**
 * @File   : Sein_spriteExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/10 0:00:00AM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_spriteExtension : Extension
    {
        public float width;
        public float height;
        public int atlasId;
        public string frameName;
        public bool isBillboard;
        public bool frustumTest;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("width", width),
                new JProperty("height", height),
                new JProperty("atlas", new JObject(
                    new JProperty("index", atlasId),
                    new JProperty("frameName", frameName)
                )),
                new JProperty("isBillboard", isBillboard),
                new JProperty("frustumTest", frustumTest)
            );

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_spriteExtensionFactory)), value);
        }
    }
}
