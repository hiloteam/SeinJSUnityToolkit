/**
 * @File   : Sein_textureImproveExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/13 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_textureImproveExtension : Extension
    {
        public bool isImageCanRelease = false;
        public int anisotropic = 1;

        public JProperty Serialize()
        {
            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_textureImproveExtensionFactory)), new JObject(
                new JProperty("isImageCanRelease", isImageCanRelease),
                new JProperty("anisotropic", anisotropic)
            ));
        }
    }
}
