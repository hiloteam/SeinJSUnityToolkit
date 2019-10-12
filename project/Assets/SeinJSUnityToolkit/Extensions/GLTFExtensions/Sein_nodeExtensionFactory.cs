using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;

namespace SeinJS
{
    public class Sein_nodeExtensionFactory : SeinExtensionFactory
    {
        public new static string EXTENSION_NAME = "Sein_node";
        public new static List<Type> BINDED_COMPONENTS = new List<Type> { typeof(SeinNode) };

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null)
        {
            var extension = new Sein_nodeExtension();
            var node = component as SeinNode;

            extension.selfType = node.selfType;
            extension.childrenType = node.childrenType;
            extension.className = node.className;
            extension.tag = node.tag;
            extension.layer = node.layer;
            extension.persistent = node.persistent;
            extension.emitComponentsDestroy = node.emitComponentsDestroy;
            extension.updateOnEverTick = node.updateOnEverTick;
            extension.isStatic = node.isStatic;
            extension.skipThisNode = node.skipThisNode;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_nodeExtension();

            if (extensionToken != null)
            {
                extension.selfType = (int)extensionToken.Value["selfType"] == 1 ? ESeinNodeType.Component : ESeinNodeType.Actor;
                extension.childrenType = (int)extensionToken.Value["childrenType"] == 1 ? ESeinNodeType.Component : ESeinNodeType.Actor;
                extension.className = (string)extensionToken.Value["className"];
                extension.tag = (string)extensionToken.Value["tag"];
                if (extensionToken.Value["layer"] != null)
                {
                    extension.layer = (int)extensionToken.Value["layer"];
                }
                extension.persistent = (bool)extensionToken.Value["persistent"];
                extension.updateOnEverTick = (bool)extensionToken.Value["updateOnEverTick"];
                if (extensionToken.Value["isStatic"] != null)
                {
                    extension.isStatic = (bool)extensionToken.Value["isStatic"];
                }
                extension.skipThisNode = (bool)extensionToken.Value["skipThisNode"];
            }

            return extension;
        }
    }
}
