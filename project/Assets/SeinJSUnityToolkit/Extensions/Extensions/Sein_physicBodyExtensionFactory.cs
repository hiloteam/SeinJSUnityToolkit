using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using UnityEngine;

namespace SeinJS
{
    public class Sein_physicBodyExtensionFactory : SeinExtensionFactory
    {
        public const string EXTENSION_NAME = "Sein_physicBody";

        public Sein_physicBodyExtensionFactory()
        {
            ExtensionName = EXTENSION_NAME;
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            SeinRigidBody rigidBody = null;
            List<Collider> colliders = new List<Collider>();

            if (extensionToken != null)
            {
#if DEBUG
                // Broken on il2cpp. Don't ship debug DLLs there.
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.ToString());
                System.Diagnostics.Debug.WriteLine(extensionToken.Value.Type);
#endif
            }
            var tmpGo = new GameObject();

            rigidBody = tmpGo.AddComponent<SeinRigidBody>();
            rigidBody.mass = (float)extensionToken.Value["mass"];
            rigidBody.friction = (float)extensionToken.Value["friction"];
            rigidBody.restitution = (float)extensionToken.Value["restitution"];
            rigidBody.unControl = (bool)extensionToken.Value["unControl"];
            rigidBody.physicStatic = (bool)extensionToken.Value["physicStatic"];
            rigidBody.sleeping = (bool)extensionToken.Value["sleeping"];

            foreach (JContainer collider in extensionToken.Value["colliders"]) {
                var type = (string)collider["type"];

                switch (type)
                {
                    case ("SPHERE"):
                        var sc = tmpGo.AddComponent<SphereCollider>();
                        sc.radius = (float)collider["radius"];
                        sc.center = new  UnityEngine.Vector3(
                            (float)collider["offset"][0],
                            (float)collider["offset"][1],
                            (float)collider["offset"][2]
                        );
                        sc.isTrigger = (bool)collider["isTrigger"];

                        colliders.Add(sc);
                        break;
                    case ("BOX"):
                        var bc = tmpGo.AddComponent<BoxCollider>();
                        bc.size = new UnityEngine.Vector3(
                            (float)collider["size"][0],
                            (float)collider["size"][1],
                            (float)collider["size"][2]
                        );
                        bc.center = new UnityEngine.Vector3(
                            (float)collider["offset"][0],
                            (float)collider["offset"][1],
                            (float)collider["offset"][2]
                        );
                        bc.isTrigger = (bool)collider["isTrigger"];

                        colliders.Add(bc);
                        break;
                    default:
                        Debug.LogWarning("In current time, Sein only supports shpere and box collider !");
                        break;
                }
            }

            return new Sein_physicBodyExtension(rigidBody, colliders, tmpGo);
        }
    }
}
