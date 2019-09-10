using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

namespace SeinJS
{
    public class EditorExporter
    {
        ExporterAssetsManager _assets;
        //public delegate void ProgressCallback(string step, string details, int current, int total);

        public EditorExporter()
        {
            _assets = new ExporterAssetsManager();
        }

        public void Export(List<ExportEntry> entries)
        {

        }

        private IEnumerator ExportOne(ExportEntry entry)
        {

        }
    }
}
