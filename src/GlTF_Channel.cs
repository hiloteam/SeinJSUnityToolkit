#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Channel : GlTF_Writer {
	public int samplerIndex = -1;
	public GlTF_Target target;

	public GlTF_Channel (string ch, int sIndex) {
		samplerIndex = sIndex;
	}

	public override void Write()
	{
		if(samplerIndex == -1)
		{
			Debug.LogError("Error when serializing gltf Channel for target: " + target.id);
			return;
		}

		IndentIn();
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"sampler\": " + samplerIndex + ",\n");
		target.Write ();
		jsonWriter.WriteLine();
		IndentOut();
		Indent();		jsonWriter.Write ("}");
		IndentOut();
	}
}
#endif