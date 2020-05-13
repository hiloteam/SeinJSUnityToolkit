using UnityEngine;
using UnityEditor;
using SeinJS;
using System.IO;

[AddComponentMenu("Sein/Classes/Test Actor")]
public class SeinNodeClass_TestActor : SeinNodeClass
{
    [System.Serializable]
    public struct TestActorComplex
    {
        public int x;
        public float y;
        public Color z;
        public Material w;
    }

    [System.Serializable]
    public struct TestActorOptions
    {
        public int a;
        public float b;
        public string c;
        public bool d;
        public Texture2D e;
        public Vector2 f;
        public Vector3 g;
        public Vector4 h;
        public Quaternion i;
        public Color j;
        public float[] k;
        public Matrix4x4 l;
        public Material m;
        public TestActorComplex n;
    }

    public new TestActorOptions options;

    [MenuItem("GameObject/TestSeinNodeClass", priority = 11)]
    private static void TTT()
    {
        var transforms = Selection.GetTransforms(SelectionMode.Deep);
        var go = transforms[0].gameObject;

        var com = go.GetComponent<SeinNodeClass>();

        if (com != null)
        {
            var res = com.Serialize(null, new Sein_nodeExtension());
            var serializer = new Newtonsoft.Json.JsonSerializer();
            serializer.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            serializer.Formatting = Newtonsoft.Json.Formatting.Indented;
            using (var sw = new StreamWriter("/Users/dtysky/Downloads/testsss.json"))
            using (var writer = new Newtonsoft.Json.JsonTextWriter(sw))
            {
                serializer.Serialize(writer, res);
            }
        }
    }
}
