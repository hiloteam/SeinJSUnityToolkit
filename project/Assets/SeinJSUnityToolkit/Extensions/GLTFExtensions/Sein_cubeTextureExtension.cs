/**
 * @File   : Sein_cubeTextureExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/19 0:00:00AM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using UnityEngine;

namespace SeinJS
{
    public class CubeTextureSaveOptions
    {
        public int maxSize = -1;
        public bool useHDR = false;
        public EHDRTextureType hdrType = EHDRTextureType.RGBD;
        // 6 side
        public Texture2D[] textures = null;
    }

    public class Sein_cubeTextureExtension : Extension
    {
        
        public ImageId[] images;

        public JProperty Serialize()
        {
            var value = new JArray();

            foreach (var image in images)
            {
                value.Add(image.Id);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory)), new JObject(
                new JProperty("images", value)
            ));
        }
    }
}