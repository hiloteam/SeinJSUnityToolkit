using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_animatorExtension : Extension
    {
        public string[] modelAnimations;
        public string defaultAnimation;
        public string prefix = null;

        public JProperty Serialize()
        {
            var value = new JObject(
                new JProperty("defaultAnimation", defaultAnimation),
                new JProperty("modelAnimations", new JArray(modelAnimations))
            );

            if (prefix != null && prefix != "")
            {
                value.Add("prefix", prefix);
            }

            return new JProperty(Sein_animatorExtensionFactory.EXTENSION_NAME, value);
        }
    }
}
