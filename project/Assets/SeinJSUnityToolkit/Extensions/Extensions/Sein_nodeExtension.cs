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
        public new string tag;
        public int layer;
        public bool persistent;
        public bool emitComponentsDestroy;
        public bool updateOnEverTick;
        public bool isStatic;
        public bool skipThisNode;

        public Sein_nodeExtension(
            ESeinNodeType selfType,
            ESeinNodeType childrenType,
            string className,
            string tag,
            int layer,
            bool persistent,
            bool emitComponentsDestroy,
            bool updateOnEverTick,
            bool isStatic,
            bool skipThisNode
        )
        {
            this.selfType = selfType;
            this.childrenType = childrenType;
            this.className = className;
            this.tag = tag;
            this.layer = layer;
            this.persistent = persistent;
            this.emitComponentsDestroy = emitComponentsDestroy;
            this.updateOnEverTick = updateOnEverTick;
            this.isStatic = isStatic;
            this.skipThisNode = skipThisNode;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
