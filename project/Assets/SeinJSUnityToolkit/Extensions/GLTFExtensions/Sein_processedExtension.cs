/**
 * @File   : Sein_processedExtension.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/10 0:00:00PM
 */
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class ProcessedExtOptions
    {
        public bool isGlobal = true;
    }

    public class Sein_processedExtension : Extension
    {
        public ProcessedExtOptions options;

        public JProperty Serialize()
        {
            if (options.isGlobal)
            {
                return new JProperty(
                    ExtensionManager.GetExtensionName(typeof(Sein_processedExtensionFactory)),
                    new JObject()
                );
            }

            return new JProperty(
                ExtensionManager.GetExtensionName(typeof(Sein_processedExtensionFactory)),
                new JObject(
                    new JProperty("dontNeedNormal", ExporterSettings.Export.unlit)
                )
            );
        }
    }
}
