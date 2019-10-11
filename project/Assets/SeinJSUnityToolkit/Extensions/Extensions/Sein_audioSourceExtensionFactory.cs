using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioSourceExtensionFactory : SeinExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_audioSource";

        public Sein_audioSourceExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<KeyValuePair<string, int>> clips = new List<KeyValuePair<string, int>>();
            string defaultClip = "";
            bool needAutoPlay = false;
            SeinAudioSourceAutoPlayOptions autoPlayOptions = new SeinAudioSourceAutoPlayOptions();
            bool isSpaceAudio = false;
            SeinAudioSourceSpaceOptions spaceOptions = new SeinAudioSourceSpaceOptions();

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
                defaultClip = (string)extensionToken.Value["defaultClip"];
                needAutoPlay = (bool)extensionToken.Value["needAutoPlay"];
                isSpaceAudio = (bool)extensionToken.Value["isSpaceAudio"];
                foreach (var pair in (JObject)extensionToken.Value["clips"])
                {
                    clips.Add(new KeyValuePair<string, int>(pair.Key, (int)pair.Value));
                }

                if (needAutoPlay)
                {
                    autoPlayOptions.start = (float)extensionToken.Value["autoPlayOptions"]["start"];
                    autoPlayOptions.end = (float)extensionToken.Value["autoPlayOptions"]["end"];
                    autoPlayOptions.loop = (bool)extensionToken.Value["autoPlayOptions"]["loop"];
                }

                if (isSpaceAudio)
                {
                    spaceOptions.rotatable = (bool)extensionToken.Value["spaceOptions"]["rotatable"];
                    spaceOptions.refDistance = (float)extensionToken.Value["spaceOptions"]["refDistance"];
                    spaceOptions.maxDistance = (float)extensionToken.Value["spaceOptions"]["maxDistance"];
                    spaceOptions.rolloffFactor = (float)extensionToken.Value["spaceOptions"]["rolloffFactor"];
                    spaceOptions.coneInnerAngle = (float)extensionToken.Value["spaceOptions"]["coneInnerAngle"];
                    spaceOptions.coneOuterAngle = (float)extensionToken.Value["spaceOptions"]["coneOuterAngle"];
                    spaceOptions.coneOuterGain = (float)extensionToken.Value["spaceOptions"]["coneOuterGain"];

                    var pm = (string)extensionToken.Value["spaceOptions"]["panningModel"];
                    if (pm == "equalpower")
                    {
                        spaceOptions.panningModel = ESeinAudioPanningModelType.equalpower;
                    }
                    else
                    {
                        spaceOptions.panningModel = ESeinAudioPanningModelType.HRTF;
                    }

                    var dm = (string)extensionToken.Value["spaceOptions"]["distanceModel"];
                    if (pm == "linear")
                    {
                        spaceOptions.distanceModel = ESeinAudioDistanceModelType.linear;
                    }
                    else if (pm == "inverse")
                    {
                        spaceOptions.distanceModel = ESeinAudioDistanceModelType.inverse;
                    }
                    else
                    {
                        spaceOptions.distanceModel = ESeinAudioDistanceModelType.exponential;
                    }
                }
            }

            return new Sein_audioSourceExtension(clips, defaultClip, needAutoPlay, autoPlayOptions, isSpaceAudio, spaceOptions);
        }
    }
}
