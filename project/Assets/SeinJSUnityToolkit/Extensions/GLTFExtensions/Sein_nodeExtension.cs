using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

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

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("selfType", selfType),
                new JProperty("childrenType", childrenType),
                new JProperty("className", className),
                new JProperty("tag", tag),
                new JProperty("layer", layer),
                new JProperty("emitComponentsDestroy", emitComponentsDestroy),
                new JProperty("updateOnEverTick", updateOnEverTick),
                new JProperty("isStatic", isStatic),
                new JProperty("skipThisNode", skipThisNode)
            );

            return new JProperty(Sein_nodeExtensionFactory.EXTENSION_NAME, value);
        }
    }
}
