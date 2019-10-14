/**
 * @File   : EditorExportor.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using GLTF;
using GLTF.Schema;
using Newtonsoft.Json.Linq;

namespace SeinJS
{
    public class EditorExporter
    {
        TaskManager _taskManager;
        bool _isDone;
        bool _userStopped;
        //public delegate void ProgressCallback(string step, string details, int current, int total);

        public EditorExporter()
        {
            _taskManager = new TaskManager();
        }

        public void Export(List<ExporterEntry> entries)
        {
			ExporterEntry.Init();
            ExtensionManager.BeforeExport();
            _isDone = false;
            _userStopped = false;

            foreach (var entry in entries)
            {
                ExportOne(entry);
            }
        }

        private void ExportOne(ExporterEntry entry)
        {
            var root = entry.root;
            root.Asset = new Asset();
            root.Asset.Generator = "Sein.js Unity Toolkit";
            root.Asset.Version = "2.0";
            root.Asset.Extras = new JProperty("exporterVersion", Utils.version.ToString());
            root.Scenes = new List<Scene>();
            root.Scenes.Add(new Scene());
            root.Scene = new SceneId{ Id = 0, Root = root };

            if (ExporterSettings.Lighting.ambient)
            {
                var tmpGo = new GameObject();
                tmpGo.name = "sein-ambient-light";
                ExportNode(tmpGo.transform, entry);
                ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_ambientLightExtensionFactory)), entry, entry.tr2node[tmpGo.transform].Extensions);
            }

            foreach (Transform tr in entry.transforms)
            {
                SkinnedMeshRenderer skin = tr.GetComponent<SkinnedMeshRenderer>();
                if (skin)
                {
                    foreach (Transform bone in skin.bones)
                    {
                        entry.bones.Add(bone);
                    }
                }

                if (!tr.gameObject.activeInHierarchy)
                {
                    continue;
                }

                ExportNode(tr, entry);
            }

            // process children
            ProcessChildren(entry);

            // process skinning and bones
            foreach (Transform tr in entry.transforms)
            {
                ExportSkin(tr, entry);
            }

            // process animations
            foreach (Transform tr in entry.transforms)
            {
                ExportAnimations(tr, entry);
            }

            // process extensions
            foreach (Transform tr in entry.transforms)
            {
                ExportCamera(tr, entry);
                ExportExtensions(tr, entry);
            }

            ExportDone(entry);
        }

        private void ExportNode(Transform tr, ExporterEntry entry)
        {
            var id = entry.SaveNode(tr);

            if (!tr.parent)
            {
                var scene = entry.root.Scene.Value;
                if (scene.Nodes == null)
                {
                    scene.Nodes = new List<NodeId>();
                }

                scene.Nodes.Add(id);
            }
            else
            {
                entry.tr2node[tr.parent].Children.Add(id);
            }

            var seinNode = tr.GetComponent<SeinNode>();
            if (seinNode)
            {
                if (seinNode.selfType == ESeinNodeType.Actor)
                {
                    entry.transformsInSameActor.Add(tr, new List<Transform>());
                }
                else
                {
                    var parent = tr.parent;
                    while (parent)
                    {
                        var parentSeinNode = parent.GetComponent<SeinNode>();
                        if (parentSeinNode == null || parentSeinNode.selfType == ESeinNodeType.Component)
                        {
                            parent = parent.parent;
                            continue;
                        }

                        entry.transformsInSameActor[parent].Add(tr);
                    }
                }
            }

            ExportMesh(tr, entry);
        }

        private void ExportMesh(Transform tr, ExporterEntry entry)
        {
            var renderer = GetRenderer(tr);
            var mesh = GetMesh(tr);

            if (!mesh)
            {
                return;
            }

            var result = entry.SaveMesh(mesh, renderer);
            var id = result.key;
            var needProcessMatrials = result.value;
            var node = entry.tr2node[tr];
            node.Mesh = id;

            if (needProcessMatrials)
            {
                var materialComponents = tr.GetComponents<SeinCustomMaterial>();
                int i = 0;
                var materials = renderer.sharedMaterials;
                foreach (var primitive in id.Value.Primitives)
                {
                    if (i >= materials.Length)
                    {
                        Debug.LogError("No material in primitive" + " " + i + " in mesh " + mesh.name + " !");
                        break;
                    }

                    bool hasComponent = false;
                    foreach (var materialComponent in materialComponents)
                    {
                        if (materialComponent.unityMaterialName == materials[i].name)
                        {
                            ExportComponentMaterial(materialComponent, primitive, entry);
                            hasComponent = true;
                            break;
                        }
                    }

                    if (!hasComponent)
                    {
                        ExportNormalMaterial(materials[i], primitive, entry);
                    }

                    i += 1;
                }
            }
        }


        private void ExportNormalMaterial(UnityEngine.Material material, MeshPrimitive primitive, ExporterEntry entry)
        {
            primitive.Material = entry.SaveNormalMaterial(material);
        }

        private void ExportComponentMaterial(SeinCustomMaterial material, MeshPrimitive primitive, ExporterEntry entry)
        {
            primitive.Material = entry.SaveComponentMaterial(material);
        }

        private void ProcessChildren(ExporterEntry entry)
        {
            foreach (var trs in entry.transformsInSameActor.Values)
			{
                var names = new Dictionary<string, int>();

                foreach (var tr in trs)
                {
                    var node = entry.tr2node[tr];
                    if (names.ContainsKey(node.Name)) {
                        names[node.Name] += 1;
                        node.Name += names[node.Name];
                    }
                    else
                    {
                        names.Add(node.Name, 0);
                    }
                }
			}
        }

        private void ExportSkin(Transform tr, ExporterEntry entry)
        {
            var skinMesh = tr.GetComponent<SkinnedMeshRenderer>();

            if (skinMesh != null && skinMesh.enabled && CheckSkinValidity(skinMesh, entry) && skinMesh.rootBone != null)
            {
                var node = entry.tr2node[tr];
                node.Skin = entry.SaveSkin(tr);
            }
        }

        private void ExportAnimations(Transform tr, ExporterEntry entry)
        {
            if (tr.GetComponent<UnityEngine.Animation>())
            {
                Debug.LogError("Only support animator now !");
                return;
            }

            var anim = tr.GetComponent<Animator>();
            if (anim)
            {
                entry.SaveAnimations(tr);
            }
        }

        private void ExportExtensions(Transform tr, ExporterEntry entry)
        {
            var node = entry.tr2node[tr];
            foreach (var component in tr.GetComponents<Component>())
            {
                if (ExtensionManager.Component2Extensions.ContainsKey(component.GetType()))
                {
                    if (node.Extensions == null)
                    {
                        node.Extensions = new Dictionary<string, Extension>();
                        ExtensionManager.Serialize(component, entry, node.Extensions);
                    }
                }
            }
        }

        private void ExportCamera(Transform tr, ExporterEntry entry)
        {
            var node = entry.tr2node[tr];
            var camera = tr.GetComponent<UnityEngine.Camera>();

            if (camera != null)
            {
                node.Camera = entry.SaveCamera(camera);
            }
        }

        private void ExportDone(ExporterEntry entry)
        {
            entry.Finish();
        }

        private Renderer GetRenderer(Transform tr)
        {
            Renderer mr = tr.GetComponent<MeshRenderer>();
            if (mr == null)
            {
                mr = tr.GetComponent<SkinnedMeshRenderer>();
            }
            return mr;
        }

        private UnityEngine.Mesh GetMesh(Transform tr)
        {
            var mr = GetRenderer(tr);
            UnityEngine.Mesh m = null;
            if (mr != null && mr.enabled)
            {
                var t = mr.GetType();
                if (t == typeof(MeshRenderer))
                {
                    MeshFilter mf = tr.GetComponent<MeshFilter>();
                    if (!mf)
                    {
                        Debug.Log("The gameObject " + tr.name + " will be exported as Transform (object has no MeshFilter component attached)");
                        return null;
                    }
                    m = mf.sharedMesh;
                }
                else if (t == typeof(SkinnedMeshRenderer))
                {
                    SkinnedMeshRenderer smr = mr as SkinnedMeshRenderer;
                    m = smr.sharedMesh;
                }
            }
            return m;
        }

        private bool CheckSkinValidity(SkinnedMeshRenderer skin, ExporterEntry entry)
        {
            foreach (Transform tr in skin.bones)
            {
                if (!entry.bones.Contains(tr))
                {
                    Debug.LogError("Error while exporting skin for " + skin.name + " (skipping skinning export).\nClick for more details:\n \nThe following bones are used but are not selected" + tr.name + "\n");
                    return false;
                }
            }

            return true;
        }

        public void Update()
        {
            if (!_isDone)
            {
                if (_userStopped)
                {
                    _userStopped = false;
                    Clear();
                    _isDone = true;
                }
                else
                {
                    if (_taskManager != null && _taskManager.play())
                    {
                        // Do stuff
                    }
                    else
                    {
                        _isDone = true;
                        FinishExport();
                    }
                }
            }
        }

        private void Clear()
        {

        }

        private void FinishExport()
        {

        }
    }
}
