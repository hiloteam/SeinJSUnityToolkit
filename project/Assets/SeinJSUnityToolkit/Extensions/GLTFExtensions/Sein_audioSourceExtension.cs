/**
 * @File   : Sein_audioSourceExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioSourceExtension : Extension
    {
        public List<KeyValuePair<string, int>> clips = new List<KeyValuePair<string, int>>();
        public string defaultClip = "";
        public bool needAutoPlay;
        public SeinAudioSourceAutoPlayOptions autoPlayOptions;
        public bool isSpaceAudio;
        public SeinAudioSourceSpaceOptions spaceOptions;

        public JProperty Serialize()
        {
            var value = new JObject();

            value.Add("isSpaceAudio", isSpaceAudio);
            if (isSpaceAudio)
            {
                value.Add("spaceOptions", new JObject(
                    new JProperty("rotatable", spaceOptions.rotatable),
                    new JProperty("panningModel", spaceOptions.panningModel),
                    new JProperty("distanceModel", spaceOptions.distanceModel),
                    new JProperty("refDistance", spaceOptions.refDistance),
                    new JProperty("maxDistance", spaceOptions.maxDistance),
                    new JProperty("rolloffFactor", spaceOptions.rolloffFactor),
                    new JProperty("coneInnerAngle", spaceOptions.coneInnerAngle),
                    new JProperty("coneOuterAngle", spaceOptions.coneOuterAngle),
                    new JProperty("coneOuterGain", spaceOptions.coneOuterGain)
                ));
            }

            value.Add("needAutoPlay", needAutoPlay);
            if (needAutoPlay)
            {
                value.Add("autoPlayOptions", new JObject(
                    new JProperty("loop", autoPlayOptions.loop),
                    new JProperty("start", autoPlayOptions.start),
                    new JProperty("end", autoPlayOptions.end)
                ));
            }

            value.Add("defaultClip", defaultClip);
            var cps = new JObject();
            foreach (var clip in clips)
            {
                cps.Add(clip.Key, clip.Value);
            }
            value.Add("clips", cps);

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_audioSourceExtensionFactory)), value);
        }
    }
}
