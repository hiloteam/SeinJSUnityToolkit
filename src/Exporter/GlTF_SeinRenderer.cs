using UnityEngine;
using System.Collections;

public class GlTF_SeinRenderer : GlTF_Writer
{
    public static string extensionName = "Sein_renderer";
    public int lightMapIndex = -1;
    public int aoMapIndex = -1;
    // alawys uv1 in Sein(uv2 in Unity)
    public int uvChannel = 1;
    public int uvRotation = 0;
    public Vector2 uvScale;
    public Vector2 uvOffset;
    public bool castShadows;
    public bool receiveShadows;
    public bool gammaCorrection;

    public override void Write()
    {
        CommaNL();
        jsonWriter.Write("\"" + extensionName + "\": {\n");
        IndentIn();
        if (lightMapIndex > -1 || aoMapIndex > -1)
        {
            Indent(); jsonWriter.Write("\"lightMap\": {\n");
            IndentIn();

            Indent(); jsonWriter.Write("\"uvChannel\": " + uvChannel + ",\n");
            Indent(); jsonWriter.Write("\"uvRotation\": " + uvRotation + ",\n");
            Indent(); jsonWriter.Write("\"uvScale\": [" + uvScale.x + ", " + uvScale.y + "],\n");
            Indent(); jsonWriter.Write("\"uvOffset\": [" + uvOffset.x + ", " + uvOffset.y + "],\n");
            if (aoMapIndex >= 0)
            {
                Indent(); jsonWriter.Write("\"aoMapIndex\": " + aoMapIndex + ",\n");
            }
            Indent(); jsonWriter.Write("\"lightMapIndex\": " + lightMapIndex + "\n");

            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }
        Indent(); jsonWriter.Write("\"castShadows\": " + (castShadows ? "true" : "false") + ",\n");
        Indent(); jsonWriter.Write("\"receiveShadows\": " + (receiveShadows ? "true" : "false") + ",\n");
        Indent(); jsonWriter.Write("\"gammaCorrection\": " + (gammaCorrection ? "true" : "false") + "\n");
        IndentOut();
        Indent(); jsonWriter.Write("}\n");
    }
}
