using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;

namespace SeinJS
{
    public class Sein_audioListenerExtensionFactory : SeinExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_audioListener";

        public Sein_audioListenerExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            bool rotatable = false;

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
                rotatable = (bool)extensionToken.Value["rotatable"];
            }

            return new Sein_audioListenerExtension(rotatable);
        }
    }
}
