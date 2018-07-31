#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Technique : GlTF_Writer {
	public enum Type {
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
		MODELVIEWINVERSETRANSPOSE
	}

	public class Parameter {
		public string name;
		public Type type;
		public Semantic semantic = Semantic.UNKNOWN;
	}

	public class Attribute {
		public string name;
		public string param;
	}

	public class Uniform {
		public string name;
		public string param;
	}

	public string program;
	public List<Attribute> attributes = new List<Attribute>();
	public List<Parameter> parameters = new List<Parameter>();
	public List<Uniform> uniforms = new List<Uniform>();

	public static string GetNameFromObject(Object o)
	{
		return "technique_" + GlTF_Writer.GetNameFromObject(o);
	}

	public void AddDefaultUniforms()
	{
		var tParam = new Parameter();
		tParam.name = "modelViewMatrix";
		tParam.type = Type.FLOAT_MAT4;
		tParam.semantic = Semantic.MODELVIEW;
		parameters.Add(tParam);
		var uni = new Uniform();
		uni.name = "u_modelViewMatrix";
		uni.param = tParam.name;
		uniforms.Add(uni);

		tParam = new Parameter();
		tParam.name = "projectionMatrix";
		tParam.type = Type.FLOAT_MAT4;
		tParam.semantic = Semantic.PROJECTION;
		parameters.Add(tParam);
		uni = new Uniform();
		uni.name = "u_projectionMatrix";
		uni.param = tParam.name;
		uniforms.Add(uni);

		tParam = new Parameter();
		tParam.name = "normalMatrix";
		tParam.type = Type.FLOAT_MAT3;
		tParam.semantic = Semantic.MODELVIEWINVERSETRANSPOSE;
		parameters.Add(tParam);
		uni = new Uniform();
		uni.name = "u_normalMatrix";
		uni.param = tParam.name;
		uniforms.Add(uni);
	}

	public override void Write()
	{
		Indent();		jsonWriter.Write ("\"" + name + "\": {\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"program\": \"" + program +"\",\n");
		Indent();		jsonWriter.Write ("\"parameters\": {\n");
		IndentIn();
		foreach (var p in parameters)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"" + p.name + "\": {\n");
			IndentIn();
			Indent();	jsonWriter.Write ("\"type\": " + (int)p.type);
			if (p.semantic != Semantic.UNKNOWN)
			{
				jsonWriter.Write (",\n");
				Indent();	jsonWriter.Write ("\"semantic\": \"" + p.semantic + "\"\n");
			} else {
				jsonWriter.Write ("\n");
			}
			IndentOut();
			Indent();	jsonWriter.Write ("}");
		}
		jsonWriter.Write ("\n");
		IndentOut();
		Indent();		jsonWriter.Write ("},\n");

		Indent();		jsonWriter.Write ("\"attributes\": {\n");
		IndentIn();
		foreach (var a in attributes)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"" + a.name + "\": \"" + a.param + "\"");
		}
		jsonWriter.Write ("\n");
		IndentOut();
		Indent();		jsonWriter.Write ("},\n");

		Indent();		jsonWriter.Write ("\"uniforms\": {\n");
		IndentIn();
		foreach (var u in uniforms)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"" + u.name + "\": \"" + u.param + "\"");
		}
		jsonWriter.Write ("\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif