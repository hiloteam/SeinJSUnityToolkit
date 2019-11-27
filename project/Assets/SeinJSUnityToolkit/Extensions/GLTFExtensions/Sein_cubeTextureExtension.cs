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
    public class CubeTextureId : GLTF.Schema.GLTFId<CubeTexture>
    {
        public override CubeTexture Value
        {
            get
            {
                var ext = (Sein_cubeTextureExtension)Root.Extensions[ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory))];
                return ext.textures[Id];
            }
        }
    }

    public class CubeTextureSaveOptions
    {
        public int maxSize = -1;
        public bool hasTransparency = false;
        public string path = null;
        public EHDRTextureType hdrType = EHDRTextureType.DEFAULT;
        // 6 side
        public Texture2D[] textures = null;
        public SamplerId sampler;
    }

    public class CubeTexture
    {
        public ImageId[] images;
        public SamplerId sampler;
        public bool isImageCanRelease;
    }

    public class Sein_cubeTextureExtension : Extension
    {
        public List<CubeTexture> textures = new List<CubeTexture>();

        public JProperty Serialize()
        {
            var value = new JArray();

            foreach (var tex in textures)
            {
                var images = new int[6];
                for (var i = 0; i < 6; i += 1)
                {
                    images[i] = tex.images[i].Id;
                }
                value.Add(new JObject(
                    new JProperty("images", JArray.FromObject(images)),
                    new JProperty("sampler", tex.sampler.Id),
                    new JProperty("isImageCanRelease", tex.isImageCanRelease)
                ));
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory)), new JObject(
                new JProperty("textures", value)
            ));
        }
    }
}