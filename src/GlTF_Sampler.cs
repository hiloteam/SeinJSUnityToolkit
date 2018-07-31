#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Sampler : GlTF_Writer {
	public enum MagFilter {
		NEAREST = 9728,
		LINEAR = 9729
	}

	public enum MinFilter {
		NEAREST = 9728,
		LINEAR = 9729,
		NEAREST_MIPMAP_NEAREST = 9984,
		LINEAR_MIPMAP_NEAREST = 9985,
		NEAREST_MIPMAP_LINEAR = 9986,
		LINEAR_MIPMAP_LINEAR = 9987
	}

	public enum Wrap {
		CLAMP_TO_EDGE = 33071,
		MIRRORED_REPEAT = 33648,
		REPEAT = 10497
	}

	MagFilter magFilter = MagFilter.LINEAR;
	MinFilter minFilter = MinFilter.LINEAR;
	Wrap wrap = Wrap.REPEAT;

	public static string GetNameFromObject(Texture tex)
	{
		int fm = (int)tex.filterMode;
		int w = (int)tex.wrapMode;
		var n = "sampler_" + fm + "_" + w;
		Texture2D t = tex as Texture2D;
		if (t != null)
		{
			if (t.mipmapCount > 0)
			{
				n += "_m";
			}
		}
		return n;
	}

	public GlTF_Sampler (Texture tex)
	{
		bool hasMipMap = false;
		Texture2D t = tex as Texture2D;
		if (t != null)
		{
			if (t.mipmapCount > 0)
			{
				hasMipMap = true;
			}
		}

		switch (tex.filterMode)
		{
			case FilterMode.Point:
			{
				magFilter = MagFilter.NEAREST;
				if (hasMipMap)
				{
					minFilter = MinFilter.NEAREST_MIPMAP_NEAREST;
				}
				else
				{
					minFilter = MinFilter.NEAREST;
				}
			}
			break;

			case FilterMode.Bilinear:
			{
				magFilter = MagFilter.LINEAR;
				if (hasMipMap)
				{
					minFilter = MinFilter.LINEAR_MIPMAP_NEAREST;
				}
				else
				{
					minFilter = MinFilter.LINEAR;
				}
			}
			break;

			case FilterMode.Trilinear:
			{
				magFilter = MagFilter.LINEAR;
				if (hasMipMap)
				{
					minFilter = MinFilter.LINEAR;
				}
				else
				{
					minFilter = MinFilter.LINEAR_MIPMAP_LINEAR;
				}
			}
			break;
		}

		switch (tex.wrapMode)
		{
			case TextureWrapMode.Clamp:
			{
				wrap = Wrap.CLAMP_TO_EDGE;
			}
			break;

			case TextureWrapMode.Repeat:
			{
				wrap = Wrap.REPEAT;
			}
			break;
		}
	}

	public override void Write()
	{
		Indent();	jsonWriter.Write ("{\n");
		IndentIn();
		Indent();	jsonWriter.Write ("\"magFilter\": " + (int)magFilter + ",\n");
		Indent();	jsonWriter.Write ("\"minFilter\": " + (int)minFilter + ",\n");
		Indent();	jsonWriter.Write ("\"wrapS\": " + (int)wrap + ",\n");
		Indent();	jsonWriter.Write ("\"wrapT\": " + (int)wrap + "\n");
		IndentOut();
		Indent();	jsonWriter.Write ("}");
	}
}
#endif