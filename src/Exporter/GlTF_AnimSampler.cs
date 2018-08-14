#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_AnimSampler : GlTF_Writer {
	public int input = -1; // accessor index
	public string interpolation = "LINEAR"; // Can also be STEP in glTF 2.0
	public int output = -1; // accessor index

	public GlTF_AnimSampler(int i, int o) { input = i;  output = o; }
	public override void Write()
	{
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"input\": " + input + ",\n");
		Indent();		jsonWriter.Write ("\"interpolation\": \"" + interpolation + "\",\n");
		Indent();		jsonWriter.Write ("\"output\": " + output + "\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif