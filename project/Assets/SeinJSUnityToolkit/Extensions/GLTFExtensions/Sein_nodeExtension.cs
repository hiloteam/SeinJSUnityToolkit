/**
 * @File   : Sein_nodeExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json.Linq;

namespace SeinJS
{
    public class Sein_nodeExtension : Extension
    {
        public ESeinNodeType selfType;
        public ESeinNodeType childrenType;
        public string className;
        public string tag;
        public int layer;
        public bool persistent;
        public bool emitComponentsDestroy;
        public bool updateOnEverTick;
        public bool isStatic;
        public bool skipThisNode;
        public JObject initOptions;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("selfType", selfType),
                new JProperty("childrenType", childrenType),
                new JProperty("className", className),
                new JProperty("tag", tag),
                new JProperty("layer", layer),
                new JProperty("persistent", persistent),
                new JProperty("emitComponentsDestroy", emitComponentsDestroy),
                new JProperty("updateOnEverTick", updateOnEverTick),
                new JProperty("isStatic", isStatic),
                new JProperty("skipThisNode", skipThisNode)
            );

            if (initOptions != null)
            {
                value.Add("initOptions", initOptions);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_nodeExtensionFactory)), value);
        }
    }
}
