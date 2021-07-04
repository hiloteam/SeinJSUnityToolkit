/**
 * @File   : ExtensionManager.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;
using GLTF.Schema;

namespace SeinJS
{
	public class ExtensionManager
	{
        public static Dictionary<Type, List<string>> Component2Extensions = new Dictionary<Type, List<string>>();
        public static Dictionary<Type, string> Class2Extensions = new Dictionary<Type, string>();
		public static Dictionary<string, SeinExtensionFactory> Name2Extensions = new Dictionary<string, SeinExtensionFactory>();

        public static void Init()
		{
            //Class2Extensions.Clear();
            //Component2Extensions.Clear();
            //Name2Extensions.Clear();

            foreach (var clazz in Assembly.GetAssembly(typeof(SeinExtensionFactory)).GetTypes())
            {
                if (clazz.IsClass && !clazz.IsAbstract && clazz.IsSubclassOf(typeof(SeinExtensionFactory)))
                {
                    Register(clazz);
                }
            }
		}

        private static void Register(Type FactoryClass)
		{
            var factory = (SeinExtensionFactory)Activator.CreateInstance(FactoryClass);

            var name = factory.GetExtensionName();
            var components = factory.GetBindedComponents();
            var types = factory.GetExtensionTypes();
            factory.ExtensionName = name;
            factory.ExtensionTypes = types;

            if (Class2Extensions.ContainsKey(FactoryClass))
            {
                return;
            }

            GLTFProperty.RegisterExtension(factory);
            Name2Extensions.Add(name, factory);
            Class2Extensions.Add(FactoryClass, name);

            foreach (var component in components)
            {
                if (!Component2Extensions.ContainsKey(component))
                {
                    Component2Extensions.Add(component, new List<string>());
                }

                Component2Extensions[component].Add(name);
            }
        }

        public static void BeforeExport()
        {
            foreach (var factory in Name2Extensions.Values)
            {
                factory.BeforeExport();
            }
        }

        public static void BeforeImport()
        {
            foreach (var factory in Name2Extensions.Values)
            {
                factory.BeforeImport();
            }
        }

        public static void FinishExport()
        {
            foreach (var factory in Name2Extensions.Values)
            {
                factory.FinishExport();
            }
        }

        public static void FinishImport()
        {
            foreach (var factory in Name2Extensions.Values)
            {
                factory.FinishImport();
            }
        }

        public static string GetExtensionName(Type FactoryClass)
        {
            return Class2Extensions[FactoryClass];
        }

        public static void Serialize(Type FactoryClass, ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var factory = Name2Extensions[Class2Extensions[FactoryClass]];
            factory.Awake(entry);

            factory.Serialize(entry, extensions, component, options);
        }

        public static void Serialize(string extensionName, ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var factory = Name2Extensions[extensionName];
            factory.Awake(entry);

            factory.Serialize(entry, extensions, component, options);
        }

        public static void Serialize(Component component, ExporterEntry entry, Dictionary<string, Extension> extensions)
        {
            foreach (var name in Component2Extensions[component.GetType()])
            {
                var factory = Name2Extensions[name];

                factory.Awake(entry);
                factory.Serialize(entry, extensions, component);
            }
        }

        public static void Import(string extensionName, EditorImporter importer, Extension extension) {
            if (Name2Extensions.ContainsKey(extensionName))
            {
                Name2Extensions[extensionName].Import(importer, extension);
            }
        }

        public static void Import(string extensionName, EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension) {
            if (Name2Extensions.ContainsKey(extensionName))
            {
                Name2Extensions[extensionName].Import(importer, gameObject, gltfNode, extension);
            }
        }

        public static void Import(string extensionName, EditorImporter importer, UnityEngine.Material material, GLTF.Schema.Material gltfMat, Extension extension) {
            if (Name2Extensions.ContainsKey(extensionName))
            {
                Name2Extensions[extensionName].Import(importer, material, gltfMat, extension);
            }
        }

        public static void Import(string extensionName, EditorImporter importer, UnityEngine.Mesh mesh, GLTF.Schema.Mesh gltfMesh, Extension extension) {
            if (Name2Extensions.ContainsKey(extensionName))
            {
                Name2Extensions[extensionName].Import(importer, mesh, gltfMesh, extension);
            }
        }

        public static void Import(string extensionName, EditorImporter importer, Texture2D texture, GLTF.Schema.Texture gltfTex, Extension extension)
        {
            if (Name2Extensions.ContainsKey(extensionName))
            {
                Name2Extensions[extensionName].Import(importer, texture, gltfTex, extension);
            }
        }
    }
}

