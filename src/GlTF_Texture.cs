#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Texture : GlTF_Writer {
	/*
		"texture_O21_jpg": {
			"format": 6408,
			"internalFormat": 6408,
			"sampler": "sampler_0",
			"source": "O21_jpg",
			"target": 3553,
			"type": 5121
		},
*/
	public int samplerIndex;
	public int source;
	public bool flipy = true;

	public static string GetNameFromObject(Object o)
	{
		return "texture_" + GlTF_Writer.GetNameFromObject(o, true);
	}

	public override void Write()
	{
		Indent();	jsonWriter.Write ("{\n");
		IndentIn();

		writeExtras();

		Indent();	jsonWriter.Write ("\"sampler\": " + samplerIndex + ",\n");
		Indent();	jsonWriter.Write ("\"source\": " + source + "\n");
		IndentOut();
		Indent();	jsonWriter.Write ("}");
	}
}
#endif