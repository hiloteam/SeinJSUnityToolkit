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
        public new static string EXTENSION_NAME = "Sein_audioListener";
        public new static List<Type> BINDED_COMPONENTS = new List<Type> { typeof(SeinAudioListener) };

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null)
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
    }
}
