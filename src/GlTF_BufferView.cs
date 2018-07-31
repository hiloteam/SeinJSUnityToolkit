#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.IO;
using System;

public class GlTF_BufferView : GlTF_Writer  {

	public enum TARGET
	{
		ARRAY=34962,
		ELEMENT=34963
	}

	public int bufferIndex = 0;// ": "duck",
	public long byteLength;//": 25272,
	public long byteOffset;//": 0,
	public long byteStride;
	public int target= -1;
	//	public string target = "ARRAY_BUFFER";
	public int currentOffset = 0;
	public MemoryStream memoryStream = new MemoryStream();
	public bool bin = false;

	public GlTF_BufferView (string n, int s) { name = n; byteStride = s; }
	public GlTF_BufferView (string n, int s, int t) { name = n; byteStride = s; target = t; }

	public void Populate (int[] vs, bool flippedTriangle)
	{
		if (flippedTriangle)
		{
			for (int i = 0; i < vs.Length; i+=3)
			{
				ushort u = (ushort)vs[i];
				memoryStream.Write (BitConverter.GetBytes(u), 0, BitConverter.GetBytes(u).Length);
				currentOffset += 2;

				u = (ushort)vs[i+2];
				memoryStream.Write (BitConverter.GetBytes(u), 0, BitConverter.GetBytes(u).Length);
				currentOffset += 2;

				u = (ushort)vs[i+1];
				memoryStream.Write (BitConverter.GetBytes(u), 0, BitConverter.GetBytes(u).Length);
				currentOffset += 2;
			}
		}
		else
		{
			for (int i = 0; i < vs.Length; i++)
			{
				ushort u = (ushort)vs[i];
				memoryStream.Write (BitConverter.GetBytes(u), 0, BitConverter.GetBytes(u).Length);
				currentOffset += 2;
			}
		}
		byteLength = currentOffset;
	}

	public void PopulateShort(ushort vs)
	{
			ushort u = (ushort)vs;
			memoryStream.Write(BitConverter.GetBytes(u), 0, BitConverter.GetBytes(u).Length);
			currentOffset += 2;
			byteLength += 2 ;
	}

	public void Populate (float[] vs)
	{
		for (int i = 0; i < vs.Length; i++)
		{
			//			memoryStream.Write (vs[i]);
			//			memoryStream.Write ((byte[])vs, 0, vs.Length * sizeof(int));
			float f = vs[i];
			memoryStream.Write (BitConverter.GetBytes(f), 0, BitConverter.GetBytes(f).Length);
			currentOffset += 4;
		}
		byteLength = currentOffset;
	}

	public void Populate(uint v)
	{
		memoryStream.Write(BitConverter.GetBytes(v), 0, BitConverter.GetBytes(v).Length);
		currentOffset += 4;
		byteLength = currentOffset;
	}

	public void Populate (float v)
	{
		memoryStream.Write (BitConverter.GetBytes(v), 0, BitConverter.GetBytes(v).Length);
		currentOffset += 4;
		byteLength = currentOffset;
	}

	public override void Write ()
	{
		/*
		"bufferView_4642": {
			"buffer": "vc.bin",
			"byteLength": 630080,
			"byteOffset": 0,
			"target": "ARRAY_BUFFER"
		},
	*/
		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		//var binName = binary ? "binary_glTF" : Path.GetFileNameWithoutExtension(GlTF_Writer.binFileName);
		Indent();		jsonWriter.Write ("\"buffer\": " + bufferIndex +",\n");
		Indent();		jsonWriter.Write ("\"byteLength\": " + byteLength + ",\n");
		if ((int)target != (int)-1)
		{
			Indent(); jsonWriter.Write("\"target\": " + target + ",\n");
		}

		if (byteStride >= 4)
		{
			Indent(); jsonWriter.Write("\"byteStride\": " + byteStride + ",\n");
		}

		Indent();		jsonWriter.Write ("\"byteOffset\": " + byteOffset + "\n");

		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif