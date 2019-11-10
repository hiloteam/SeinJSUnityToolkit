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

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
            }

            var sprite = component as SeinSprite;
            // process atlases at first
            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_atlasExtensionFactory)), entry, entry.root.Extensions, sprite.atlas);

            var extension = new Sein_spriteExtension();

            extension.width = sprite.width;
            extension.height = sprite.height;
            extension.isBillboard = sprite.isBillboard;
            extension.frustumTest = sprite.frustumTest;
            extension.atlasId = Sein_atlasExtensionFactory.GetAtlasIndex(entry, sprite.atlas);
            extension.frameName = sprite.frameName;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_spriteExtension();

            if (extensionToken != null)
            {
                extension.width = (float)extensionToken.Value["width"];
                extension.height = (float)extensionToken.Value["height"];
                extension.isBillboard = (bool)extensionToken.Value["isBillBoard"];
                extension.frustumTest = (bool)extensionToken.Value["frustumTest"];
                extension.frameName = (string)extensionToken.Value["frameName"];
                extension.atlasId = (int)extensionToken.Value["atlas"]["index"];
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var ex = (Sein_spriteExtension)extension;
            var sprite = gameObject.AddComponent<SeinSprite>();
            sprite.width = ex.width;
            sprite.height = ex.height;
            sprite.isBillboard = ex.isBillboard;
            sprite.frustumTest = ex.frustumTest;
            sprite.frameName = ex.frameName;
            //sprite.atlas = Sein_atlasExtensionFactory.IMPORTED_CLIPS[ex.atlasId];
        }
    }
}
