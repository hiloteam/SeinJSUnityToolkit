/**
 * @File   : Previewer.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/26 0:00:00PM
 */
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
    public class Previewer : MonoBehaviour
    {
        private static WebServer _server;
        private static string _localIP;
        private static Dictionary<string, IWebResource> _resources = new Dictionary<string, IWebResource>();

        public static void StartPreview()
        {
            var currentIp = LocalIPAddress();

            if (currentIp != _localIP)
            {
                Clear();
            }

            if (_server == null)
            {
                _localIP = currentIp;
                AddWebResource("/previewer", new PreviewerHandler());
                AddWebResource("/heart-beat-and-update", new HeartBeatHandler());

                _server = new WebServer(9999, 4, false);
                _server.logRequests = false;
                _server.HandleRequest += HandleRequest;
                _server.Start();
            }

            var hhHandler = (HeartBeatHandler)_resources["/heart-beat-and-update"];
            if (hhHandler.isAlive)
            {
                hhHandler.needUpdate = true;
            }
            else
            {
                //Application.OpenURL("http://" + "192.168.50.126" + ":9999/previewer");
                Application.OpenURL("http://" + _localIP + ":9999/previewer");
            }
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
            var temp = request.path.Split('?');
            string[] prefixes = new string[] { };

            if (temp.Length >= 1)
            {
                prefixes = temp[0].Split('/');
            }

            if (temp.Length >= 2)
            {
                request.query = "?" + temp[1];
            }

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
                            if (ip.IsDnsEligible)
                            {
                                return ip.Address.ToString();
                            }
                        }
                    }
                }
            }

            Utils.ThrowExcption("No network adapters with an IPv4 address in the system!");
            return null;
        }

        void OnApplicationQuit()
        {
            Clear();
        }

        static void Clear()
        {

            if (_server != null)
            {
                _server.Dispose();
                _resources.Clear();
                _server = null;
            }
        }

        void Update()
        {
            Debug.Log(1);
            if (_server != null && _server.processRequestsInMainThread)
            {
                _server.ProcessRequests();
            }
        }
    }
}
