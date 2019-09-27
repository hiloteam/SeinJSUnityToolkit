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
        public abstract string EXTENSION_NAME { get; }
        public abstract List<Type> BINDED_COMPONENTS { get; }

        public void Init()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public void Awake(ExporterEntry entry)
        {
            entry.AddExtension(ExtensionName);
        }

        public void AddExtension(Dictionary<string, Extension> extensions, Extension extension)
        {
            extensions.Add(ExtensionName, extension);
        }

        public abstract Extension Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null);

        /*
         * @todo: import entry
         */
        public virtual void Import(Extension extension) { }
        public virtual void Import(GameObject gameObject, Extension extension) { }
        public virtual void Import(UnityEngine.Material material, Extension extension) { }
        public virtual void Import(UnityEngine.Mesh material, Extension extension) { }
    }
}
