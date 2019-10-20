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
    public enum EExtensionType
    {
        Node,
        Material,
        Mesh,
        Image,
        Texture,
        Animation,
        Accessor,
        BufferView,
        Buffer,
        Global
    }

	public abstract class SeinExtensionFactory: ExtensionFactory
	{
        public List<Type> BindedComponents;
        public List<EExtensionType> ExtensionTypes;

        public virtual string GetExtensionName()
        {
            return "";
        }

        public virtual List<Type> GetBindedComponents() {
            return new List<Type>();
        }

        public virtual List<EExtensionType> GetExtensionTypes()
        {
            return new List<EExtensionType> { EExtensionType.Node };
        }

        public virtual void BeforeExport()
        {

        }

        public virtual void Awake(ExporterEntry entry)
        {
            entry.AddExtension(ExtensionName);
        }

        public void AddExtension(Dictionary<string, Extension> extensions, Extension extension)
        {
            extensions.Add(ExtensionName, extension);
        }

        public virtual void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null) { }

        /*
         * @todo: import entry
         */
        public virtual void Import(GLTFRoot root, Extension extension) { }
        public virtual void Import(GLTFRoot root, GameObject gameObject, Extension extension) { }
        public virtual void Import(GLTFRoot root, UnityEngine.Material material, Extension extension) { }
        public virtual void Import(GLTFRoot root, UnityEngine.Mesh mesh, Extension extension) { }
        public virtual void Import(GLTFRoot root, Texture2D texture, Extension extension) { }
    }
}
