/**
 * @File   : Sein_audioSourceExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
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
    public class Sein_audioSourceExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_audioSource"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinAudioSource) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            // process clips at first
            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
            }
            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_audioClipsExtensionFactory)), entry, entry.root.Extensions, component);

            var extension = new Sein_audioSourceExtension();
            var source = component as SeinAudioSource;

            extension.isSpaceAudio = source.isSpaceAudio;
            extension.needAutoPlay = source.needAutoPlay;
            extension.defaultClip = source.defaultClip;
            extension.spaceOptions = source.spaceOptions;
            extension.autoPlayOptions = source.autoPlayOptions;

            foreach (var clip in source.clips)
            {
                extension.clips.Add(new KeyValuePair<string, int>(clip.name, Sein_audioClipsExtensionFactory.GetClipIndex(entry, clip.clip)));
            }

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_audioSourceExtension();

            if (extensionToken != null)
            {
                extension.defaultClip = (string)extensionToken.Value["defaultClip"];
                extension.needAutoPlay = (bool)extensionToken.Value["needAutoPlay"];
                extension.isSpaceAudio = (bool)extensionToken.Value["isSpaceAudio"];
                foreach (var pair in (JObject)extensionToken.Value["clips"])
                {
                    extension.clips.Add(new KeyValuePair<string, int>(pair.Key, (int)pair.Value));
                }

                if (extension.needAutoPlay)
                {
                    extension.autoPlayOptions = new SeinAudioSourceAutoPlayOptions();
                    extension.autoPlayOptions.start = (float)extensionToken.Value["autoPlayOptions"]["start"];
                    extension.autoPlayOptions.end = (float)extensionToken.Value["autoPlayOptions"]["end"];
                    extension.autoPlayOptions.loop = (bool)extensionToken.Value["autoPlayOptions"]["loop"];
                }

                if (extension.isSpaceAudio)
                {
                    extension.spaceOptions = new SeinAudioSourceSpaceOptions();
                    extension.spaceOptions.rotatable = (bool)extensionToken.Value["spaceOptions"]["rotatable"];
                    extension.spaceOptions.refDistance = (float)extensionToken.Value["spaceOptions"]["refDistance"];
                    extension.spaceOptions.maxDistance = (float)extensionToken.Value["spaceOptions"]["maxDistance"];
                    extension.spaceOptions.rolloffFactor = (float)extensionToken.Value["spaceOptions"]["rolloffFactor"];
                    extension.spaceOptions.coneInnerAngle = (float)extensionToken.Value["spaceOptions"]["coneInnerAngle"];
                    extension.spaceOptions.coneOuterAngle = (float)extensionToken.Value["spaceOptions"]["coneOuterAngle"];
                    extension.spaceOptions.coneOuterGain = (float)extensionToken.Value["spaceOptions"]["coneOuterGain"];

                    var pm = (string)extensionToken.Value["spaceOptions"]["panningModel"];
                    if (pm == "equalpower")
                    {
                        extension.spaceOptions.panningModel = ESeinAudioPanningModelType.equalpower;
                    }
                    else
                    {
                        extension.spaceOptions.panningModel = ESeinAudioPanningModelType.HRTF;
                    }

                    var dm = (string)extensionToken.Value["spaceOptions"]["distanceModel"];
                    if (pm == "linear")
                    {
                        extension.spaceOptions.distanceModel = ESeinAudioDistanceModelType.linear;
                    }
                    else if (pm == "inverse")
                    {
                        extension.spaceOptions.distanceModel = ESeinAudioDistanceModelType.inverse;
                    }
                    else
                    {
                        extension.spaceOptions.distanceModel = ESeinAudioDistanceModelType.exponential;
                    }
                }
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var source = (Sein_audioSourceExtension)extension;
            var audioSource = gameObject.AddComponent<SeinAudioSource>();
            audioSource.defaultClip = source.defaultClip;
            audioSource.needAutoPlay = source.needAutoPlay;
            audioSource.isSpaceAudio = source.isSpaceAudio;
            audioSource.autoPlayOptions = source.autoPlayOptions;
            audioSource.spaceOptions = source.spaceOptions;
            audioSource.clips = new SeinAudioOneClip[source.clips.Count];
            for (int i = 0; i < source.clips.Count; i += 1)
            {
                var clip = new SeinAudioOneClip();
                clip.name = source.clips[i].Key;
                clip.clip = Sein_audioClipsExtensionFactory.IMPORTED_CLIPS[source.clips[i].Value];
                audioSource.clips[i] = clip;
            }
        }
    }
}
