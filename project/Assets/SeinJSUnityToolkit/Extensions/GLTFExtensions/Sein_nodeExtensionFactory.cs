/**
 * @File   : Sein_nodeExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;

namespace SeinJS
{
    public class Sein_nodeExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_node"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinNode) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
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

            var com = node.GetComponent<SeinNodeClass>();
            if (com != null)
            {
                extension.initOptions = com.Serialize(entry, extension);
            }

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

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var n = (Sein_nodeExtension)extension;
            var seinNode = gameObject.AddComponent<SeinNode>();
            seinNode.selfType = n.selfType;
            seinNode.className = n.className;
            seinNode.tag = n.tag;
            seinNode.layer = n.layer;
            seinNode.persistent = n.persistent;
            seinNode.emitComponentsDestroy = n.emitComponentsDestroy;
            seinNode.updateOnEverTick = n.updateOnEverTick;
            seinNode.isStatic = n.isStatic;
            seinNode.skipThisNode = n.skipThisNode;
        }
    }
}
