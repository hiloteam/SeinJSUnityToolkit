#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Material : GlTF_Writer {
    public SeinCustomMaterial seinCustomMaterial = null;

    public class Value : GlTF_Writer {
    }

    public class ColorValue : Value {
        public Color color;
        public bool isRGB = false;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": [");
            jsonWriter.Write(color.r.ToString() + ", " + color.g.ToString() + ", " + color.b.ToString() + (isRGB ? "" : ", " + color.a.ToString()));
            jsonWriter.Write("]");
        }
    }

    public class VectorValue : Value {
        public Vector4 vector;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": [");
            jsonWriter.Write(vector.x.ToString() + ", " + vector.y.ToString() + ", " + vector.z.ToString() + ", " + vector.w.ToString());
            jsonWriter.Write("]");
        }
    }

    public class FloatValue : Value {
        public float value;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": " + value);
        }
    }

    public class IntValue : Value
    {
        public int value;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": " + value);
        }
    }

    public class BoolValue : Value
    {
        public bool value;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": " + (value ? "true" : "false"));
        }
    }

    public class StringValue : Value {
        public string value;

        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\": \"" + value + "\"");
        }
    }

    public class DictValue : Value
    {
        public Dictionary<string, int> intValue;
        public Dictionary<string, float> floatValue;
        public Dictionary<string, string> stringValue;
        public DictValue()
        {
            intValue = new Dictionary<string, int>();
            floatValue = new Dictionary<string, float>();
            stringValue = new Dictionary<string, string>();
        }
        public override void Write()
        {
            jsonWriter.Write("\"" + name + "\" : {\n");
            IndentIn();

            foreach (string key in intValue.Keys)
            {
                CommaNL();
                Indent(); jsonWriter.Write("\"" + key + "\" : " + intValue[key]);
            }
            foreach (string key in floatValue.Keys)
            {
                CommaNL();
                Indent(); jsonWriter.Write("\"" + key + "\" : " + floatValue[key]);
            }
            foreach (string key in stringValue.Keys)
            {
                CommaNL();
                Indent(); jsonWriter.Write("\"" + key + "\" : " + stringValue[key]);
            }
            jsonWriter.Write("\n");
            IndentOut();
            Indent(); jsonWriter.Write("}");
        }
    }

    public bool useKHRTechnique = false;
    public int instanceTechniqueIndex;
    public bool isMetal = false;
    public float shininess;
    public List<Value> values = new List<Value>();
    public List<Value> pbrValues = new List<Value>();
    public List<Value> khrValues = new List<Value>();

    public static string GetNameFromObject(Object o)
    {
        return "material_" + GlTF_Writer.GetNameFromObject(o, true);
    }

    private void WirteCustomUiforms<TValue>(SeinMaterialUniform<TValue>[] uniforms) {
        foreach (SeinMaterialUniform<TValue> uniform in uniforms)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"" + uniform.name + "\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"type\": " + (int)uniform.type + ",\n");
            switch (uniform.type)
            {
                case (ESeinMaterialUniformType.FLOAT):
                case (ESeinMaterialUniformType.INT):
                    Indent(); jsonWriter.Write("\"value\": " + uniform.value + "\n");
                    break;
                case (ESeinMaterialUniformType.SAMPLER_2D):
                    Indent(); jsonWriter.Write("\"value\": {\"index\": " + (uniform as SeinMaterialUniformTexture).index + "}\n");
                    break;
                // todo: support cubemap
                case (ESeinMaterialUniformType.SAMPLER_CUBE):
                    break;
                case (ESeinMaterialUniformType.INT_VEC2):
                case (ESeinMaterialUniformType.INT_VEC3):
                case (ESeinMaterialUniformType.INT_VEC4):
                    Indent(); jsonWriter.Write("\"value\": " + (uniform as SeinMaterialUniformIntVec3).value.ToString("F0").Replace("(", "[").Replace(")", "]") + "\n");
                    break;
                default:
                    Indent(); jsonWriter.Write("\"value\": " + (uniform as SeinMaterialUniformFloatVec3).value.ToString("G4").Replace("(", "[").Replace(")", "]") + "\n");
                    break;
            }
            IndentOut();
            Indent(); jsonWriter.Write("}");
        }
    }

	public override void Write()
	{
		Indent(); jsonWriter.Write("{\n");
		IndentIn();
		writeExtras();

        if (seinCustomMaterial)
        {
            Indent(); jsonWriter.Write("\"extensions\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"Sein_customMaterial\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"className\": \"" + seinCustomMaterial.className + "\",\n");
            Indent(); jsonWriter.Write("\"cloneForInst\": " + (seinCustomMaterial.cloneForInst ? "true" : "false") + ",\n");
            Indent(); jsonWriter.Write("\"uniforms\": {\n");
            IndentIn();
            WirteCustomUiforms(seinCustomMaterial.uniformsTexture);
            WirteCustomUiforms(seinCustomMaterial.uniformsCubeTexture);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloat);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatVec2);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatVec3);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatVec4);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatMat2);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatMat3);
            WirteCustomUiforms(seinCustomMaterial.uniformsFloatMat4);
            WirteCustomUiforms(seinCustomMaterial.uniformsInt);
            WirteCustomUiforms(seinCustomMaterial.uniformsIntVec2);
            WirteCustomUiforms(seinCustomMaterial.uniformsIntVec3);
            WirteCustomUiforms(seinCustomMaterial.uniformsIntVec4);
            jsonWriter.Write("\n");
            IndentOut();
            Indent(); jsonWriter.Write("}\n");
            IndentOut();
            Indent(); jsonWriter.Write("}\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        } else if (useKHRTechnique) {
            Indent(); jsonWriter.Write("\"extensions\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"KHR_techniques_webgl\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"technique\": " + instanceTechniqueIndex + ",\n");
            Indent(); jsonWriter.Write("\"values\": {\n");
            IndentIn();
            foreach (var v in khrValues)
            {
                CommaNL();
                Indent(); v.Write();
            }
            jsonWriter.Write("\n");
            IndentOut();
            Indent(); jsonWriter.Write("}\n");
            IndentOut();
            Indent(); jsonWriter.Write("}\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        } else if (Exporter.opt_noLighting)
        {
            Indent(); jsonWriter.Write("\"pbrMetallicRoughness\": {\n");
            IndentIn();
            foreach (var v in pbrValues)
            {
                if (v.name == "baseColorFactor" || v.name == "baseColorTexture")
                {
                    CommaNL();
                    Indent(); v.Write();
                }
            }

            jsonWriter.Write("\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");

            Indent(); jsonWriter.Write("\"extensions\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"KHR_materials_unlit\": {}\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }
        else
        {
            if (isMetal)
            {
                Indent(); jsonWriter.Write("\"pbrMetallicRoughness\": {\n");
            }
            else
            {
                Indent(); jsonWriter.Write("\"extensions\": {\n");
                IndentIn();

                Indent(); jsonWriter.Write("\"KHR_materials_pbrSpecularGlossiness\": {\n");
            }
            IndentIn();
            foreach (var v in pbrValues)
            {
                CommaNL();
                Indent(); v.Write();
            }
            if (!isMetal)
            {
                IndentOut();
                Indent(); jsonWriter.Write("}");
                jsonWriter.Write("\n");
            }

            jsonWriter.Write("\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }

		// write common values
		foreach (var v in values)
		{
			CommaNL();
			Indent(); v.Write();
		}
		CommaNL();
		Indent();		jsonWriter.Write ("\"name\": \"" + name + "\"\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");

	}

}
#endif