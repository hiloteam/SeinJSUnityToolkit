using GLTF.Schema;
using Newtonsoft.Json.Linq;

namespace SeinJS
{
	public class KHR_materials_unlit: Extension
	{
        public static string ExtensionName = "KHR_materials_unlit";

        public JProperty Serialize()
		{
			return new JProperty("", "");
		}
	}
}
