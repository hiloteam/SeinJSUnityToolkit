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
                entries.Add(new ExporterEntry
                {
                        path = ExporterSettings.Export.GetExportPath(),
                        name = ExporterSettings.Export.name,
                        transforms = Selection.GetTransforms(SelectionMode.Deep)
				});
            }
            else
            {
                foreach (Transform tr in transforms)
                {
                    entries.Add(new ExporterEntry
                    {
                            path = ExporterSettings.Export.GetExportPath(tr.name),
                            name = ExporterSettings.Export.name,
                            transforms = tr.GetComponentsInChildren<Transform>()
					});
                }
            }

            _export.Export(entries);
        }
    }
}
