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
	public class KHR_materials_unlitFactory: SeinExtensionFactory
    {
        public override string EXTENSION_NAME {
            get { return "KHR_materials_unlit";}
        }
        public override List<Type> BINDED_COMPONENTS {
            get { return new List<Type>(); }
        }

        public override Extension Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null)
        {
            var extension = new KHR_materials_unlit();

            AddExtension(extensions, new KHR_materials_unlit());

            return extension;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new KHR_materials_unlit();
        }
    }
}
