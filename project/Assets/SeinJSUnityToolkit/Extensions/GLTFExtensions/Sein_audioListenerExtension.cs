/**
 * @File   : Sein_audioListenerExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioListenerExtension : Extension
    {
        public bool rotatable;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("rotatable", rotatable)
            );

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_audioListenerExtensionFactory)), value);
        }
    }
}
