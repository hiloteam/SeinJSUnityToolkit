using System;
using System.Collections.Generic;
using System.Reflection;
using UnityEditor;
using UnityEngine;
using UniWebServer;

namespace SeinJS
{
    public class Previewer : EditorWindow
    {
        private static WebViewHook _webView;
        private static WebServer _server;
        private static Dictionary<string, IWebResource> _resources = new Dictionary<string, IWebResource>();

        public static void StartPreview()
        {
            if (_server != null)
            {
                Clear();
            }

            if (_server == null)
            {
                _resources.Add("/previewer", new PreviewerHandler());

                _server = new WebServer(9999, 2, false);
                _server.logRequests = false;
                _server.HandleRequest += HandleRequest;
                _server.Start();
            }

            if (_webView == null)
            {
                _webView = CreateInstance<WebViewHook>();
                var win = GetWindow<Previewer>();
                win.ShowTab();
            }

            _webView.Reload();
        }

        public static void Return404(Response response)
        {
            response.statusCode = 404;
            response.message = "Not Found.";
            response.Write("Not found.");
        }

        private static void HandleRequest(Request request, Response response)
        {
            var prefixes = request.path.Split('/');
            if (prefixes.Length <= 1)
            {
                Return404(response);
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

            Return404(response);
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

        void OnApplicationQuit()
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
                _resources.Clear();
                _server = null;
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
                _webView.LoadURL("http://localhost:9999/previewer");
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
