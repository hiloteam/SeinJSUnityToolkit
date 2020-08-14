/**
 * @File   : Sein_atlasExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/10 0:00:00AM
 */
using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;

namespace SeinJS
{
    public class Sein_atlasExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_atlas"; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Global }; }

        private static Dictionary<ExporterEntry, List<SeinAtlas>> ENTRY_ATLASES = new Dictionary<ExporterEntry, List<SeinAtlas>>();
        public static SeinAtlas[] IMPORTED_ATLASES;

        public static int GetAtlasIndex(ExporterEntry entry, SeinAtlas atlas)
        {
            return ENTRY_ATLASES[entry].IndexOf(atlas);
        }

        public override void BeforeExport()
        {
            ENTRY_ATLASES.Clear();
        }

        public override void BeforeImport()
        {
            IMPORTED_ATLASES = null;
        }

        public override void FinishImport()
        {
            IMPORTED_ATLASES = null;
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            if (!ENTRY_ATLASES.ContainsKey(entry))
            {
                ENTRY_ATLASES.Add(entry, new List<SeinAtlas>());
            }

            Sein_atlasExtension extension;
            var atlas = component as SeinAtlas;

            if (!extensions.ContainsKey(ExtensionName))
            {
                extension = new Sein_atlasExtension();
                AddExtension(extensions, extension);
            }
            else
            {
                extension = (Sein_atlasExtension)extensions[ExtensionName];
            }

            var list = ENTRY_ATLASES[entry];

            if (list.Contains(atlas))
            {
                return;
            }

            var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(atlas.atlasPath);
            if (tex == null)
            {
                Utils.ThrowExcption("Atlas '" + atlas.name + "' is not saved!");
            }
            var imageId = entry.SaveImage(tex, true, null, maxSize: Math.Max(tex.width, tex.height), flipY: false);
            var json = atlas.ReadJson();
            json["meta"]["image"] = new JObject(new JProperty("index", imageId.Id));

            extension.atlases.Add(new Sein_atlasExtension.Atlas { json = json });
            list.Add(atlas);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<Sein_atlasExtension.Atlas> atlases = new List<Sein_atlasExtension.Atlas>();

            if (extensionToken != null)
            {
                var atlasesToken = extensionToken.Value["atlases"];

                foreach (JObject json in atlasesToken)
                {
                    atlases.Add(new Sein_atlasExtension.Atlas { json = json });
                }
            }

            return new Sein_atlasExtension { atlases = atlases };
        }

        public override void Import(EditorImporter importer, Extension extension)
        {
            importer.taskManager.addTask(LoadAtlases(importer, (Sein_atlasExtension)extension));
        }

        private IEnumerator LoadAtlases(EditorImporter importer, Sein_atlasExtension extension)
        {
            var atlases = extension.atlases;
            var basePath = Path.Combine(importer.importDirectoryPath, "atlases");
            Directory.CreateDirectory(basePath);
            IMPORTED_ATLASES = new SeinAtlas[atlases.Count];
            int i = 0;

            foreach (var atlas in atlases)
            {
                LoadAtlas(atlas, importer, basePath, i);
                importer.SetProgress("ATLAS", (i + 1), atlases.Count);
                i += 1;

                yield return null;
            }
        }

        private void LoadAtlas(Sein_atlasExtension.Atlas atlas, EditorImporter importer, string basePath, int i)
        {
            var json = JObject.FromObject(atlas.json);
            var imageId = (int)json["meta"]["image"]["index"];
            json["meta"]["image"] = importer.root.Images[imageId].Uri;
            var dest = Path.Combine(basePath, (string)json["name"]);

            if (Directory.Exists(dest))
            {
                int index = 1;
                while (true)
                {
                    if (!Directory.Exists(dest + "-" + index))
                    {
                        dest += "-" + index;
                        break;
                    }

                    index += 1;
                }
            }

            Directory.CreateDirectory(dest);
            AssetDatabase.Refresh();

            var destInUnity = "Assets" + dest.Replace(Application.dataPath, "");
            var seinAtlas = ScriptableObject.CreateInstance<SeinAtlas>();
            AssetDatabase.CreateAsset(seinAtlas, Path.Combine(destInUnity, (string)json["name"] + ".asset"));
            seinAtlas.Import(json, importer.gltfDirectoryPath);

            IMPORTED_ATLASES[i] = seinAtlas;
        }
    }
}