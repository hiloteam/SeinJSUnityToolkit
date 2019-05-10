using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_animatorListenerExtension : Extension
    {
        public string[] modelAnimations;
        public string defaultAnimation;

        public Sein_animatorListenerExtension(
            string[] modelAnimations,
            string defaultAnimation
        )
        {
            this.modelAnimations = modelAnimations;
            this.defaultAnimation = defaultAnimation;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
