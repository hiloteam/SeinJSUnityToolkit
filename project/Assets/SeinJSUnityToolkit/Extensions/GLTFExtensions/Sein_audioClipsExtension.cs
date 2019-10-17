/**
 * @File   : Sein_audioClipsExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00AM
 */
using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioClipsExtension : Extension
    {
        public struct AudioClip
        {
            public ESeinAudioClipMode mode;
            public bool isLazy;
            public string uri;
            public string name;
        }

        public List<AudioClip> clips = new List<AudioClip>();

        public JProperty Serialize()
        {
            var value = new JArray();

            foreach(var clip in clips)
            {
                var c = new JObject();
                c.Add("mode", clip.mode.ToString());
                c.Add("isLazy", clip.isLazy);
                c.Add("uri", clip.uri);

                value.Add(c);
            }

            return new JProperty(ExtensionManager.GetExtensionName(typeof(Sein_audioClipsExtensionFactory)), new JObject(
                new JProperty("clips", value)
            ));
        }
    }
}
