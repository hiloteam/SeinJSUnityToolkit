/**
 * @File   : Sein_audioListenerExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
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
    public class Sein_audioListenerExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_audioListener"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinAudioListener) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var extension = new Sein_audioListenerExtension();
            var listener = component as SeinAudioListener;

            extension.rotatable = listener.rotatable;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_audioListenerExtension();

            if (extensionToken != null)
            {
                extension.rotatable = (bool)extensionToken.Value["rotatable"];
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var source = (Sein_audioListenerExtension)extension;
            var audioSource = gameObject.AddComponent<SeinAudioListener>();
            audioSource.rotatable = source.rotatable;
        }
    }
}
