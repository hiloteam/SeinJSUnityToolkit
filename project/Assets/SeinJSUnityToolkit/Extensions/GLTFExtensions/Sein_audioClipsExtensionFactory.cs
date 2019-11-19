/**
 * @File   : Sein_audioClipsExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00AM
 */
using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;

namespace SeinJS
{
    public class Sein_audioClipsExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_audioClips"; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Global }; }

        private static Dictionary<ExporterEntry, List<SeinAudioClip>> ENTRY_CLIPS = new Dictionary<ExporterEntry, List<SeinAudioClip>>();
        private static Dictionary<ExporterEntry, Dictionary<AudioClip, string>> ENTRY_URIS = new Dictionary<ExporterEntry, Dictionary<AudioClip, string>>();

        public static List<string> IMPORTED_URIS = new List<string>();
        public static List<SeinAudioClip> IMPORTED_CLIPS = new List<SeinAudioClip>();

        public static int GetClipIndex(ExporterEntry entry, SeinAudioClip clip)
        {
            return ENTRY_CLIPS[entry].IndexOf(clip);
        }

        public override void BeforeExport()
        {
            ENTRY_CLIPS.Clear();
            ENTRY_URIS.Clear();
        }

        public override void BeforeImport()
        {
            IMPORTED_CLIPS.Clear();
            IMPORTED_URIS.Clear();
        }

        public override void FinishImport()
        {
            IMPORTED_CLIPS.Clear();
            IMPORTED_URIS.Clear();
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            if (!ENTRY_CLIPS.ContainsKey(entry))
            {
                ENTRY_CLIPS.Add(entry, new List<SeinAudioClip>());
                ENTRY_URIS.Add(entry, new Dictionary<AudioClip, string>());
            }

            Sein_audioClipsExtension extension;
            var source = component as SeinAudioSource;

            if (!extensions.ContainsKey(ExtensionName))
            {
                extension = new Sein_audioClipsExtension();
                AddExtension(extensions, extension);
            }
            else
            {
                extension = (Sein_audioClipsExtension)extensions["Sein_audioClips"];
            }

            var list = ENTRY_CLIPS[entry];
            var uris = ENTRY_URIS[entry];

            foreach(var c in source.clips)
            {
                var clip = c.clip;
                if (c.clip == null)
                {
                    Utils.ThrowExcption("Clip '" + c.name + "' has no audio source!");
                }

                if (list.Contains(clip))
                {
                    continue;
                }

                var newClip = new Sein_audioClipsExtension.AudioClip();
                newClip.name = clip.name;
                newClip.mode = clip.mode;
                newClip.isLazy = clip.isLazy;

                if (uris.ContainsKey(clip.clip))
                {
                    newClip.uri = uris[clip.clip];
                }
                else
                {
                    newClip.uri = SaveAudio(clip.clip);
                }

                list.Add(clip);
                extension.clips.Add(newClip);
            }
        }

        private string SaveAudio(AudioClip clip)
        {
            string assetPath = AssetDatabase.GetAssetPath(clip);
            var pathes = ExporterUtils.GetAssetOutPath(clip);
            var exportPath = pathes[0];
            var pathInGlTF = pathes[1];

            if (File.Exists(exportPath))
            {
                return pathInGlTF;
            }

            FileUtil.CopyFileOrDirectory(assetPath, exportPath);

            return pathInGlTF;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<Sein_audioClipsExtension.AudioClip> clips = new List<Sein_audioClipsExtension.AudioClip>();

            if (extensionToken != null)
            {
                var clipsToken = extensionToken.Value["clips"];

                foreach (var clipToken in clipsToken)
                {
                    var uri = clipToken.Value<string>("uri");
                    var tmp = uri.Split('/');
                    var name = tmp[tmp.Length - 1];

                    clips.Add(new Sein_audioClipsExtension.AudioClip
                    { 
                        mode = clipToken.Value<string>("mode") == "Stream" ? ESeinAudioClipMode.Stream : ESeinAudioClipMode.Buffer,
                        isLazy = clipToken.Value<bool>("isLazy"),
                        uri = uri,
                        name = name
                    });
                }
            }

            return new Sein_audioClipsExtension { clips = clips };
        }

        public override void Import(EditorImporter importer, Extension extension)
        {
            importer.taskManager.addTask(LoadClips(importer, (Sein_audioClipsExtension)extension));
        }

        private IEnumerator LoadClips(EditorImporter importer, Sein_audioClipsExtension extension)
        {
            var clips = extension.clips;
            var basePath = Path.Combine(importer.importDirectoryPath, "audios");
            Directory.CreateDirectory(basePath);
            int i = 0;

            foreach (var clip in clips)
            {
                LoadClip(clip, importer.gltfDirectoryPath, basePath, i);
                importer.SetProgress("AUDIO", (i + 1), clips.Count);
                i += 1;

                yield return null;
            }
        }

        private void LoadClip(Sein_audioClipsExtension.AudioClip clip, string gltfPath, string basePath, int i)
        {
            var uri = Path.Combine(gltfPath, clip.uri);
            if (clip.uri != null && File.Exists(uri))
            {
                var tmp = clip.uri.Split('/');
                var name = tmp[tmp.Length - 1];

                if (clip.name != null)
                {
                    name = clip.name;
                }

                var path = Path.Combine(basePath, name);

                if (File.Exists(path))
                {
                    if (!IMPORTED_URIS.Contains(clip.uri))
                    {
                        name = Path.GetFileNameWithoutExtension(name) + "-" + i + Path.GetExtension(name);
                        path = Path.Combine(basePath, name);
                        FileUtil.CopyFileOrDirectory(uri, path);
                        IMPORTED_URIS.Add(clip.uri);
                    }
                }
                else
                {
                    FileUtil.CopyFileOrDirectory(uri, path);
                    IMPORTED_URIS.Add(clip.uri);
                }

                AssetDatabase.Refresh();
                var unityClip = AssetDatabase.LoadAssetAtPath<AudioClip>(path);

                var directory = GLTFUtils.getPathProjectFromAbsolute(basePath);
                path = Path.Combine(directory, name + ".asset");
                var seinClip = ScriptableObject.CreateInstance<SeinAudioClip>();
                seinClip.clip = unityClip;
                seinClip.mode = clip.mode;
                seinClip.isLazy = clip.isLazy;

                AssetDatabase.CreateAsset(seinClip, path);
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();

                seinClip = AssetDatabase.LoadAssetAtPath<SeinAudioClip>(path);

                IMPORTED_CLIPS.Add(seinClip);
            }
            else
            {
                Debug.LogWarning("Audio clip not found");
            }
        }
    }
}
