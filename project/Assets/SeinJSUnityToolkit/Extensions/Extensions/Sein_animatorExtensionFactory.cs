using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;

namespace GLTF.Schema
{
    public class Sein_animatorListenerExtensionFactory : ExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_animator";

        public Sein_animatorListenerExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            List<string> modelAnimations = new List<string>();
            string defaultAnimation = "";

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
                defaultAnimation = (string)extensionToken.Value["defaultAnimation"];
                foreach (string ani in extensionToken.Value["modelAnimations"])
                {
                    modelAnimations.Add(ani);
                }
            }

            return new Sein_animatorListenerExtension(modelAnimations.ToArray(), defaultAnimation);
        }
    }
}
