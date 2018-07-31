#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_AmbientLight : GlTF_Light {
    public GlTF_AmbientLight() { type = "ambient"; }

	public override void Write()
	{
        Indent();
        jsonWriter.Write("{\n");
        IndentIn();
        color.Write();
        jsonWriter.Write("\n");
        Indent();
        jsonWriter.Write("\"type\": \"" + type + "\"\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
	}
}
#endif