using UnityEngine;
using System.Collections.Generic;
using System;
using UnityEditor;

[CustomEditor(typeof(CustomSeinMaterial))]
public class CustomSeinMaterialInspector : SeinCustomMaterialInspector
{
    public override string[] GetActiveUniforms() {
        return new string[] {
            "uniformsTexture",
            "uniformsFloat",
            "uniformsFloatVec3"
        };
    }
}

public class CustomSeinMaterial : SeinCustomMaterial
{
    CustomSeinMaterial()
    {
        className = "CustomSeinMaterial";
        Array.Resize(ref this.uniformsFloat, 1);
        uniformsFloat.SetValue(new SeinMaterialUniformFloat { name = "haha", value = 1 }, 0);
    }
}
