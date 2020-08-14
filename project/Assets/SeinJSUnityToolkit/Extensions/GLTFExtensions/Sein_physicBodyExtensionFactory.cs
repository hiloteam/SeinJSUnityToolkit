/**
 * @File   : Sein_physicBodyExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00AM
 */
using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using UnityEngine;
using GLTF.Schema;

namespace SeinJS
{
    public class Sein_physicBodyExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_physicBody"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinRigidBody), typeof(BoxCollider), typeof(SphereCollider) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            Sein_physicBodyExtension extension;

            if (extensions.ContainsKey(ExtensionName))
            {
                extension = (Sein_physicBodyExtension)extensions[ExtensionName];
            }
            else
            {
                extension = new Sein_physicBodyExtension();
                AddExtension(extensions, extension);
            }

            if (component is SeinRigidBody)
            {
                extension.go = ((SeinRigidBody)component).gameObject;
                extension.rigidBody = component as SeinRigidBody;
            }
            else if (component is Collider)
            {
                extension.go = ((Collider)component).gameObject;
                extension.colliders.Add(component as Collider);
            }
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_physicBodyExtension();
            var tmpGo = new GameObject();

            List<Collider> colliders = new List<Collider>();
            var rigidBody = tmpGo.AddComponent<SeinRigidBody>();

            if (extensionToken.Value["mass"] != null)
            {
                rigidBody.mass = (float)extensionToken.Value["mass"];
                rigidBody.friction = (float)extensionToken.Value["friction"];
                rigidBody.restitution = (float)extensionToken.Value["restitution"];
                rigidBody.unControl = (bool)extensionToken.Value["unControl"];
                rigidBody.physicStatic = (bool)extensionToken.Value["physicStatic"];
                rigidBody.sleeping = (bool)extensionToken.Value["sleeping"];
            }

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

                        if (collider["isTrigger"] != null)
                        {
                            sc.isTrigger = (bool)collider["isTrigger"];
                        }

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

                        if (collider["isTrigger"] != null)
                        {
                            bc.isTrigger = (bool)collider["isTrigger"];
                        }

                        colliders.Add(bc);
                        break;
                    default:
                        Debug.LogWarning("In current time, Sein only supports shpere and box collider !");
                        break;
                }
            }

            extension.rigidBody = rigidBody;
            extension.colliders = colliders;
            extension.go = tmpGo;

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var physicBody = (Sein_physicBodyExtension)extension;
            var rigidBody = gameObject.AddComponent<SeinRigidBody>();
            rigidBody.mass = physicBody.rigidBody.mass;
            rigidBody.restitution = physicBody.rigidBody.restitution;
            rigidBody.friction = physicBody.rigidBody.friction;
            rigidBody.unControl = physicBody.rigidBody.unControl;
            rigidBody.physicStatic = physicBody.rigidBody.physicStatic;
            rigidBody.sleeping = physicBody.rigidBody.sleeping;

            foreach (var c in physicBody.colliders)
            {
                if (c is SphereCollider)
                {
                    var collider = gameObject.AddComponent<SphereCollider>();
                    collider.center = ((SphereCollider)c).center;
                    collider.radius = ((SphereCollider)c).radius;
                    collider.isTrigger = c.isTrigger;
                }
                else if (c is BoxCollider)
                {
                    var collider = gameObject.AddComponent<BoxCollider>();
                    collider.center = ((BoxCollider)c).center;
                    collider.size = ((BoxCollider)c).size;
                    collider.isTrigger = c.isTrigger;
                }
            }

            UnityEngine.Object.DestroyImmediate(physicBody.go);
        }
    }
}
