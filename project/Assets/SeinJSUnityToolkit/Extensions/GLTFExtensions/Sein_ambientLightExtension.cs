/**
 * @File   : KHR_materials_unlit.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/13 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
	public class Sein_ambientLightExtension: Extension
	{
        public float intensity = 0;
        public Color color;

        public JProperty Serialize()
		{
			return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_ambientLightExtensionFactory)), new JObject(
                new JProperty("intensity", intensity),
                new JProperty("color", new JArray{ color.r, color.g, color.b })
            ));
		}
	}
}
