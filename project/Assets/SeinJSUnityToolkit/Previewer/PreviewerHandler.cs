/**
 * @File   : PreviewerHandler.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/26 0:00:00PM
 */
using UniWebServer;
using System.IO;

namespace SeinJS
{
    public class PreviewerHandler: IWebResource
    {
        public void HandleRequest(Request request, Response response)
        {
            //private Dictionary<string, byte[]> _cache;

            var query = request.query;
            var path = request.path.Replace("/previewer", "");

            if (request.query != null)
            {
                path = path.Replace(query, "");
            }

            path = (path == "" || path == "/") ? "/index.html" : path;
            path = path.Substring(1);
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
