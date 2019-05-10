using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_nodeExtensionFactory : ExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_node";

        public Sein_nodeExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            ESeinNodeType selfType = ESeinNodeType.Actor;
            ESeinNodeType childrenType = ESeinNodeType.Component;
            string className = "";
            string tag = "";
            int layer = 268435455;
            bool persistent = false;
            bool emitComponentsDestroy = true;
            bool updateOnEverTick = true;
            bool isStatic = false;
            bool skipThisNode = false;

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
                selfType = (int)extensionToken.Value["selfType"] == 1 ? ESeinNodeType.Component : ESeinNodeType.Actor;
                childrenType = (int)extensionToken.Value["childrenType"] == 1 ? ESeinNodeType.Component : ESeinNodeType.Actor;
                className = (string)extensionToken.Value["className"];
                tag = (string)extensionToken.Value["tag"];
                if (extensionToken.Value["layer"] != null)
                {
                    layer = (int)extensionToken.Value["layer"];
                }
                persistent = (bool)extensionToken.Value["persistent"];
                updateOnEverTick = (bool)extensionToken.Value["updateOnEverTick"];
                if (extensionToken.Value["isStatic"] != null)
                {
                    isStatic = (bool)extensionToken.Value["isStatic"];
                }
                skipThisNode = (bool)extensionToken.Value["skipThisNode"];
            }

            return new Sein_nodeExtension(selfType, childrenType, className, tag, layer, persistent, emitComponentsDestroy, updateOnEverTick, isStatic, skipThisNode);
        }
    }
}
