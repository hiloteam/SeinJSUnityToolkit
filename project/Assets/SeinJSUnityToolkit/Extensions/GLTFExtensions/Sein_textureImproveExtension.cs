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
        // NORMAL: 5121
        // 4444: 32819
        public int textureType = 5121;
        public bool useMipmaps = true;

        public JProperty Serialize()
        {
            var res = new JObject(
                new JProperty("isImageCanRelease", isImageCanRelease),
                new JProperty("anisotropic", anisotropic),
                new JProperty("textureType", textureType)
            );

            if (!useMipmaps)
            {
                res.Add("useMapmaps", false);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_textureImproveExtensionFactory)), res);
        }
    }
}
