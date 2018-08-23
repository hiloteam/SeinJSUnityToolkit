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
        double ins = intensity;
        double rg = range;
        if (quadraticAttenuation) {
            ins *= 3;
            rg *= 3;
        }
        jsonWriter.Write("\"intensity\": " + ins + ",\n");
		Indent();
        jsonWriter.Write ("\"range\": " + rg + ",\n");
		Indent();
        jsonWriter.Write ("\"spot\": {\n");
        IndentIn();
		Indent();
        double spotAngleRad = spotAngle * System.Math.PI / 180;
        if (halfSpotAngle) {
            spotAngleRad = spotAngleRad / 2;
        }
        jsonWriter.Write ("\"innerConeAngle\": " + (spotAngleRad / 3 * 2) + ",\n");
		Indent();
        jsonWriter.Write("\"outerConeAngle\": " + spotAngleRad + "\n");
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