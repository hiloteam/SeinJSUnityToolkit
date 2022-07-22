/**
 * @File   : Sein_processedExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/10 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_processedExtension : Extension
    {
        public JProperty Serialize()
        {
            return new JProperty(
                ExtensionManager.GetExtensionName(typeof(Sein_processedExtensionFactory)),
                new JObject()
            );
        }
    }
}
