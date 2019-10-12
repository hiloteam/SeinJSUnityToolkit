using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioListenerExtension : Extension
    {
        public bool rotatable;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("rotatable", rotatable)
            );

            return new JProperty(Sein_audioListenerExtensionFactory.EXTENSION_NAME, value);
        }
    }
}
