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
        public bool isGlobal = false;
        // global extension
        public bool gammaCorrection = false;
        public bool useHDR = false;
        public float exposure = 0;

        // node extension
        public int lightMapIndex = -1;
        public int aoMapIndex = -1;
        public int uvChannel = 1;
        public int uvRotation = 0;
        public Vector2 uvScale;
        public Vector2 uvOffset;
        public bool castShadows;
        public bool receiveShadows;

        public JProperty Serialize()
        {
            JObject value;

            if (isGlobal)
            {
                value = new JObject(
                    new JProperty("gammaCorrection", gammaCorrection),
                    new JProperty("useHDR", useHDR),
                    new JProperty("exposure", exposure)
                );
            }
            else
            {
                value = new JObject(
                    new JProperty("castShadows", castShadows),
                    new JProperty("receiveShadows", receiveShadows)
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
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_rendererExtensionFactory)), value);
        }
    }
}
