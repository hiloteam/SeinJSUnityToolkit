#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using UnityEditor;

public class GlTF_AmbientLight : GlTF_Light {
    public GlTF_AmbientLight() { type = "ambient"; }

	public override void Write()
	{
        jsonWriter.Write("\"" + "Sein_ambientLight" + "\": {\n");
        IndentIn();
        color.Write();
        jsonWriter.Write(",\n");
        double ins = intensity;
        if (PlayerSettings.colorSpace == ColorSpace.Gamma)
        {
            ins *= .7;
        }
        Indent(); jsonWriter.Write("\"intensity\": " + ins + "\n");
        IndentOut();
        Indent(); jsonWriter.Write("}");
	}
}
#endif
