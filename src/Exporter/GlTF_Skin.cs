#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_Skin : GlTF_Writer {
	public int invBindMatricesAccessorIndex;
	public List<Transform> joints;
	public Transform mesh;

	public GlTF_Skin() { }

	public static string GetNameFromObject(Object o)
	{
		return "skin_" + GlTF_Writer.GetNameFromObject(o, true);
	}

	public void Populate (Transform m, ref GlTF_Accessor invBindMatricesAccessor, int invBindAccessorIndex)
	{
		SkinnedMeshRenderer skinMesh = m.GetComponent<SkinnedMeshRenderer>();
		if (!skinMesh)
			return;

		// Populate bind poses. From https://docs.unity3d.com/ScriptReference/Mesh-bindposes.html:
		// The bind pose is bone's inverse transformation matrix
		// In this case we also make this matrix relative to the root
		// So that we can move the root game object around freely

		joints = new List<Transform>();
		//Collect all bones from skin object. Order should be kept here since bones are referenced in the mesh
		foreach(Transform t in skinMesh.bones)
		{
			joints.Add(t);
		}

		Matrix4x4[] invBindMatrices = new Matrix4x4[joints.Count];
		for (int i = 0; i < skinMesh.bones.Length; ++i)
		{
			// Generates inverseWorldMatrix in right-handed coordinate system
			Matrix4x4 invBind = skinMesh.sharedMesh.bindposes[i];
			convertMatrixLeftToRightHandedness(ref invBind);
			invBindMatrices[i] = invBind;
		}

		invBindMatricesAccessor.Populate(invBindMatrices, m);
		invBindMatricesAccessorIndex = invBindAccessorIndex;
	}

	public override void Write ()
	{
		Indent();	jsonWriter.Write ("{\n");
		IndentIn();

		Indent(); jsonWriter.Write("\"inverseBindMatrices\": "+ invBindMatricesAccessorIndex + ",\n");
		Indent(); jsonWriter.Write ("\"joints\": [\n");

		IndentIn();
		foreach (Transform j in joints)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("" + GlTF_Writer.nodeNames.IndexOf(GlTF_Node.GetNameFromObject(j)));
		}

		IndentOut();
		jsonWriter.WriteLine();
		Indent(); jsonWriter.Write ("],\n");

		Indent(); jsonWriter.Write("\"name\": \"" + name + "\"\n");

		IndentOut();
		Indent();	jsonWriter.Write ("}");
	}
}
#endif