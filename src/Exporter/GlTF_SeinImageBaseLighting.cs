using UnityEngine;
using System.Collections;

public class GlTF_SeinImageBaseLighting : GlTF_Writer
{
    public string extensionName = "Sein_imageBaseLighting";

    public float[][] shCoefficients;
    public float diffuseIntensity;
    public int brdfLUT;
    public int[] specMapFaces;
    public float specIntensity;

    public override void Write()
    {
        Indent(); jsonWriter.Write("{\n");
        IndentIn();

        Indent(); jsonWriter.Write("\"diffuse\": {\n");
        IndentIn();
        Indent(); jsonWriter.Write("\"type\": \"" + "SH" + "\",\n");
        Indent(); jsonWriter.Write("\"intensity\": " + diffuseIntensity + ",\n");
        Indent(); jsonWriter.Write("\"coefficients\": [\n");
        IndentIn();
        for (int i = 0; i < shCoefficients.Length; i += 1)
        {
            var cs = shCoefficients[i];
            Indent(); jsonWriter.Write("[" + cs[0] + "," + cs[1] + "," + cs[2] + "]");
            if (i != shCoefficients.Length - 1)
            {
                jsonWriter.Write(",");
            }
            jsonWriter.Write("\n");
        }
        IndentOut();
        Indent(); jsonWriter.Write("]\n");
        IndentOut();
        Indent(); jsonWriter.Write("},\n");

        Indent(); jsonWriter.Write("\"specular\": {\n");
        IndentIn();
        Indent(); jsonWriter.Write("\"type\": \"" + "CUBE" + "\",\n");
        Indent(); jsonWriter.Write("\"intensity\": " + (specIntensity * 4) + ",\n");
        Indent(); jsonWriter.Write("\"brdfLUT\": " + brdfLUT + ",\n");
        Indent(); jsonWriter.Write("\"faces\": ["
            + specMapFaces[0] + ","
            + specMapFaces[1] + ","
            + specMapFaces[2] + ","
            + specMapFaces[3] + ","
            + specMapFaces[4] + ","
            + specMapFaces[5] + "]\n");
        IndentOut();
        Indent(); jsonWriter.Write("}\n");

        IndentOut();
        Indent(); jsonWriter.Write("}");
        jsonWriter.WriteLine();
    }
}
