/**
 * @File   : SeinSprite.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/09 0:00:00PM
 */
using UnityEngine;
using System.Collections;
using UnityEditor;

[AddComponentMenu("Sein/Core Components/Sein Sprite"), ExecuteInEditMode]
public class SeinSprite : MonoBehaviour
{
    public float width;
    public float height;
    public SeinAtlas atlas;
    public string frameName;
    public bool isBiilboard = false;
    public bool frustumTest = true;
    // materialOptions

    private SeinAtlas _preAtlas;
    private string _preFrameName;

    public void Generate()
    {
        if (width == 0 || height == 0)
        {
            EditorUtility.DisplayDialog("Error!", "Width and height can not be zero!", "OK");
            return;
        }

        if (!GetComponent<MeshFilter>())
        {
            gameObject.AddComponent<MeshFilter>().mesh = new Mesh();
        }
        var mesh = GetComponent<MeshFilter>().sharedMesh;
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

        mesh.vertices = vs;
        mesh.uv = uv;
        mesh.triangles = trs;

        if (!GetComponent<MeshRenderer>())
        {
            var mr = gameObject.AddComponent<MeshRenderer>();
            var mat = new Material(Shader.Find("Sein/Sprite"));
            mr.sharedMaterial = mat;
            mr.sharedMaterial.hideFlags = HideFlags.HideInInspector;
        }
    }

    public void OnValidate()
    {
        if (!GetComponent<MeshFilter>())
        {
            return;
        }

        if (_preAtlas != atlas || _preFrameName != frameName)
        {
            var tex = atlas.Get(frameName);
            var mat = GetComponent<MeshRenderer>().sharedMaterial;
            mat.SetTexture("_MainTex", tex);
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

        if (isBiilboard) {
            transform.rotation = cam.transform.rotation;
        }
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
        EditorGUILayout.PropertyField(serializedObject.FindProperty("isBiilboard"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("frustumTest"));

        if (GUILayout.Button("Generate", GUILayout.Width(160), GUILayout.Height(32)))
        {
            sprite.Generate();
        }

        serializedObject.ApplyModifiedProperties();
    }
}
