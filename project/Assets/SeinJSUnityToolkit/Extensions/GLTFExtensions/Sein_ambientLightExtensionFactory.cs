/**
 * @File   : Sein_ambientLightExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/17 0:00:00PM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_ambientLightExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_ambientLight"; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var extension = new Sein_ambientLightExtension();

            var hdrColor = RenderSettings.ambientLight;
            var r = hdrColor.r;
            var g = hdrColor.r;
            var b = hdrColor.b;
            var d = Math.Max(r, Math.Max(g, b));

            if (d >= 0.01)
            {
                r /= d;
                g /= d;
                b /= d;
            }

            extension.intensity = d;
            extension.color = new Color(r, g, b);

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_ambientLightExtension();

            if (extensionToken == null)
            {
                return null;
            }

            extension.intensity = (float)extensionToken.Value["intensity"];
            var c = (JArray)extensionToken.Value["color"];
            extension.color = new Color((float)c[0], (float)c[1], (float)c[2]);

            return extension;
        }
    }
}
