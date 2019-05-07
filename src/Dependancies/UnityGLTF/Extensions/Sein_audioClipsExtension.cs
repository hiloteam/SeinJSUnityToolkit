using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public struct SeinAudioClip
    {
        public ESeinAudioClipMode mode;
        public bool isLazy;
        public string uri;
        public string name;
    }

    public class Sein_audioClipsExtension : Extension
    {
        public List<SeinAudioClip> clips;

        public Sein_audioClipsExtension(List<SeinAudioClip> clips)
        {
            this.clips = clips;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
