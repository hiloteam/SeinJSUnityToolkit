using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_audioSourceExtension : Extension
    {
        public List<KeyValuePair<string, int>> clips = new List<KeyValuePair<string, int>>();
        public string defaultClip = "";
        public bool needAutoPlay;
        public SeinAudioSourceAutoPlayOptions autoPlayOptions;
        public bool isSpaceAudio;
        public SeinAudioSourceSpaceOptions spaceOptions;

        public Sein_audioSourceExtension(
             List<KeyValuePair<string, int>> clips,
            string defaultClip,
            bool needAutoPlay,
            SeinAudioSourceAutoPlayOptions autoPlayOptions,
            bool isSpaceAudio,
            SeinAudioSourceSpaceOptions spaceOptions
        )
        {
            this.clips = clips;
            this.defaultClip = defaultClip;
            this.needAutoPlay = needAutoPlay;
            this.autoPlayOptions = autoPlayOptions;
            this.isSpaceAudio = isSpaceAudio;
            this.spaceOptions = spaceOptions;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
