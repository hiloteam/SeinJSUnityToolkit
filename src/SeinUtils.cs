using System;
using UnityEditor;
using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;

public class SeinUtils: Editor
{
    public static Texture2D brdfLUT;

    public static bool inited = false;
    public static System.Version version = new System.Version("0.90");
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

    public static void InitGlobals()
    {
        if (brdfLUT == null)
        {
            var brdfPath = "Assets/SeinJSUnityToolkit/Shaders/brdfLUT.jpg";
            var e = File.Exists(brdfPath);
            brdfLUT = AssetDatabase.LoadAssetAtPath<Texture2D>(brdfPath);
        }
    }

    // https://forum.unity.com/threads/specular-convolution-when-calculating-mip-maps-for-cubemap-render-texture.617680/
    public static Cubemap GetSpecularCubeMap(Cubemap srcCubemap) {
        var convolutionMaterial = new Material(Shader.Find("Hidden/CubeBlur"));
        GL.PushMatrix();
        GL.LoadOrtho();
        RenderTexture dstCubemap = new RenderTexture(srcCubemap.width, srcCubemap.height, 0, RenderTextureFormat.ARGBHalf);
        dstCubemap.dimension = UnityEngine.Rendering.TextureDimension.Cube;
        dstCubemap.volumeDepth = 6;
        dstCubemap.wrapMode = TextureWrapMode.Clamp;
        dstCubemap.filterMode = FilterMode.Trilinear;
        dstCubemap.isPowerOfTwo = true;
        dstCubemap.Create();
        var mip = .2f;
        var dstMip = 0;
        var mipRes = srcCubemap.width;

        convolutionMaterial.SetTexture("_MainTex", srcCubemap);
        convolutionMaterial.SetFloat("_Texel", 1f / mipRes);
        convolutionMaterial.SetFloat("_Level", mip);

        convolutionMaterial.SetPass(0);

        Texture2D tex2d = new Texture2D(srcCubemap.width * 6, srcCubemap.height, TextureFormat.RGBAHalf, false);

        // Positive X
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveX);
        GL.Begin(GL.QUADS);
        GL.TexCoord3( 1, 1, 1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3( 1,-1, 1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3( 1,-1,-1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3( 1, 1,-1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 0, 0);
 
        // Negative X
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeX);
        GL.Begin(GL.QUADS);
        GL.TexCoord3(-1, 1,-1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3(-1,-1,-1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3(-1,-1, 1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3(-1, 1, 1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 1, 0);

        // Positive Y
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveY);
        GL.Begin(GL.QUADS);
        GL.TexCoord3(-1, 1,-1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3(-1, 1, 1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3( 1, 1, 1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3( 1, 1,-1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 2, 0);

        // Negative Y
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeY);
        GL.Begin(GL.QUADS);
        GL.TexCoord3(-1,-1, 1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3(-1,-1,-1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3( 1,-1,-1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3( 1,-1, 1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 3, 0);

        // Positive Z
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveZ);
        GL.Begin(GL.QUADS);
        GL.TexCoord3(-1, 1, 1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3(-1,-1, 1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3( 1,-1, 1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3( 1, 1, 1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 4, 0);

        // Negative Z
        Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeZ);
        GL.Begin(GL.QUADS);
        GL.TexCoord3( 1, 1,-1);
        GL.Vertex3(0, 0, 1);
        GL.TexCoord3( 1,-1,-1);
        GL.Vertex3(0, 1, 1);
        GL.TexCoord3(-1,-1,-1);
        GL.Vertex3(1, 1, 1);
        GL.TexCoord3(-1, 1,-1);
        GL.Vertex3(1, 0, 1);
        GL.End();
        tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 5, 0);

        GL.PopMatrix();
        
        tex2d.Apply();

        for (int x = 0; x < tex2d.width; x++)
        {
            for (int y1 = 0, y2 = tex2d.height - 1; y1 < y2; y1++, y2--)
            {
                Color t1 = tex2d.GetPixel(x, y1);
                tex2d.SetPixel(x, y1, tex2d.GetPixel(x, y2));
                tex2d.SetPixel(x, y2, t1);
            }
        }

        DestroyImmediate(dstCubemap);

        var path = "Assets/temp" + DateTime.Now.ToBinary() + ".exr";
        File.WriteAllBytes(path, tex2d.EncodeToEXR());
        AssetDatabase.Refresh();
        TextureImporter im = AssetImporter.GetAtPath(path) as TextureImporter;
        im.isReadable = true;
        im.textureShape = TextureImporterShape.TextureCube;
        im.SaveAndReimport();

        return AssetDatabase.LoadAssetAtPath<Cubemap>(path);
    }

    public static void DeleteTempMap(Cubemap map)
    {
        AssetDatabase.DeleteAsset(AssetDatabase.GetAssetPath(map));
    }
}
