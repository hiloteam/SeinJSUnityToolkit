/**
 * @File   : Sein_rendererExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/10 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_rendererExtension : Extension
    {
        public int lightMapIndex = -1;
        public int aoMapIndex = -1;
        public int uvChannel = 1;
        public int uvRotation = 0;
        public Vector2 uvScale;
        public Vector2 uvOffset;
        public bool castShadows;
        public bool receiveShadows;
        public bool gammaCorrection;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("castShadows", castShadows),
                new JProperty("receiveShadows", receiveShadows),
                new JProperty("gammaCorrection", gammaCorrection)
            );

            if (lightMapIndex >= 0)
            {
                value.Add("uvChannel", uvChannel);
                value.Add("uvRotation", uvRotation);
                value.Add("uvScale", new JArray { uvScale.x, uvScale.y });
                value.Add("uvOffset", new JArray { uvOffset.x, uvOffset.y });
                value.Add("lightMapIndex", lightMapIndex);

                if (aoMapIndex >= 0)
                {
                    value.Add("aoMapIndex", aoMapIndex);
                }
            }

            return new JProperty(Sein_rendererExtensionFactory.EXTENSION_NAME, value);
        }
    }
}
