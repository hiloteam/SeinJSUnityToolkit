/**
 * @File   : Sein_atlasExtension.cs
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
    public class Sein_atlasExtension : Extension
    {
        public struct Atlas
        {
            public JObject json; 
        }

        public List<Atlas> atlases = new List<Atlas>();

        public JProperty Serialize()
        {
            var value = new JArray();

            foreach (var atlas in atlases)
            {
                value.Add(atlas.json);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_atlasExtensionFactory)), new JObject(
                new JProperty("atlases", value)
            ));
        }
    }
}