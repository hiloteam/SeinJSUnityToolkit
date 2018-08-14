#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_SpotLight : GlTF_Light {
    public float range;
    public float spotAngle;

	public GlTF_SpotLight () { type = "spot"; }

	public override void Write()
	{
        Indent();
        jsonWriter.Write("{\n");
        IndentIn();
		color.Write();
        jsonWriter.Write(",\n");
        Indent();
        jsonWriter.Write("\"intensity\": " + (intensity * 3) + ",\n");
		Indent();
        jsonWriter.Write ("\"range\": " + range + ",\n");
		Indent();
        jsonWriter.Write ("\"spot\": {\n");
        IndentIn();
		Indent();
        jsonWriter.Write ("\"innerConeAngle\": " + (spotAngle - 20f) * System.Math.PI / 180 + ",\n");
		Indent();
        jsonWriter.Write("\"outerConeAngle\": " + (spotAngle * System.Math.PI / 180) + "\n");
        IndentOut();
        Indent();
        jsonWriter.Write("},\n");
        Indent();
        jsonWriter.Write ("\"type\": \"" + type + "\"\n");
        IndentOut();
        Indent();
		jsonWriter.Write ("}");
	}
}
#endif