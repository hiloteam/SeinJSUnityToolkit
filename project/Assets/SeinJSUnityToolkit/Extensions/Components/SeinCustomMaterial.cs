using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using GLTF.Schema;
using SeinJS;

public enum ESeinMaterialUniformType
{
    SAMPLER_2D = 35678,
    SAMPLER_CUBE = 35680,
    FLOAT = 5126,
    FLOAT_VEC2 = 35664,
    FLOAT_VEC3 = 35665,
    FLOAT_VEC4 = 35666,
    FLOAT_MAT2 = 35674,
    FLOAT_MAT3 = 35675,
    FLOAT_MAT4 = 35677,
    INT = 5124,
    INT_VEC2 = 35667,
    INT_VEC3 = 35668,
    INT_VEC4 = 35669
};

public class SeinMaterialUniform<TValue>
{
    [System.NonSerialized]
    public ESeinMaterialUniformType type;
    public string name;
    public TValue value;
}

[System.Serializable] public class SeinMaterialUniformTexture : SeinMaterialUniform<Texture2D> {
    [System.NonSerialized]
    public TextureId id;
    public SeinMaterialUniformTexture() { type = ESeinMaterialUniformType.SAMPLER_2D; }
}
[System.Serializable] public class SeinMaterialUniformCubeTexture : SeinMaterialUniform<Cubemap> {
    [System.NonSerialized]
    public CubeTextureId id;
    public SeinMaterialUniformCubeTexture() { type = ESeinMaterialUniformType.SAMPLER_CUBE; }
}
[System.Serializable] public class SeinMaterialUniformFloat : SeinMaterialUniform<float> { public SeinMaterialUniformFloat() { type = ESeinMaterialUniformType.FLOAT; } }
[System.Serializable] public class SeinMaterialUniformFloatVec2 : SeinMaterialUniform<Vector2> { public SeinMaterialUniformFloatVec2() { type = ESeinMaterialUniformType.FLOAT_VEC2; } }
[System.Serializable] public class SeinMaterialUniformFloatVec3 : SeinMaterialUniform<Vector3> { public SeinMaterialUniformFloatVec3() { type = ESeinMaterialUniformType.FLOAT_VEC3; } }
[System.Serializable] public class SeinMaterialUniformFloatVec4 : SeinMaterialUniform<Vector4> { public SeinMaterialUniformFloatVec4() { type = ESeinMaterialUniformType.FLOAT_VEC4; } }
[System.Serializable] public class SeinMaterialUniformColor : SeinMaterialUniform<Color> { public SeinMaterialUniformColor() { type = ESeinMaterialUniformType.FLOAT_VEC4; } }
[System.Serializable] public class SeinMaterialUniformFloatMat2 : SeinMaterialUniform<Matrix4x4> { public SeinMaterialUniformFloatMat2() { type = ESeinMaterialUniformType.FLOAT_MAT2; } }
[System.Serializable] public class SeinMaterialUniformFloatMat3 : SeinMaterialUniform<Matrix4x4> { public SeinMaterialUniformFloatMat3() { type = ESeinMaterialUniformType.FLOAT_MAT3; } }
[System.Serializable] public class SeinMaterialUniformFloatMat4 : SeinMaterialUniform<Matrix4x4> { public SeinMaterialUniformFloatMat4() { type = ESeinMaterialUniformType.FLOAT_MAT4; } }
[System.Serializable] public class SeinMaterialUniformInt : SeinMaterialUniform<int> { public SeinMaterialUniformInt() { type = ESeinMaterialUniformType.INT; } }
[System.Serializable] public class SeinMaterialUniformIntVec2 : SeinMaterialUniform<Vector2> { public SeinMaterialUniformIntVec2() { type = ESeinMaterialUniformType.INT_VEC2; } }
[System.Serializable] public class SeinMaterialUniformIntVec3 : SeinMaterialUniform<Vector3> { public SeinMaterialUniformIntVec3() { type = ESeinMaterialUniformType.INT_VEC3; } }
[System.Serializable] public class SeinMaterialUniformIntVec4 : SeinMaterialUniform<Vector4> { public SeinMaterialUniformIntVec4() { type = ESeinMaterialUniformType.INT_VEC4; } }

[System.Serializable] public class SeinMaterialCustomOption
{
    public string name;
    public string value;
}

[CustomEditor(typeof(SeinCustomMaterial))]
public class SeinCustomMaterialInspector : Editor
{
    public virtual string[] GetActiveUniforms() {
        return new string[] {
            "uniformsTexture",
            "uniformsCubeTexture",
            "uniformsFloat",
            "uniformsFloatVec2",
            "uniformsFloatVec3",
            "uniformsFloatVec4",
            "uniformsColor",
            "uniformsFloatMat2",
            "uniformsFloatMat3",
            "uniformsFloatMat4",
            "uniformsInt",
            "uniformsIntVec2",
            "uniformsIntVec3",
            "uniformsIntVec4"
       };
    }

    public override void OnInspectorGUI()
    {
        serializedObject.Update();
        EditorGUILayout.PropertyField(serializedObject.FindProperty("className"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("unityMaterialName"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("renderOrder"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("cloneForInst"));
        EditorGUILayout.PropertyField(serializedObject.FindProperty("transparent"));

        var option = EEditorListOption.ListLabel | EEditorListOption.Buttons | EEditorListOption.ElementLabels;

        EditorList.Show(serializedObject.FindProperty("cutomOptions"), option);

        var activeUniforms = GetActiveUniforms();
        foreach (string key in activeUniforms)
        {
            EditorList.Show(serializedObject.FindProperty(key), option);
        }

        serializedObject.ApplyModifiedProperties();
    }
}

[AddComponentMenu("Sein/Core Components/Sein Custom Material")]
public class SeinCustomMaterial : MonoBehaviour
{
    public string className = "";
    public string unityMaterialName = "";
    public string matScriptPath = null;

    [Header("Options")]
    public int renderOrder = 0;
    public bool cloneForInst = false;
    public bool transparent = false;
    public SeinMaterialCustomOption[] customOptions = { };

    [Header("Uniforms")]
    public SeinMaterialUniformTexture[] uniformsTexture = { };
    public SeinMaterialUniformCubeTexture[] uniformsCubeTexture = { };
    public SeinMaterialUniformFloat[] uniformsFloat = { };
    public SeinMaterialUniformFloatVec2[] uniformsFloatVec2 = { };
    public SeinMaterialUniformFloatVec3[] uniformsFloatVec3 = { };
    public SeinMaterialUniformFloatVec4[] uniformsFloatVec4 = { };
    public SeinMaterialUniformColor[] uniformsColor = { };
    public SeinMaterialUniformFloatMat2[] uniformsFloatMat2 = { };
    public SeinMaterialUniformFloatMat3[] uniformsFloatMat3 = { };
    public SeinMaterialUniformFloatMat4[] uniformsFloatMat4 = { };
    public SeinMaterialUniformInt[] uniformsInt = { };
    public SeinMaterialUniformIntVec2[] uniformsIntVec2 = { };
    public SeinMaterialUniformIntVec3[] uniformsIntVec3 = { };
    public SeinMaterialUniformIntVec4[] uniformsIntVec4 = { };
}
