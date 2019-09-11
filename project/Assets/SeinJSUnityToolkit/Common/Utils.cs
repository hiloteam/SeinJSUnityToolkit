using System;
using UnityEditor;
using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using GLTF;
using GLTF.Schema;

namespace SeinJS {
    public class Utils: Editor
    {
        public static Texture2D brdfLUT;

        public static bool inited = false;
        public static System.Version version = new System.Version("0.82");
        static System.Version newVersion = null;

        static string checlUrl = "https://api.github.com/repos/SeinJS/SeinUnityToolkit/git/refs/tags";
        static string url = "https://github.com/SeinJS/SeinUnityToolkit/tree/master/bin";

        static IEnumerator coroutine = null;

        public static IEnumerator CheckForUpdate()
        {
            using (UnityWebRequest www = UnityWebRequest.Get(checlUrl))
            {
                yield return www.SendWebRequest();

                while (!www.isDone)
                {
                    yield return 1;
                }

                if (www.isNetworkError || www.isHttpError)
                {
                    EditorUtility.DisplayDialog(
                        "Error occured while checking for update!",
                        www.error,
                        "OK"
                    );
                    coroutine = null;
                    yield break;
                }

                string response = www.downloadHandler.text;

                if (response == "")
                {
                    coroutine = null;
                    yield break;
                }

                var json = JsonConvert.DeserializeObject<JArray>(response);

                if (json.Count < 1)
                {
                    coroutine = null;
                    yield break;
                }

                var tags = ((string)json[json.Count - 1]["ref"]).Split('/');
                string tag = tags[tags.Length - 1].Replace("v", "");
                newVersion = new System.Version(tag);

                if (newVersion <= version)
                {
                    EditorUtility.DisplayDialog(
                        "This verison is last !",
                        "No need to update tools.",
                        "OK"
                    );
                    coroutine = null;
                    yield break;
                }

                if (EditorUtility.DisplayDialog(
                        "A new version 'v" + newVersion + "' is available",
                        "Download the last version to esure the best experience",
                        "Download",
                        "Cancel"
                    ))
                {
                    coroutine = null;
                    Application.OpenURL(url);
                }
            }
        }

        [MenuItem("SeinJS/Check for update", priority = 3)]
        public static void Init()
        {
            if (!inited)
            {
                EditorApplication.update += EditorUpdate;
            }

            if (coroutine == null)
            {
                coroutine = CheckForUpdate();
            }

            inited = true;
        }

        static void EditorUpdate()
        {
            if (coroutine != null)
            {
                coroutine.MoveNext();
            }
        }

        public static string MakeRelativePath(string fromPath, string toPath)
        {
            if (string.IsNullOrEmpty(fromPath)) throw new ArgumentNullException(nameof(fromPath));
            if (string.IsNullOrEmpty(toPath)) throw new ArgumentNullException(nameof(toPath));

            Uri fromUri = new Uri(fromPath + "/a.txt");
            Uri toUri = new Uri(toPath);

            if (fromUri.Scheme != toUri.Scheme) { return toPath; } // path can't be made relative.

            Uri relativeUri = fromUri.MakeRelativeUri(toUri);
            string relativePath = Uri.UnescapeDataString(relativeUri.ToString()).Replace("/a.txt", "");

            if (toUri.Scheme.Equals("file", StringComparison.InvariantCultureIgnoreCase))
            {
                relativePath = relativePath.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);
            }

            return relativePath;
        }

        public static GLTF.Math.Vector3 convertVector3LeftToRightHandedness(Vector3 v)
        {
            return new GLTF.Math.Vector3(v.x, v.y, -v.z);
        }

        public static GLTF.Math.Vector4 convertVector4LeftToRightHandedness(Vector4 v)
        {
            return new GLTF.Math.Vector4(v.x, v.y, -v.z, -v.w);
        }

        public static GLTF.Math.Quaternion convertQuatLeftToRightHandedness(Quaternion q)
        {
            return new GLTF.Math.Quaternion(q.x, q.y, -q.z, -q.w);
        }
    }
}
