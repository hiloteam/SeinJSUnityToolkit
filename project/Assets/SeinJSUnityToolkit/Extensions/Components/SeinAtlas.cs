/**
 * @File   : SeinAtlas.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/08 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using Newtonsoft.Json.Linq;
using SeinJS;
using System.IO;
using System.Collections.Generic;
using System;

[CreateAssetMenu(fileName = "SeinAtlas", menuName = "Sein/Atlas")]
public class SeinAtlas : ScriptableObject
{
    private static Texture2D _PURE_WHITE;

    public int maxWidth = 1024;
    public int maxHeight = 1024;
    public int padding = 4;
    public Texture2D[] images;
    public Texture2D atlasTexture;
    public Rect[] rects;
    public string atlasPath;
    public string jsonPath;
    public bool saveAfterPack = true;
    public bool isImageCanRelease = true;

    public Texture2D Get(string frameName)
    {
        for (int i = 0; i < images.Length; i += 1)
        {
            if (Path.GetFileNameWithoutExtension(images[i].name) == frameName)
            {
                return images[i];
            }
        }

        return null;
    }

    public JObject ReadJson()
    {
        return JObject.Parse(File.ReadAllText(jsonPath));
    }

    public void Pack()
    {
        atlasPath = null;
        jsonPath = null;

        //@todo
        if (_PURE_WHITE == null)
        {
            _PURE_WHITE = AssetDatabase.LoadAssetAtPath<Texture2D>("Assets/SeinJSUnityToolkit/Shaders/white.png");
        }

        atlasTexture = new Texture2D(maxWidth, maxHeight);
        Graphics.CopyTexture(_PURE_WHITE, 0, 0, 0, 0, maxWidth, maxHeight, atlasTexture, 0, 0, 0, 0);

        Utils.DoActionForTextures(ref images, (texs) =>
        {
            rects = BinPacker.Pack(texs, atlasTexture, padding);
            atlasTexture.Apply();
        });

        if (rects == null)
        {
            EditorUtility.DisplayDialog("Error!", "Pack failed, atlas' size may be too small !", "OK");
            return;
        }

        if (saveAfterPack)
        {
            Save();
        }
    }

    public void Save()
    {
        if (rects == null)
        {
            EditorUtility.DisplayDialog("Error!", "Before 'Save', you must do 'Pack' successfully !", "Error!");
            return;
        }

        var selfPath = AssetDatabase.GetAssetPath(this);
        var filePath = selfPath.Replace(Path.GetExtension(selfPath), "");
        var atlasPath = filePath + ".png";
        var jsonPath = filePath + ".atlas";

        var fullAtlasPath = Path.GetFullPath(atlasPath);
        byte[] content = atlasTexture.EncodeToPNG();
        File.WriteAllBytes(fullAtlasPath, content);
        AssetDatabase.Refresh();
        var im = AssetImporter.GetAtPath(atlasPath) as TextureImporter;
        im.npotScale = TextureImporterNPOTScale.None;
        im.alphaIsTransparency = true;
        im.mipmapEnabled = false;
        im.SaveAndReimport();

        var fullJsonPath = Path.GetFullPath(jsonPath);
        var frames = new JObject();
        var json = new JObject(
            new JProperty("name", Path.GetFileNameWithoutExtension(name)),
            new JProperty("asset", new JObject(
                new JProperty("generator", Config.GeneratorName),
                new JProperty("version", Config.Version.ToString())
            )),
            new JProperty("frames", frames),
            new JProperty("meta", new JObject(
                new JProperty("image", Path.GetFileName(atlasPath)),
                new JProperty("size", new JObject(
                    new JProperty("w", maxWidth),
                    new JProperty("h", maxHeight)
                ))
            )),
            new JProperty("isImageCanRelease", isImageCanRelease)
        );
        for (int i = 0; i < rects.Length; i += 1)
        {
            var rect = rects[i];
            var img = images[i];
            var frame = new JObject(
                new JProperty("frame", new JObject(
                    new JProperty("x", (int)rect.x),
                    new JProperty("y", (int)rect.y),
                    new JProperty("w", (int)rect.width),
                    new JProperty("h", (int)rect.height)
                )),
                new JProperty("space", padding)
            );
            frames.Add(Path.GetFileNameWithoutExtension(img.name), frame);
        }

        Utils.SaveJson(json, fullJsonPath);

        this.atlasPath = atlasPath;
        this.jsonPath = jsonPath;
    }

    public void Import(string importPath)
    {
        var json = JObject.Parse(File.ReadAllText(importPath));

        Import(json, importPath.Replace(Path.GetFileName(importPath), ""));
    }

    public void Import(JObject json, string srcPath)
    {
        var meta = json.Value<JObject>("meta");
        var frames = json.Value<JObject>("frames");

        if (meta == null || frames == null)
        {
            EditorUtility.DisplayDialog("Error!", "Not an valid atlas json file !", "OK");
            return;
        }

        var imagePath = meta.Value<string>("image");

        if (imagePath == null || imagePath[0] == '/' || imagePath.Substring(0, 4).Equals("http"))
        {
            EditorUtility.DisplayDialog("Error!", "Only support image with relative path ! Current is '" + imagePath + "'", "OK");
            return;
        }

        imagePath = Path.Combine(srcPath, imagePath);

        if (!File.Exists(imagePath))
        {
            EditorUtility.DisplayDialog("Error!", "Image is not exsited! '" + imagePath + "'", "OK");
            return;
        }

        var selfPath = AssetDatabase.GetAssetPath(this);
        var filePath = selfPath.Replace(Path.GetExtension(selfPath), "");
        var dirPath = selfPath.Replace(Path.GetFileName(selfPath), "");
        var atlasPath = filePath + Path.GetExtension(imagePath);
        var jsonPath = filePath + ".atlas";

        try
        {
            File.Copy(imagePath, Path.GetFullPath(atlasPath));
            Utils.SaveJson(json, Path.GetFullPath(jsonPath));
        }
        catch (Exception error)
        {
            EditorUtility.DisplayDialog("Error!", error.Message, "OK");
            return;
        }
        AssetDatabase.Refresh();
        var im = AssetImporter.GetAtPath(atlasPath) as TextureImporter;
        im.npotScale = TextureImporterNPOTScale.None;
        im.alphaIsTransparency = true;
        im.mipmapEnabled = false;
        im.SaveAndReimport();
        var atlasTexture = AssetDatabase.LoadAssetAtPath<Texture2D>(atlasPath);

        Utils.DoActionForTexture(ref atlasTexture, (aTex) =>
        {
            var rects = new List<Rect>();
            var images = new List<Texture2D>();

            foreach (var pair in frames)
            {
                var name = pair.Key;
                var value = pair.Value;
                var frame = (JObject)value["frame"];
                if (value["space"] != null)
                {
                    padding = (int)value["space"];
                }

                var x = frame.Value<int>("x");
                var y = frame.Value<int>("y");
                var w = frame.Value<int>("w");
                var h = frame.Value<int>("h");

                var tex = new Texture2D(w, h);

                try
                {
                    Graphics.CopyTexture(aTex, 0, 0, x, aTex.height - y - h, w, h, tex, 0, 0, 0, 0);
                }
                catch (Exception error)
                {
                    EditorUtility.DisplayDialog("Error!", error.Message, "OK");
                    return;
                }

                var fp = Path.Combine(dirPath, name + ".png");
                byte[] content = tex.EncodeToPNG();
                File.WriteAllBytes(Path.GetFullPath(fp), content);
                AssetDatabase.ImportAsset(fp, ImportAssetOptions.ForceUpdate);
                im = AssetImporter.GetAtPath(fp) as TextureImporter;
                im.npotScale = TextureImporterNPOTScale.None;
                im.alphaIsTransparency = true;
                im.SaveAndReimport();

                images.Add(AssetDatabase.LoadAssetAtPath<Texture2D>(fp));
                rects.Add(new Rect(x, y, w, h));
            }

            maxWidth = atlasTexture.width;
            maxHeight = atlasTexture.height;
            this.atlasTexture = atlasTexture;
            this.images = images.ToArray();
            this.rects = rects.ToArray();
        });

        this.atlasPath = atlasPath;
        this.jsonPath = jsonPath;
    }
}

[CustomEditor(typeof(SeinAtlas))]
public class SeinAtlasEditor : Editor
{
    public override void OnInspectorGUI()
    {
        SeinAtlas atlas = (SeinAtlas)target;
        serializedObject.Update();

        EditorGUILayout.PropertyField(serializedObject.FindProperty("maxWidth"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("maxHeight"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("padding"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("isImageCanRelease"));

        var option = EEditorListOption.ListLabel | EEditorListOption.Buttons;
        EditorList.Show(serializedObject.FindProperty("images"), option);

        EditorGUILayout.PropertyField(serializedObject.FindProperty("saveAfterPack"));
        GUILayout.BeginHorizontal();
        if (GUILayout.Button("Pack", GUILayout.Width(80), GUILayout.Height(40)))
        {
            atlas.Pack();
        }
        GUILayout.FlexibleSpace();
        if (GUILayout.Button("Save", GUILayout.Width(80), GUILayout.Height(40)))
        {
            atlas.Save();
        }
        GUILayout.FlexibleSpace();
        if (GUILayout.Button("Import", GUILayout.Width(80), GUILayout.Height(40)))
        {
            if (atlas != null && atlas.images != null && atlas.images.Length != 0)
            {
                if (EditorUtility.DisplayDialog(
                        "This atlas is not empty",
                        "New atlas will overwrite it !",
                        "Continue",
                        "Cancel"
                    ))
                {
                    DoImport(atlas);
                }
            }
            else
            {
                DoImport(atlas);
            }
        }
        GUILayout.EndHorizontal();

        GUILayout.Label("Final Atlas");
        GUILayout.Label(atlas.atlasTexture);

        serializedObject.ApplyModifiedProperties();
    }

    private void DoImport(SeinAtlas atlas)
    {
        var fp = EditorUtility.OpenFilePanel("Choose atlas file", "", "atlas,json");

        if (fp == "")
        {

        }
        else
        {
            atlas.Import(fp);
        }
    }
}
