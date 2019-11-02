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
        public bool useHDR = false;
        public float exposure = 0;
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
                var lm = new JObject(
                    new JProperty("uvChannel", uvChannel),
                    new JProperty("uvRotation", uvRotation),
                    new JProperty("uvScale", new JArray { uvScale.x, uvScale.y }),
                    new JProperty("uvOffset", new JArray { uvOffset.x, uvOffset.y }),
                    new JProperty("lightMapIndex", lightMapIndex)
                );

                if (aoMapIndex >= 0)
                {
                    lm.Add("aoMapIndex", aoMapIndex);
                }

                value.Add("lightMap", lm);
            }

            if (useHDR)
            {
                value.Add("useHDR", useHDR);
            }

            if (exposure != 0)
            {
                value.Add("exposure", exposure);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_rendererExtensionFactory)), value);
        }
    }
}
