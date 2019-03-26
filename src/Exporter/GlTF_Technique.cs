#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Technique : GlTF_Writer {
	public enum Type {
        UNKNOWN = 0,
		FLOAT = 5126,
		FLOAT_VEC2 = 35664,
		FLOAT_VEC3 = 35665,
		FLOAT_VEC4 = 35666,
		FLOAT_MAT3 = 35675,
		FLOAT_MAT4 = 35676,
		SAMPLER_2D = 35678
	}

	public enum Semantic {
		UNKNOWN,
		POSITION,
		NORMAL,
		TEXCOORD_0,
		TEXCOORD_1,
		TEXCOORD_2,
		TEXCOORD_3,
		MODELVIEW,
		PROJECTION,
        MODELVIEWPROJECTION,
        MODELVIEWINVERSETRANSPOSE
	}

    public class Attribute {
		public string name;
        public Type type;
        public Semantic semantic;
	}

	public class Uniform {
        public string name;
        public Type type;
		public Semantic semantic;
        public bool isDefault = false;
    }

	public int program;
    public List<Attribute> attributes = new List<Attribute>();
	public List<Uniform> uniforms = new List<Uniform>();

	public static string GetNameFromObject(Object o)
	{
		return "technique_" + GlTF_Writer.GetNameFromObject(o);
	}

	public void AddDefaultUniforms()
	{
		var uni = new Uniform();
		uni.name = "u_modelViewMatrix";
        uni.semantic = Semantic.MODELVIEW;
        uni.type = Type.FLOAT_MAT4;
        uni.isDefault = true;
        uniforms.Add(uni);

		uni = new Uniform();
		uni.name = "u_projectionMatrix";
        uni.semantic = Semantic.PROJECTION;
        uni.type = Type.FLOAT_MAT4;
        uni.isDefault = true;
        uniforms.Add(uni);

        uni = new Uniform();
        uni.name = "u_modelViewProjectionMatrix";
        uni.semantic = Semantic.MODELVIEWPROJECTION;
        uni.type = Type.FLOAT_MAT4;
        uni.isDefault = true;
        uniforms.Add(uni);

        uni = new Uniform();
        uni.name = "u_normalMatrix";
        uni.semantic = Semantic.MODELVIEWINVERSETRANSPOSE;
        uni.type = Type.FLOAT_MAT3;
        uni.isDefault = true;
        uniforms.Add(uni);
	}

    public string generateShaderHeader(bool isVS)
    {
        var header = isVS ? "precision HILO_MAX_VERTEX_PRECISION float;\n" : "precision HILO_MAX_FRAGMENT_PRECISION float;\n";

        if (isVS)
        {
            foreach (var a in attributes)
            {
                header += "attribute " + TypeToShader(a.type) + " " + a.name + ";\n";
            }
        }

        foreach (var u in uniforms)
        {
            if (u.isDefault)
            {
                header += "uniform " + TypeToShader(u.type) + " " + u.name + ";\n";
            }
        }

        return header;
    }

    protected string TypeToShader(Type type)
    {
        switch (type)
        {
            case Type.FLOAT:
                return "float";
            case Type.FLOAT_MAT3:
                return "mat3";
            case Type.FLOAT_MAT4:
                return "mat4";
            case Type.FLOAT_VEC2:
                return "vec2";
            case Type.FLOAT_VEC3:
                return "vec3";
            case Type.FLOAT_VEC4:
                return "vec4";
            case Type.SAMPLER_2D:
                return "sampler2D";
        }

        return "";
    }

    public override void Write()
	{
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"program\": " + program +",\n");

		Indent();		jsonWriter.Write ("\"attributes\": {\n");
		IndentIn();
		foreach (var a in attributes)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"" + a.name + "\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"semantic\": \"" + a.semantic + "\"\n");
            IndentOut();
            Indent(); jsonWriter.Write("}");
        }
		jsonWriter.Write ("\n");
		IndentOut();
		Indent();		jsonWriter.Write ("},\n");

		Indent();		jsonWriter.Write ("\"uniforms\": {\n");
		IndentIn();
		foreach (var u in uniforms)
		{
            CommaNL();
            Indent(); jsonWriter.Write("\"" + u.name + "\": {\n");
            IndentIn();
            if (u.semantic != Semantic.UNKNOWN)
            {
                Indent(); jsonWriter.Write("\"semantic\": \"" + u.semantic + "\"");
                if (u.type != Type.UNKNOWN)
                {
                    jsonWriter.Write(",\n");
                }
                else
                {
                    jsonWriter.Write("\n");
                }
            }
            if (u.type != Type.UNKNOWN)
            {
                Indent(); jsonWriter.Write("\"type\": " + (int)u.type + "\n");
            }
            IndentOut();
            Indent(); jsonWriter.Write("}");
        }
		jsonWriter.Write ("\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif