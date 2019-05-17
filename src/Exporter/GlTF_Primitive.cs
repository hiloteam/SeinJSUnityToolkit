#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Primitive : GlTF_Writer {
	public GlTF_Attributes attributes = new GlTF_Attributes();
    public List<GlTF_Attributes> morphTargets = new List<GlTF_Attributes>();
    public GlTF_Accessor indices;
	public int materialIndex;
	public int primitive =  4;
	public int semantics = 4;
	public int index = 0;

	public static string GetNameFromObject(Object o, int index)
	{
		return "primitive_" + index + "_" + GlTF_Writer.GetNameFromObject(o, true);
	}

	public void Populate (Mesh m)
	{
		indices.Populate (m.GetTriangles(index), true);
	}

	public override void Write ()
	{
		IndentIn();
		CommaNL();
		if (attributes != null)
        {
            Indent(); jsonWriter.Write("\"attributes\":");
            attributes.Write();
        }
        CommaNL();
        if (morphTargets.Count > 0)
        {
            Indent(); jsonWriter.Write("\"targets\": [\n");
            IndentIn();
            foreach (var target in morphTargets)
            {
                CommaNL();
                Indent(); target.Write();
            }
            jsonWriter.WriteLine();
            IndentOut();
            Indent(); jsonWriter.Write("],\n");
        }
		Indent();	jsonWriter.Write ("\"indices\": " + GlTF_Writer.accessors.IndexOf(indices) + ",\n");
		Indent();	jsonWriter.Write ("\"material\": " + materialIndex + ",\n");
		Indent();	jsonWriter.Write ("\"mode\": " + primitive + "\n");
		// semantics
		IndentOut();
	}
}
#endif