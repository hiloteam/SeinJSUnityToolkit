/**
 * @File   : KHR_materials_unlitFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
	public class KHR_materials_unlitExtensionFactory: SeinExtensionFactory
    {
        public override string GetExtensionName() { return "KHR_materials_unlit"; }
        public override List<Type> GetBindedComponents() { return new List<Type>(); }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Material }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var extension = new KHR_materials_unlitExtension();

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new KHR_materials_unlitExtension();
        }

        public override void Import(EditorImporter importer, UnityEngine.Material material, GLTF.Schema.Material gltfMat, Extension extension)
        {
            if (material.HasProperty("unlit"))
            {
                material.SetInt("unlit", 1);
            }
        }
    }
}
