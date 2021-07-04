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
        Camera,
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

        public virtual void FinishExport()
        {

        }

        public virtual void BeforeImport()
        {

        }

        public virtual void FinishImport()
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

        public virtual void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null) { }

        /*
         * @todo: import entry
         */
        public virtual void Import(EditorImporter importer, Extension extension) { }
        public virtual void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension) { }
        public virtual void Import(EditorImporter importer, UnityEngine.Material material, GLTF.Schema.Material gltfMat, Extension extension) { }
        public virtual void Import(EditorImporter importer, UnityEngine.Mesh mesh, GLTF.Schema.Mesh gltfMesh, Extension extension) { }
        public virtual void Import(EditorImporter importer, Texture2D texture, GLTF.Schema.Texture gltfTex, Extension extension) { }
    }
}
