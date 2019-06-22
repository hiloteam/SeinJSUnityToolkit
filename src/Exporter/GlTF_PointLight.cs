#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_PointLight : GlTF_Light {
	public float range;

	public GlTF_PointLight () { type = "point"; }

	public override void Write()
	{
        Indent();
        jsonWriter.Write("{\n");
        IndentIn();
        color.Write();
        jsonWriter.Write(",\n");
        Indent();
        double ins = intensity;
        double rg = range;
        jsonWriter.Write("\"intensity\": " + ins + ",\n");
        Indent();
        jsonWriter.Write("\"range\": " + rg + ",\n");
        Indent();
        jsonWriter.Write("\"type\": \"" + type + "\"\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
	}
}
#endif