#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Primitive : GlTF_Writer {
	public GlTF_Attributes attributes = new GlTF_Attributes();
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
//		attributes.Populate (m);
		indices.Populate (m.GetTriangles(index), true);
	}

	public override void Write ()
	{
		IndentIn();
		CommaNL();
		if (attributes != null)
			attributes.Write();
		CommaNL();
		Indent();	jsonWriter.Write ("\"indices\": " + GlTF_Writer.accessors.IndexOf(indices) + ",\n");
		Indent();	jsonWriter.Write ("\"material\": " + materialIndex + ",\n");
		Indent();	jsonWriter.Write ("\"mode\": " + primitive + "\n");
		// semantics
		IndentOut();
	}
}
#endif