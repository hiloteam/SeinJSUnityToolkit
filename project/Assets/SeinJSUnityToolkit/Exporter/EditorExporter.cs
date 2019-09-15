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

        public void Export(List<ExportorEntry> entries)
        {
            _isDone = false;
            _userStopped = false;

            foreach (var entry in entries)
            {
                ExportOne(entry);
            }
        }

        private void ExportOne(ExportorEntry entry)
        {
            var root = entry.root;
            root.Asset = new Asset();
            root.Asset.Generator = "Sein.js Unity Toolkit";
            root.Asset.Version = "2.0";
            root.Asset.Extras = new JProperty("exporterVersion", Utils.version.ToString());
            root.Scenes.Add(new Scene());
            root.Scene = new SceneId{ Id = 0 };

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

                //if (ExporterSettings.Lighting.ambient)
                //{
                //    var root = entry.root;
                //    var node = new Node();
                //    node.Name = "sein-ambient-light";
                //    root.Nodes.Add(node);
                //}

                ExportNode(tr, entry);
            }
        }

        private void ExportNode(Transform tr, ExportorEntry entry)
        {
            var id = entry.SaveNode(tr);
            if (!tr.parent)
            {
                entry.root.Scene.Value.Nodes.Add(id);
            }
            else
            {
                entry.tr2node[tr.parent].Children.Add(id);
            }

            ExportMesh(tr, entry);
        }

        private void ExportMesh(Transform tr, ExportorEntry entry)
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
                int i = 0;
                var materials = renderer.sharedMaterials;
                foreach (var primitive in id.Value.Primitives)
                {
                    if (i >= materials.Length)
                    {
                        break;
                    }

                    ExportMaterial(materials[i], primitive, entry);
                    i += 1;
                }
            }
        }


        private void ExportMaterial(UnityEngine.Material material, MeshPrimitive primitive, ExportorEntry entry)
        {
            var id = entry.SaveMaterial(material);
            primitive.Material = id;
        }

        private void ExportTexture()
        {

        }

        private void ExportCamera()
        {

        }

        private void ExportLight()
        {

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
