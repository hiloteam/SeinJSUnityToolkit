/**
 * @File   : SeinExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using System;
using UnityEngine;
using GLTF.Schema;
using System.Collections.Generic;

namespace SeinJS
{
	public abstract class SeinExtensionFactory: ExtensionFactory
	{
        public static string EXTENSION_NAME;
        public static List<Type> BINDED_COMPONENTS;

        public List<Type> BindedComponents;

        public void Init()
        {
            ExtensionName = EXTENSION_NAME;
            BindedComponents = BINDED_COMPONENTS;
        }

        public void Awake(ExporterEntry entry)
        {
            entry.AddExtension(ExtensionName);
        }

        public void AddExtension(Dictionary<string, Extension> extensions, Extension extension)
        {
            extensions.Add(ExtensionName, extension);
        }

        public abstract void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null);

        /*
         * @todo: import entry
         */
        public virtual void Import(GLTFRoot root, Extension extension) { }
        public virtual void Import(GLTFRoot root, GameObject gameObject, Extension extension) { }
        public virtual void Import(GLTFRoot root, UnityEngine.Material material, Extension extension) { }
        public virtual void Import(GLTFRoot root, UnityEngine.Mesh material, Extension extension) { }
    }
}
