using UnityEngine;
using UnityEditor;
using UniWebServer;
using System.Collections.Generic;
using System.IO;

namespace SeinJS
{
    public class PreviewerHandler: IWebResource
    {
        public void HandleRequest(Request request, Response response)
        {
            //private Dictionary<string, byte[]> _cache;

            var path = request.path.Replace("/previewer", "");
            path = (path == "" || path == "/") ? "/index.html" : path;
            path = path.Substring(1);
            //var query = request.query;
            var ext = Path.GetExtension(path);

            string folder;
            if (ext == ".js" || ext == ".css" || ext == ".html")
            {
                folder = "SeinJSUnityToolkit/Previewer/assets";
            }
            else
            {
                folder = "../sein-previewer-temp-assets";
            }
            folder = Path.GetFullPath(Path.Combine(Config.AppDataPath, folder));
            var fullPath = Path.Combine(folder, path);

            if (!File.Exists(fullPath))
            {
                Previewer.Serve404(request, response);
                return;
            }

            Previewer.ServeFile(fullPath, response);
        }

    }
}
