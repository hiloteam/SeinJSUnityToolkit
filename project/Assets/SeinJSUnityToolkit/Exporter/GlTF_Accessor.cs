#if UNITY_EDITOR
using UnityEngine;
using System.Collections;

public class GlTF_Accessor : GlTF_Writer {
	public enum Type {
		SCALAR,
		VEC2,
		VEC3,
		VEC4,
		MAT4
	}

	public enum ComponentType {
		BYTE = 5120,
		UNSIGNED_BYTE = 5121,
		SHORT = 5122,
		USHORT = 5123,
		UNSIGNED_INT = 5125,
		FLOAT = 5126,
	}

	public GlTF_BufferView bufferView;//	"bufferView": "bufferView_30",
	public int bufferViewIndex;
	public long byteOffset; //": 0,
	public ComponentType componentType; // GL enum vals ": BYTE (5120), UNSIGNED_BYTE (5121), SHORT (5122), UNSIGNED_SHORT (5123), FLOAT (5126)
	public int count;//": 2399,
	public Type type = Type.SCALAR;
	public Vector2 scaleValues;
	public Vector2 offsetValues;

	Vector4 maxFloat;
	Vector4 minFloat;
	Matrix4x4 minMatrix = new Matrix4x4();
	Matrix4x4 maxMatrix = new Matrix4x4();
	int minInt;
	int maxInt;

	public GlTF_Accessor (string n) { id = n; }
	public GlTF_Accessor (string n, Type t, ComponentType c) {
		id = n;
		type = t;
		componentType = c;
	}

	public static string GetNameFromObject(Object o, string name)
	{
		return "accessor_" + name + "_"+ GlTF_Writer.GetNameFromObject(o, true);
	}

	void InitMinMaxInt()
	{
		maxInt = int.MinValue;
		minInt = int.MaxValue;
	}

	void InitMinMaxFloat()
	{
		float min = float.MinValue;
		float max = float.MaxValue;
		maxFloat = new Vector4(min, min, min, min);
		minFloat = new Vector4(max, max, max, max);
	}

	public void PopulateWithOffsetScale(Vector2[] v2s, bool flip)
	{
		Vector2[] uv2 = v2s;
		for(int i=0;  i< uv2.Length; ++i)
		{
			float u = uv2[i][0] * scaleValues[0] + offsetValues[0];
			float v = uv2[i][1] * scaleValues[1] + offsetValues[1];
			uv2[i] = new Vector2(u, v);
		}

		Populate(uv2, flip);
	}

	public void Populate (int[] vs, bool flippedTriangle)
	{
		if (type != Type.SCALAR)
			throw (new System.Exception());
		byteOffset = bufferView.currentOffset;
		bufferView.Populate (vs, flippedTriangle);
		count = vs.Length;
		if (count > 0)
		{
			InitMinMaxInt();
			for (int i = 0; i < count; ++i)
			{
				minInt = Mathf.Min(vs[i], minInt);
				maxInt = Mathf.Max(vs[i], maxInt);
			}
		}
	}

	public void Populate (float[] vs)
	{
		if (type != Type.SCALAR)
			throw (new System.Exception());

		byteOffset = bufferView.currentOffset;
		bufferView.Populate (vs);
		count = vs.Length;
		if (count > 0)
		{
			InitMinMaxFloat();
			for (int i = 0; i < count; ++i)
			{
				minFloat.x = Mathf.Min(vs[i], minFloat.x);
				maxFloat.x = Mathf.Max(vs[i], maxFloat.x);
			}
		}
	}

	public void Populate (Vector2[] v2s, bool flip = false)
	{
		if (type != Type.VEC2)
			throw (new System.Exception());
		byteOffset = bufferView.currentOffset;
		count = v2s.Length;
		if (count > 0)
		{
			InitMinMaxFloat();

			if (flip)
			{
				for (int i = 0; i < v2s.Length; i++)
				{
					bufferView.Populate (v2s[i].x);
					float y = 1.0f - v2s[i].y;
					bufferView.Populate (y);
					minFloat.x = Mathf.Min(v2s[i].x, minFloat.x);
					minFloat.y = Mathf.Min(y, minFloat.y);
					maxFloat.x = Mathf.Max(v2s[i].x, maxFloat.x);
					maxFloat.y = Mathf.Max(y, maxFloat.y);
				}
			} else {
				for (int i = 0; i < v2s.Length; i++)
				{
					bufferView.Populate (v2s[i].x);
					bufferView.Populate (v2s[i].y);
					minFloat.x = Mathf.Min(v2s[i].x, minFloat.x);
					minFloat.y = Mathf.Min(v2s[i].y, minFloat.y);
					maxFloat.x = Mathf.Max(v2s[i].x, maxFloat.x);
					maxFloat.y = Mathf.Max(v2s[i].y, maxFloat.y);
				}
			}
		}
	}

	public void Populate (Vector3[] v3s, bool noConvert=false)
	{
		if (type != Type.VEC3)
			throw (new System.Exception());
		byteOffset = bufferView.currentOffset;
		count = v3s.Length;

		if (count > 0)
		{
			InitMinMaxFloat();

			for (int i = 0; i < v3s.Length; i++)
			{
				if (convertRightHanded && !noConvert)
					convertVector3LeftToRightHandedness(ref v3s[i]);

				bufferView.Populate (v3s[i].x);
				bufferView.Populate (v3s[i].y);
				bufferView.Populate (v3s[i].z);

				minFloat.x = Mathf.Min(v3s[i].x, minFloat.x);
				minFloat.y = Mathf.Min(v3s[i].y, minFloat.y);
				minFloat.z = Mathf.Min(v3s[i].z, minFloat.z);
				maxFloat.x = Mathf.Max(v3s[i].x, maxFloat.x);
				maxFloat.y = Mathf.Max(v3s[i].y, maxFloat.y);
				maxFloat.z = Mathf.Max(v3s[i].z, maxFloat.z);
			}
		}
	}

	public void PopulateShort(Vector4[] v4s, bool noConvert = true, bool useUInt = false)
	{
		if (type != Type.VEC4)
			throw (new System.Exception());

		byteOffset = bufferView.currentOffset;

		count = v4s.Length;
		if (count > 0)
		{
			InitMinMaxFloat();
			for (int i = 0; i < v4s.Length; i++)
			{
				bufferView.PopulateShort((ushort)v4s[i].x);
				bufferView.PopulateShort((ushort)v4s[i].y);
				bufferView.PopulateShort((ushort)v4s[i].z);
				bufferView.PopulateShort((ushort)v4s[i].w);

				minFloat.x = Mathf.Min(v4s[i].x, minFloat.x);
				minFloat.y = Mathf.Min(v4s[i].y, minFloat.y);
				minFloat.z = Mathf.Min(v4s[i].z, minFloat.z);
				minFloat.w = Mathf.Min(v4s[i].w, minFloat.w);
				maxFloat.x = Mathf.Max(v4s[i].x, maxFloat.x);
				maxFloat.y = Mathf.Max(v4s[i].y, maxFloat.y);
				maxFloat.z = Mathf.Max(v4s[i].z, maxFloat.z);
				maxFloat.w = Mathf.Max(v4s[i].w, maxFloat.w);
			}
		}

	}

	public void Populate (Vector4[] v4s, bool noConvert = true, bool useUInt = false)
	{
		if (type != Type.VEC4)
			throw (new System.Exception());

		byteOffset = bufferView.currentOffset;

		count = v4s.Length;
		if (count > 0)
		{
			InitMinMaxFloat();
			for (int i = 0; i < v4s.Length; i++)
			{
				if (convertRightHanded && !noConvert)
					convertVector4LeftToRightHandedness(ref v4s[i]);

				if (useUInt)
				{
					bufferView.Populate((uint)v4s[i].x);
					bufferView.Populate((uint)v4s[i].y);
					bufferView.Populate((uint)v4s[i].z);
					bufferView.Populate((uint)v4s[i].w);
				}
				else
				{
					bufferView.Populate(v4s[i].x);
					bufferView.Populate(v4s[i].y);
					bufferView.Populate(v4s[i].z);
					bufferView.Populate(v4s[i].w);
				}

				minFloat.x = Mathf.Min(v4s[i].x, minFloat.x);
				minFloat.y = Mathf.Min(v4s[i].y, minFloat.y);
				minFloat.z = Mathf.Min(v4s[i].z, minFloat.z);
				minFloat.w = Mathf.Min(v4s[i].w, minFloat.w);
				maxFloat.x = Mathf.Max(v4s[i].x, maxFloat.x);
				maxFloat.y = Mathf.Max(v4s[i].y, maxFloat.y);
				maxFloat.z = Mathf.Max(v4s[i].z, maxFloat.z);
				maxFloat.w = Mathf.Max(v4s[i].w, maxFloat.w);
			}
		}

	}

	public void Populate(Color[] colors)
	{
		if (type != Type.VEC4)
			throw (new System.Exception());

		byteOffset = bufferView.currentOffset;

		count = colors.Length;
		if (count > 0)
		{
			InitMinMaxFloat();
			for (int i = 0; i < colors.Length; i++)
			{
				bufferView.Populate(colors[i].r);
				bufferView.Populate(colors[i].g);
				bufferView.Populate(colors[i].b);
				bufferView.Populate(colors[i].a);
				minFloat.x = Mathf.Min(colors[i].r, minFloat.x);
				minFloat.y = Mathf.Min(colors[i].g, minFloat.y);
				minFloat.z = Mathf.Min(colors[i].b, minFloat.z);
				minFloat.w = Mathf.Min(colors[i].a, minFloat.w);
				maxFloat.x = Mathf.Max(colors[i].r, maxFloat.x);
				maxFloat.y = Mathf.Max(colors[i].g, maxFloat.y);
				maxFloat.z = Mathf.Max(colors[i].b, maxFloat.z);
				maxFloat.w = Mathf.Max(colors[i].a, maxFloat.w);
			}
		}

	}

	public void Populate(Matrix4x4[] matrices, Transform m)
	{
		if (type != Type.MAT4)
			throw (new System.Exception());

		byteOffset = bufferView.currentOffset;
		count = matrices.Length;
		if(count > 0)
		{
			for(int i = 0; i < matrices.Length; i++)
			{
				Matrix4x4 mat = matrices[i];

				// This code is buggy, don't use it for now.
				//if (convertRightHanded)
				//	convertMatrixLeftToRightHandedness(ref mat);

				for (int j = 0; j < 4; j++)
				{
					for(int k=0; k < 4; k++)
					{
						// Matrices in unity are column major
						// as for Gltf
						float value = mat[k, j];
						bufferView.Populate(value);
						minMatrix[k, j] = Mathf.Min(value, minMatrix[k, j]);
						maxMatrix[k, j] = Mathf.Max(value, maxMatrix[k, j]);
					}
				}
			}
		}
	}

	void WriteMin()
	{
		if (componentType == ComponentType.FLOAT)
		{
			switch (type)
			{
				case Type.SCALAR:
					jsonWriter.Write (minFloat.x);
				break;

				case Type.VEC2:
					jsonWriter.Write (minFloat.x + ", " + minFloat.y);
				break;

				case Type.VEC3:
					jsonWriter.Write (minFloat.x + ", " + minFloat.y + ", " + minFloat.z);
				break;

				case Type.VEC4:
					jsonWriter.Write (minFloat.x + ", " + minFloat.y + ", " + minFloat.z + ", " + minFloat.w);
				break;
				case Type.MAT4:
					for (int i = 0; i < 15; ++i)
					{
						jsonWriter.Write(minMatrix[i] + ", ");
					}
					jsonWriter.Write(minMatrix[15]);
				break;
			}
		}
		else if (componentType == ComponentType.USHORT || componentType == ComponentType.UNSIGNED_INT)
		{
			if (type == Type.SCALAR)
			{
				jsonWriter.Write(minInt);
			}
			else if (type == Type.VEC4)
			{
				jsonWriter.Write((int)minFloat.x + ", " + (int)minFloat.y + ", " + (int)minFloat.z + ", " + (int)minFloat.w);
			}
		}
	}

	void WriteMax()
	{
		if (componentType == ComponentType.FLOAT)
		{
			switch (type)
			{
			case Type.SCALAR:
				jsonWriter.Write (maxFloat.x);
				break;

			case Type.VEC2:
				jsonWriter.Write (maxFloat.x + ", " + maxFloat.y);
				break;

			case Type.VEC3:
				jsonWriter.Write (maxFloat.x + ", " + maxFloat.y + ", " + maxFloat.z);
				break;

			case Type.VEC4:
				jsonWriter.Write (maxFloat.x + ", " + maxFloat.y + ", " + maxFloat.z + ", " + maxFloat.w);
				break;
		   case Type.MAT4:
				for(int i=0; i < 15; ++i)
				{
					jsonWriter.Write(maxMatrix[i] + ", ");
				}
				jsonWriter.Write(maxMatrix[15]);
				break;
			}
		}
		else if (componentType == ComponentType.USHORT || componentType == ComponentType.UNSIGNED_INT)
		{
			if (type == Type.SCALAR)
			{
				jsonWriter.Write(maxInt);
			}
			else if(type == Type.VEC4)
			{
				jsonWriter.Write((int)maxFloat.x + ", " + (int)maxFloat.y + ", " + (int)maxFloat.z + ", " + (int)maxFloat.w);
			}
		}
	}

	public override void Write ()
	{
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write ("\"bufferView\": " + bufferViews.IndexOf(bufferView) +",\n");
		Indent();		jsonWriter.Write ("\"byteOffset\": " + byteOffset + ",\n");
		Indent();		jsonWriter.Write ("\"componentType\": " + (int)componentType + ",\n");
		Indent();		jsonWriter.Write ("\"count\": " + count + ",\n");

		Indent(); jsonWriter.Write("\"max\": [ ");
		WriteMax();
		jsonWriter.Write(" ],\n");
		Indent(); jsonWriter.Write("\"min\": [ ");
		WriteMin();
		jsonWriter.Write(" ],\n");

		Indent();		jsonWriter.Write ("\"type\": \"" + type + "\"\n");
		IndentOut();
		Indent();	jsonWriter.Write ("}");
	}
}
#endif