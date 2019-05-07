using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_audioListenerExtension : Extension
    {
        public bool rotatable = false;

        public Sein_audioListenerExtension(bool rotatable)
        {
            this.rotatable = rotatable;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
