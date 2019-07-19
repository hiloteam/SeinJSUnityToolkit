#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Program : GlTF_Writer {
	public int vertexShader = -1;
	public int fragmentShader = -1;

	public static string GetNameFromObject(Object o)
	{
		return "program_" + GlTF_Writer.GetNameFromObject(o);
	}

	public override void Write()
	{
		Indent();		jsonWriter.Write ("{\n");
        IndentIn();
        Indent();		jsonWriter.Write ("\"vertexShader\": " + vertexShader + ",\n");
		Indent();		jsonWriter.Write ("\"fragmentShader\": " + fragmentShader + "\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif