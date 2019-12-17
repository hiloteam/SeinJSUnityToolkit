/**
 * @File   : Sein_spriteExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/10 0:00:00AM
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
    public class Sein_spriteExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_sprite"; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Mesh }; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinSprite) }; }

        private static Dictionary<ExporterEntry, Dictionary<string, int>> _CAHCE = new Dictionary<ExporterEntry, Dictionary<string, int>>();

        public override void BeforeExport()
        {
            _CAHCE.Clear();
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
            }

            Sein_spriteExtension globalExtension;
            if (!entry.root.Extensions.ContainsKey(ExtensionName))
            {
                globalExtension = new Sein_spriteExtension { isGlobal = true };
                entry.root.Extensions.Add(ExtensionName, globalExtension);
            }
            else
            {
                globalExtension = (Sein_spriteExtension)entry.root.Extensions[ExtensionName];
            }

            var sprite = component as SeinSprite;
            var extension = new Sein_spriteExtension { isGlobal = false };
            var sp = sprite;
            var customMaterial = sprite.GetComponent<SeinCustomMaterial>();
            var cacheId = $"w{sp.width}-h{sp.height}-at{sp.atlas.GetInstanceID()}-fn{sp.frameName}-bb{sp.isBillboard}-ft{sp.frustumTest}";
            if (customMaterial != null)
            {
                cacheId += $"mat{customMaterial.GetInstanceID()}";
            } else
            {
                cacheId += $"mat{sprite.material.GetInstanceID()}";
            }
            if (!_CAHCE.ContainsKey(entry))
            {
                _CAHCE.Add(entry, new Dictionary<string, int>());
            }

            if (_CAHCE[entry].ContainsKey(cacheId))
            {
                extension.index = _CAHCE[entry][cacheId];
                AddExtension(extensions, extension);
                return;
            }

            // process atlases at first
            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_atlasExtensionFactory)), entry, entry.root.Extensions, sprite.atlas);
            var s = new Sein_spriteExtension.Sprite();
            s.width = sprite.width;
            s.height = sprite.height;
            s.isBillboard = sprite.isBillboard;
            s.frustumTest = sprite.frustumTest;
            s.atlasId = Sein_atlasExtensionFactory.GetAtlasIndex(entry, sprite.atlas);
            s.frameName = sprite.frameName;

            GLTF.Schema.Material gltfMat = null;
            if (customMaterial != null)
            {
                gltfMat = ExporterUtils.ConvertMaterial(customMaterial, entry);
            } else if (sprite.material.shader.name != "Sein/Sprite" && sprite.material.shader.name.Contains("Sein/"))
            {
                gltfMat = ExporterUtils.ConvertSeinCustomMaterial(sprite.material, entry);
            }

            if (gltfMat != null)
            {
                var root = entry.root;
                if (root.Materials == null)
                {
                    root.Materials = new List<GLTF.Schema.Material>();
                }

                root.Materials.Add(gltfMat);
                var id = new MaterialId { Id = root.Materials.Count - 1, Root = root };
                s.materialId = id;
            }

            globalExtension.sprites.Add(s);

            var index = globalExtension.sprites.Count - 1;
            _CAHCE[entry].Add(cacheId, index);
            extension.index = index;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_spriteExtension();

            if (extensionToken != null)
            {
                if (extensionToken.Value["index"] != null)
                {
                    extension.isGlobal = false;
                    extension.index = (int)extensionToken.Value["index"];
                }
                else
                {
                    foreach (JObject sprite in (JArray)extensionToken.Value["sprites"])
                    {
                        var sp = new Sein_spriteExtension.Sprite();
                        sp.width = sprite.Value<float>("width");
                        sp.height = sprite.Value<float>("height");
                        sp.isBillboard = sprite.Value<bool>("isBillBoard");
                        sp.frustumTest = sprite.Value<bool>("frustumTest");
                        sp.frameName = sprite.Value<JObject>("atlas").Value<string>("frameName");
                        sp.atlasId = sprite.Value<JObject>("atlas").Value<int>("index");

                        if (sprite["material"] != null)
                        {
                            sp.materialId = new MaterialId { Root = root, Id = sprite.Value<JObject>("material").Value<int>("index") };
                        }

                        extension.sprites.Add(sp);
                    }
                }
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var globalEx = (Sein_spriteExtension)importer.root.Extensions[ExtensionName];
            var sp = globalEx.sprites[((Sein_spriteExtension)extension).index];

            var ex = (Sein_spriteExtension)extension;
            var sprite = gameObject.AddComponent<SeinSprite>();
            sprite.width = sp.width;
            sprite.height = sp.height;
            sprite.Generate();

            sprite.isBillboard = sp.isBillboard;
            sprite.frustumTest = sp.frustumTest;
            sprite.frameName = sp.frameName;
            sprite.atlas = Sein_atlasExtensionFactory.IMPORTED_ATLASES[sp.atlasId];

            if (sp.materialId != null)
            {
                sprite.material = importer.assetCache.MaterialCache[sp.materialId.Id].UnityMaterial;
            }
            
            sprite.SetFrame(sprite.atlas, sprite.frameName);
        }
    }
}
