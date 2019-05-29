using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_audioClipsExtensionFactory : ExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_audioClips";
        public const string CLIPS = "clips";

        public Sein_audioClipsExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<SeinAudioClip> clips = new List<SeinAudioClip>();

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
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
