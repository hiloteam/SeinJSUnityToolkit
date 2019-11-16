/**
 * @File   : SeinSprite.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/09 0:00:00PM
 */
using UnityEngine;
using System.Collections;
using UnityEditor;
using System.IO;

[AddComponentMenu("Sein/Core Components/Sein Sprite"), ExecuteInEditMode]
public class SeinSprite : MonoBehaviour
{
    private static string SPRITE_DATA_DIR_PATH = "Assets/SeinSpriteData";

    public float width;
    public float height;
    public SeinAtlas atlas;
    public string frameName;
    public bool isBillboard = false;
    public bool frustumTest = true;
    // materialOptions

    private SeinAtlas _preAtlas;
    private string _preFrameName;
    private Mesh _mesh;
    private Material _material;

    public void Generate()
    {
        if (width == 0 || height == 0)
        {
            EditorUtility.DisplayDialog("Error!", "Width and height can not be zero!", "OK");
            return;
        }

        if (!GetComponent<MeshFilter>())
        {
            _mesh = new Mesh();
            if (!Directory.Exists(SPRITE_DATA_DIR_PATH))
            {
                Directory.CreateDirectory(SPRITE_DATA_DIR_PATH);
            }
            var meshPath = SPRITE_DATA_DIR_PATH + "/" + GetInstanceID().ToString() + ".asset";
            AssetDatabase.CreateAsset(_mesh, meshPath);
            _mesh = AssetDatabase.LoadAssetAtPath<Mesh>(meshPath);
            gameObject.AddComponent<MeshFilter>().mesh = _mesh;
        }
        var vs = new Vector3[] {
            new Vector3(-width / 2, height / 2, 0),
            new Vector3(width / 2, height / 2, 0),
            new Vector3(width / 2, -height / 2, 0),
            new Vector3(-width / 2, -height / 2, 0)
        };
        var uv = new Vector2[] {
            new Vector2(0, 1),
            new Vector2(1, 1),
            new Vector2(1, 0),
            new Vector2(0, 0)
        };
        var trs = new int[] { 0, 1, 2, 3, 0, 2 };

        _mesh.vertices = vs;
        _mesh.uv = uv;
        _mesh.triangles = trs;

        if (!GetComponent<MeshRenderer>())
        {
            var mr = gameObject.AddComponent<MeshRenderer>();
            _material = new Material(Shader.Find("Sein/Sprite"));
            var matPath = SPRITE_DATA_DIR_PATH + "/" + GetInstanceID().ToString() + ".mat";
            AssetDatabase.CreateAsset(_material, matPath);
            _material = AssetDatabase.LoadAssetAtPath<Material>(matPath);
            _material.hideFlags = HideFlags.HideInInspector;
            mr.sharedMaterial = _material;
        }

        AssetDatabase.SaveAssets();
    }

    public void SetFrame(SeinAtlas atlas, string frameName)
    {
        var tex = atlas.Get(frameName);
        _material.SetTexture("_MainTex", tex);
    }

    public void OnValidate()
    {
        if (!GetComponent<MeshFilter>())
        {
            return;
        }

        if (_preAtlas != atlas || _preFrameName != frameName)
        {
            if (_material)
            {
                SetFrame(atlas, frameName);
            }
        }

        _preAtlas = atlas;
        _preFrameName = frameName;
    }

    void Update()
    {
        var cam = Camera.main;
        if (cam == null)
        {
            return;
        }

        if (isBillboard) {
            transform.rotation = cam.transform.rotation;
        }
    }

    [MenuItem("GameObject/Sein/Create Sprite", priority = 11)]
    private static void CreateGO()
    {
        var go = new GameObject("SeinSprite");
        var sprite = go.AddComponent<SeinSprite>();
        sprite.width = 1;
        sprite.height = 1;
        sprite.Generate();
    }
}

[CustomEditor(typeof(SeinSprite))]
public class SeinSpriteEditor : Editor
{
    public override void OnInspectorGUI()
    {
        SeinSprite sprite = (SeinSprite)target;
        serializedObject.Update();

        EditorGUILayout.PropertyField(serializedObject.FindProperty("width"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("height"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("atlas"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("frameName"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("isBillboard"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("frustumTest"));

        if (GUILayout.Button("Generate", GUILayout.Width(160), GUILayout.Height(32)))
        {
            sprite.Generate();
        }

        serializedObject.ApplyModifiedProperties();
    }
}
