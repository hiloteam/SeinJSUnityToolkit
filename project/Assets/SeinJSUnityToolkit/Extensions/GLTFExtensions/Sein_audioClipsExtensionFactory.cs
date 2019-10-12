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
    public class Sein_audioClipsExtensionFactory : SeinExtensionFactory
    {
        public new static string EXTENSION_NAME = "Sein_audioClips";
        private static Dictionary<ExporterEntry, List<SeinAudioClip>> ENTRY_CLIPS = new Dictionary<ExporterEntry, List<SeinAudioClip>>();

        public const string CLIPS = "clips";

        public static int GetClipIndex(ExporterEntry entry, SeinAudioClip clip)
        {
            return ENTRY_CLIPS[entry].IndexOf(clip);
        }

        public override void BeforeExport()
        {
            ENTRY_CLIPS.Clear();
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, Component component = null)
        {

            if (!ENTRY_CLIPS.ContainsKey(entry))
            {
                ENTRY_CLIPS.Add(entry, new List<SeinAudioClip>());
            }

            Sein_audioClipsExtension extension = null;
            var source = component as SeinAudioSource;

            if (!entry.root.Extensions.ContainsKey(ExtensionName))
            {
                extension = new Sein_audioClipsExtension();
                AddExtension(extensions, extension);
            } else
            {
                extension = (Sein_audioClipsExtension)extensions["Sein_audioClips"];
            }

            //extension.clips
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<SeinAudioClip> clips = new List<SeinAudioClip>();

            if (extensionToken != null)
            {
                var clipsToken = extensionToken.Value[CLIPS];

                foreach (var clipToken in clipsToken)
                {
                    var uri = clipToken.Value<string>("uri");
                    var tmp = uri.Split('/');
                    var name = tmp[tmp.Length - 1];

                    clips.Add(new SeinAudioClip { 
                        mode = clipToken.Value<string>("mode") == "Stream" ? ESeinAudioClipMode.Stream : ESeinAudioClipMode.Buffer,
                        isLazy = clipToken.Value<bool>("isLazy"),
                        uri = uri,
                        name = GlTF_Writer.cleanNonAlphanumeric(name)
                    });
                }
            }

            return new Sein_audioClipsExtension(clips);
        }
    }
}
