using System;
using UnityEditor;
using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class SeinUtils: Editor
{
    public static bool inited = false;
    public static System.Version version = new System.Version("0.80");
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
}
