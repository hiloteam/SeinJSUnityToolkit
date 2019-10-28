using System;
using System.Collections.Generic;
using System.IO;
using System.Net.NetworkInformation;
using System.Reflection;
using UnityEditor;
using UnityEngine;
using UniWebServer;

namespace SeinJS
{
    public class Previewer : EditorWindow
    {
        private static WebViewHook _webView;
        private static EditorWindow _webViewWin;
        private static WebServer _server;
        private static string _localIP;
        private static Dictionary<string, IWebResource> _resources = new Dictionary<string, IWebResource>();

        public static void StartPreview()
        {
            //if (_server != null)
            //{
            //    Clear();
            //}

            if (_server == null)
            {
                _localIP = LocalIPAddress();
                AddWebResource("/previewer", new PreviewerHandler());

                _server = new WebServer(9999, 2, false);
                _server.logRequests = false;
                _server.HandleRequest += HandleRequest;
                _server.Start();
            }

            if (_webView == null)
            {
                _webView = CreateInstance<WebViewHook>();
                _webViewWin = GetWindow<Previewer>();
            }

            _webView.Reload();
            _webViewWin.ShowTab();
        }

        public static void Serve404(Request request, Response response)
        {
            response.statusCode = 404;
            response.message = "Not Found.";
            response.Write("Not found: " + request.path);
        }

        public static void ServeFile(string fullPath, Response response)
        {
            var ext = Path.GetExtension(fullPath);
            // serve the file
            response.statusCode = 200;
            response.message = "OK";
            response.headers.Add("Content-Type", MimeTypeMap.GetMimeType(ext));

            // read file and set bytes
            using (FileStream fs = File.OpenRead(fullPath))
            {
                int length = (int)fs.Length;
                byte[] buffer;

                // add content length
                response.headers.Add("Content-Length", length.ToString());

                // use binary for mostly all except text
                using (BinaryReader br = new BinaryReader(fs))
                {
                    buffer = br.ReadBytes(length);
                }
                response.SetBytes(buffer);
            }
        }

        private static void HandleRequest(Request request, Response response)
        {
            var prefixes = request.path.Split('/');
            if (prefixes.Length <= 1)
            {
                Serve404(request, response);
                return;
            }

            var prefix = "/" + prefixes[1];
            if (_resources.ContainsKey(prefix))
            {
                try
                {
                    _resources[prefix].HandleRequest(request, response);
                }
                catch (Exception e)
                {
                    response.statusCode = 500;
                    response.Write(e.Message);
                }

                return;
            }

            Serve404(request, response);
        }

        public static bool AddWebResource(string prefix, IWebResource resource)
        {
            if (_resources.ContainsKey(prefix))
            {
                return false;
            }

            _resources.Add(prefix, resource);

            return true;
        }

        private static string LocalIPAddress()
        {
            foreach(NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (ni.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 || ni.NetworkInterfaceType == NetworkInterfaceType.Ethernet)
                {
                    foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                        {
                            //do what you want with the IP here... add it to a list, just get the first and break out. Whatever.
                            return ip.Address.ToString();
                        }
                    }
                }
            }

            throw new System.Exception("No network adapters with an IPv4 address in the system!");
        }

        public void OnBecameInvisible()
        {
            if (_webView)
            {
                // signal the browser to unhook
                _webView.Detach();
            }
        }

        void OnDestroy()
        {
            Clear();
        }

        static void Clear()
        {
            if (_webView != null)
            {
                DestroyImmediate(_webView);
                _webView = null;
            }

            if (_server != null)
            {
                _server.Dispose();
                DestroyImmediate(_webViewWin);
                _resources.Clear();
                _server = null;
                _webViewWin = null;
            }
        }

        void OnGUI()
        {
            if (_webView == null)
            {
                return;
            }

            if (_webView.Hook(this))
            {
                _webView.LoadURL("http://" + _localIP + ":9999/previewer");
            }

            if (_webView != null)
            {
                _webView.OnGUI(new Rect(Vector2.zero, this.position.size));
            }
        }

        void Update()
        {
            if (_server != null && _server.processRequestsInMainThread)
            {
                _server.ProcessRequests();
            }
        }
    }
}
