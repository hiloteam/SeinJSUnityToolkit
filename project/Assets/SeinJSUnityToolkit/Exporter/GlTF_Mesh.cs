#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Mesh : GlTF_Writer {
    public List<GlTF_Primitive> primitives;
    public string materialsID = "";
    public List<float> morphWeights;
    public List<string> morphTargetNames;

    public GlTF_Mesh() {
        primitives = new List<GlTF_Primitive>();
        morphWeights = new List<float>();
        morphTargetNames = new List<string>();
    }

	public static string GetNameFromObject(Object o)
	{
		//return "mesh_" + GlTF_Writer.GetNameFromObject(o, true);
        return "mesh_";
	}

	public void Populate (Mesh m)
	{
		if (primitives.Count > 0)
		{
			// only populate first attributes because the data are shared between primitives
			primitives[0].attributes.Populate(m);

            if (primitives[0].morphTargets.Count > 0)
            {
                int i = 0;
                foreach (var target in primitives[0].morphTargets)
                {
                    Vector3[] vertices = new Vector3[m.vertexCount];
                    Vector3[] normals = new Vector3[m.normals.Length];
                    Vector3[] tangents = new Vector3[m.tangents.Length];
                    m.GetBlendShapeFrameVertices(i, 0, vertices, normals, tangents);

                    target.positionAccessor.Populate(vertices);

                    if (target.normalAccessor != null)
                    {
                        target.normalAccessor.Populate(normals);
                    }

                    if (target.tangentAccessor != null)
                    {
                        target.tangentAccessor.Populate(tangents);
                    }

                    i += 1;
                }
            }
        }

		foreach (GlTF_Primitive p in primitives)
		{
			p.Populate (m);
		}
	}

	public override void Write ()
	{
		Indent();	jsonWriter.Write ("{\n");
		IndentIn();
        if (morphTargetNames.Count > 0) {
            Indent(); jsonWriter.Write("\"extras\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"targetNames\": [\n");
            IndentIn();
            foreach (var n in morphTargetNames)
            {
                CommaNL();
                Indent(); jsonWriter.Write("\"" + n + "\"");
            }
            jsonWriter.WriteLine();
            IndentOut();
            Indent(); jsonWriter.Write("]\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }

        Indent();	jsonWriter.Write ("\"name\": \"" + name + "\",\n");

        if (morphWeights.Count > 0)
        {
            Indent(); jsonWriter.Write("\"weights\": [\n");
            IndentIn();
            foreach (var w in morphWeights)
            {
                CommaNL();
                Indent(); jsonWriter.Write(w);
            }
            jsonWriter.WriteLine();
            IndentOut();
            Indent(); jsonWriter.Write("],\n");
        }

        Indent();	jsonWriter.Write ("\"primitives\": [\n");
		IndentIn();
		foreach (GlTF_Primitive p in primitives)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("{\n");
			p.Write ();
			Indent();	jsonWriter.Write ("}");
		}
		jsonWriter.WriteLine();
		IndentOut();
		Indent();	jsonWriter.Write("]\n");
        IndentOut();
		Indent();	jsonWriter.Write ("}");
	}
}
#endif