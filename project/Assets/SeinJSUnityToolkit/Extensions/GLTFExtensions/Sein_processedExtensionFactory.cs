/**
 * @File   : Sein_processedExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/10 0:00:00PM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEditor;
using UnityEngine;

namespace SeinJS
{
    public class Sein_processedExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "SEIN_processed"; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var ext = new Sein_processedExtension {
                options = options == null ? new ProcessedExtOptions() : (ProcessedExtOptions)options
            };
            AddExtension(extensions, ext);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new Sein_processedExtension();
        }
    }
}
