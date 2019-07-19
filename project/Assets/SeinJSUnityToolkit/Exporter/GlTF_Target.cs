#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Target : GlTF_Writer {
	public string path;
	public override void Write()
	{
		Indent();		jsonWriter.Write ("\"" + "target" + "\": {\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"node\": " + GlTF_Writer.nodeIDs.IndexOf(uuid) + ",\n");
		Indent();		jsonWriter.Write ("\"path\": \"" + path + "\"\n");
		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif