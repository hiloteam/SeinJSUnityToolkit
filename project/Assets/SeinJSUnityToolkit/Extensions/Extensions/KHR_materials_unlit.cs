/**
 * @File   : KHR_materials_unlit.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;

namespace SeinJS
{
	public class KHR_materials_unlit: Extension
	{
        public JProperty Serialize()
		{
			return new JProperty(KHR_materials_unlitFactory.EXTENSION_NAME, new JObject());
		}
	}
}
