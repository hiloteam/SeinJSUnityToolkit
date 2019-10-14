/**
 * @File   : KHR_materials_unlit.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/08 0:00:00AM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_customMaterialExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_customMaterial"; }
        public override List<Type> GetBindedComponents() { return new List<Type>(); }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var material = component as SeinCustomMaterial;
            var extension = new Sein_customMaterialExtension();

            

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new Sein_customMaterialExtension();
        }
    }
}
