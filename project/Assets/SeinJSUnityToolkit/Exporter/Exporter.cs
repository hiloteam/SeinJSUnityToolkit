/**
 * @File   : Exportor.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

namespace SeinJS
{
    public class Exporter
    {
        private EditorExporter _export;

        public Exporter()
        {
            _export = new EditorExporter();
        }

        public void Export()
        {
            List<ExporterEntry> entries = new List<ExporterEntry>();
            Transform[] transforms = Selection.GetTransforms(SelectionMode.TopLevel);

            if (transforms.Length == 0)
            {
                var scene = SceneManager.GetActiveScene();
                List<GameObject> rootObjects = new List<GameObject>();
                scene.GetRootGameObjects(rootObjects);
                transforms = new Transform[rootObjects.Count];
                for (int i = 0; i < rootObjects.Count; i += 1)
                {
                    transforms[i] = rootObjects[i].transform;
                }
            }

            foreach (Transform tr in transforms)
            {
                var go = tr.gameObject;
                if (go.GetComponent<SeinNode>() == null)
                {
                    go.AddComponent<SeinNode>();
                }
            }

            if (!ExporterSettings.Export.splitChunks)
            {
                List<Transform> allTrans = new List<Transform>();
                foreach (var rootTrans in transforms)
                {
                    allTrans.AddRange(rootTrans.GetComponentsInChildren<Transform>());
                }

                entries.Add(new ExporterEntry
                {
                        path = ExporterSettings.Export.GetExportPath(),
                        name = ExporterSettings.Export.name,
                        transforms = allTrans.ToArray()
                });
            }
            else
            {
                foreach (Transform tr in transforms)
                {
                    entries.Add(new ExporterEntry
                    {
                            path = ExporterSettings.Export.GetExportPath(tr.name),
                            name = ExporterUtils.CleanPath(tr.name),
                            transforms = tr.GetComponentsInChildren<Transform>()
					});
                }
            }

            _export.Export(entries);
        }
    }
}
