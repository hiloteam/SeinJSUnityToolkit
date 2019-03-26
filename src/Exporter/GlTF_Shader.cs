#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Shader : GlTF_Writer {
	public enum Type {
		Vertex,
		Fragment
	}

	public Type type = Type.Vertex;
	public string uri = "";

	public static string GetNameFromObject(Object o, Type type)
	{
		var name = GlTF_Writer.GetNameFromObject(o);
		var typeName = type == Type.Vertex ? "vertex" : "fragment";
		return typeName + "_" + name;
	}

    public static string convertShader(string src, string header) {
        return header + src
                .Replace("gl_ModelViewProjectionMatrix", "u_modelViewProjectionMatrix")
                .Replace("gl_ProjectionMatrix", "u_projectionMatrix")
                .Replace("gl_ModelViewMatrix", "u_modelViewMatrix")
                .Replace("gl_NormalMatrix", "u_normalMatrix")
                .Replace("gl_Vertex", "vec4(a_position, 1.)")
                .Replace("gl_MultiTexCoord", "a_texcoord")
                .Replace("gl_Normal", "a_normal");
    }

    public override void Write()
	{
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"type\": " + TypeStr() +",\n");
		Indent();		jsonWriter.Write ("\"uri\": \"" + uri +"\"\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}

	int TypeStr()
	{
		if (type == Type.Vertex)
		{
			return 35633;
		}
		else if (type == Type.Fragment)
		{
			return 35632;
		}

		return 0;
	}
}
#endif