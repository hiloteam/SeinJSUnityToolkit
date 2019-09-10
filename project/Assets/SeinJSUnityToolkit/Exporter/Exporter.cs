using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

namespace SeinJS
{
    public struct ExportEntry
    {
        public string path;
        public string name;
        public Transform[] transforms;
    }

    public class Exporter
    {
        private EditorExporter _export;

        Exporter()
        {
            _export = new EditorExporter();
        }

        public void Export()
        {
            List<ExportEntry> entries = new List<ExportEntry>();
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
                entries.Add(new ExportEntry
                {
                        path = ExporterSettings.Export.GetExportPath(),
                        name = ExporterSettings.Export.name,
                        transforms = transforms
                    }
                );
            }
            else
            {
                foreach (Transform tr in transforms)
                {
                    entries.Add(new ExportEntry
                    {
                            path = ExporterSettings.Export.GetExportPath(tr.name),
                            name = ExporterSettings.Export.name,
                            transforms = tr.GetComponentsInChildren<Transform>()
                        }
                   );
                }
            }

            _export.Export(entries);
        }
    }
}
