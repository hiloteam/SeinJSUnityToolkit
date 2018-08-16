/***************************************************************************
GlamExport
 - Unity3D Scriptable Wizard to export Hierarchy or Project objects as glTF


****************************************************************************/
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using System.Reflection;
using Ionic.Zip;

public enum IMAGETYPE
{
	GRAYSCALE,
	RGB,
	RGBA,
	RGBA_OPAQUE,
	R,
	G,
	B,
	A,
	G_INVERT,
	NORMAL_MAP,
	IGNORE
}

public class SceneToGlTFWiz : MonoBehaviour
{
	public int jpgQuality = 85;

	public GlTF_Writer writer;
	string savedPath = "";
	int nbSelectedObjects = 0;

	static bool done = true;

	public static GlTF_Camera parseUnityCamera(Transform tr)
	{
		if (tr.GetComponent<Camera>().orthographic)
		{
			GlTF_Orthographic cam;
			cam = new GlTF_Orthographic();
			cam.type = "orthographic";
			cam.zfar = tr.GetComponent<Camera>().farClipPlane;
			cam.znear = tr.GetComponent<Camera>().nearClipPlane;
			cam.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
			//cam.orthographic.xmag = tr.camera.
			GlTF_Writer.cameras.Add(cam);

            return cam;
		}
		else
		{
			GlTF_Perspective cam;
			cam = new GlTF_Perspective();
			cam.type = "perspective";
			cam.zfar = tr.GetComponent<Camera>().farClipPlane;
			cam.znear = tr.GetComponent<Camera>().nearClipPlane;
			cam.aspect_ratio = tr.GetComponent<Camera>().aspect;
			cam.yfov = tr.GetComponent<Camera>().fieldOfView;
			cam.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
			GlTF_Writer.cameras.Add(cam);

            return cam;
		}
	}

	public bool isDone()
	{
		return done;
	}

	public void resetParser()
	{
		done = false;
	}

    public static GlTF_Light parseUnityLight(Transform tr)
	{
		switch (tr.GetComponent<Light>().type)
		{
			case LightType.Point:
				GlTF_PointLight pl = new GlTF_PointLight();
				pl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
				pl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                pl.intensity = tr.GetComponent<Light>().intensity;
                pl.range = tr.GetComponent<Light>().range;
				GlTF_Writer.lights.Add(pl);
				return pl;

			case LightType.Spot:
				GlTF_SpotLight sl = new GlTF_SpotLight();
				sl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
				sl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                sl.intensity = tr.GetComponent<Light>().intensity;
                sl.range= tr.GetComponent<Light>().range;
                sl.spotAngle = tr.GetComponent<Light>().spotAngle;
				GlTF_Writer.lights.Add(sl);
                return sl;

			case LightType.Directional:
				GlTF_DirectionalLight dl = new GlTF_DirectionalLight();
				dl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
				dl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                dl.intensity = tr.GetComponent<Light>().intensity;
				GlTF_Writer.lights.Add(dl);
                return dl;

			case LightType.Area:
				GlTF_AmbientLight al = new GlTF_AmbientLight();
				al.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
				al.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                al.intensity = tr.GetComponent<Light>().intensity;
				GlTF_Writer.lights.Add(al);
                return al;
		}

        return null;
	}

	public void ExportCoroutine(string path, Preset presetAsset, bool buildZip, bool exportPBRMaterials, bool exportAnimation = true, bool doConvertImages = true)
	{
		StartCoroutine(Export(path, presetAsset, buildZip, exportPBRMaterials, exportAnimation, doConvertImages));
	}

	public int getNbSelectedObjects()
	{
		return nbSelectedObjects;
	}

	public IEnumerator Export(string path, Preset presetAsset, bool buildZip, bool exportPBRMaterials, bool exportAnimation = true, bool doConvertImages = false)
	{
		writer = new GlTF_Writer();
		writer.Init ();
		done = false;
		bool debugRightHandedScale = false;
		GlTF_Writer.exportedFiles.Clear();
		if (debugRightHandedScale)
			GlTF_Writer.convertRightHanded = false;

		writer.extraString.Add("exporterVersion", GlTF_Writer.exporterVersion );

		// Create rootNode
		GlTF_Node correctionNode = new GlTF_Node();
		correctionNode.id = "node_scene_root";
        correctionNode.name = "node_scene_root";
		GlTF_Writer.nodes.Add(correctionNode);
		GlTF_Writer.nodeNames.Add(correctionNode.name);
		GlTF_Writer.rootNodes.Add(correctionNode);

		//path = toGlTFname(path);
		savedPath = Path.GetDirectoryName(path);

		// Temp list to keep track of skeletons
		Dictionary<string, GlTF_Skin> parsedSkins = new Dictionary<string, GlTF_Skin>();
		parsedSkins.Clear();

		// first, collect objects in the scene, add to lists
		Transform[] transforms = Selection.GetTransforms (SelectionMode.Deep);
		List<Transform> trs = new List<Transform>(transforms);
		// Prefilter selected nodes and look for skinning in order to list "bones" nodes
		//FIXME: improve this
		List<Transform> bones = new List<Transform>();
		foreach(Transform tr in trs)
		{
			if (!tr.gameObject.activeSelf)
				continue;

			SkinnedMeshRenderer skin = tr.GetComponent<SkinnedMeshRenderer>();
			if (skin)
			{
				foreach(Transform bone in skin.bones)
				{
					bones.Add(bone);
				}
			}
		}

		nbSelectedObjects = trs.Count;
		int nbDisabledObjects = 0;
		foreach (Transform tr in trs)
		{
			if (tr.gameObject.activeInHierarchy == false)
			{
				nbDisabledObjects++;
				continue;
			}

			// Initialize the node
			GlTF_Node node = new GlTF_Node();
			node.id = GlTF_Node.GetNameFromObject(tr);
			node.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);

            if (tr.GetComponent<Camera>() != null) {
                GlTF_Camera cam = parseUnityCamera(tr);
                node.cameraIndex = GlTF_Writer.cameras.IndexOf(cam);
            }
				
            if (tr.GetComponent<Light>() != null) {
                GlTF_Light l = parseUnityLight(tr);
                node.lightName = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                node.lightIndex = GlTF_Writer.lights.IndexOf(l);
            }

			Mesh m = GetMesh(tr);
			if (m != null)
			{
				GlTF_Mesh mesh = new GlTF_Mesh();
				mesh.name = GlTF_Writer.cleanNonAlphanumeric(GlTF_Mesh.GetNameFromObject(m) + tr.name);

				GlTF_Accessor positionAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "position"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
				positionAccessor.bufferView = GlTF_Writer.vec3BufferView;
				GlTF_Writer.accessors.Add (positionAccessor);

				GlTF_Accessor normalAccessor = null;
				if (m.normals.Length > 0)
				{
					normalAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "normal"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
					normalAccessor.bufferView = GlTF_Writer.vec3BufferView;
					GlTF_Writer.accessors.Add (normalAccessor);
				}

				GlTF_Accessor colorAccessor = null;
				if (m.colors.Length > 0)
				{
					colorAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "color"), GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.FLOAT);
					colorAccessor.bufferView = GlTF_Writer.vec4BufferView;
					GlTF_Writer.accessors.Add(colorAccessor);
				}

				GlTF_Accessor uv0Accessor = null;
				if (m.uv.Length > 0) {
					uv0Accessor =  new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv0"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
					uv0Accessor.bufferView = GlTF_Writer.vec2BufferView;
					GlTF_Writer.accessors.Add (uv0Accessor);
				}

				GlTF_Accessor uv1Accessor = null;
				if (m.uv2.Length > 0) {
					// check if object is affected by a lightmap
					uv1Accessor =  new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv1"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
					uv1Accessor.bufferView = GlTF_Writer.vec2BufferView;
					GlTF_Writer.accessors.Add (uv1Accessor);
				}

				GlTF_Accessor uv2Accessor = null;
				if (m.uv3.Length > 0) {
					uv2Accessor =  new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv2"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
					uv2Accessor.bufferView = GlTF_Writer.vec2BufferView;
					GlTF_Writer.accessors.Add (uv2Accessor);
				}

				GlTF_Accessor uv3Accessor = null;
				if (m.uv4.Length > 0) {
					uv3Accessor =  new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv3"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
					uv3Accessor.bufferView = GlTF_Writer.vec2BufferView;
					GlTF_Writer.accessors.Add (uv3Accessor);
				}

				GlTF_Accessor jointAccessor = null;
				if (exportAnimation && m.boneWeights.Length > 0)
				{
					jointAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "joints"), GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.USHORT);
					jointAccessor.bufferView = GlTF_Writer.vec4UshortBufferView;
					GlTF_Writer.accessors.Add(jointAccessor);
				}

				GlTF_Accessor weightAccessor = null;
				if (exportAnimation && m.boneWeights.Length > 0)
				{
					weightAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "weights"), GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.FLOAT);
					weightAccessor.bufferView = GlTF_Writer.vec4BufferView;
					GlTF_Writer.accessors.Add(weightAccessor);
				}

				GlTF_Accessor tangentAccessor = null;
				if (m.tangents.Length > 0)
				{
					tangentAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "tangents"), GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.FLOAT);
					tangentAccessor.bufferView = GlTF_Writer.vec4BufferView;
					GlTF_Writer.accessors.Add(tangentAccessor);
				}

				var smCount = m.subMeshCount;
				for (var i = 0; i < smCount; ++i)
				{
					GlTF_Primitive primitive = new GlTF_Primitive();
					primitive.name = GlTF_Primitive.GetNameFromObject(m, i);
					primitive.index = i;
					GlTF_Attributes attributes = new GlTF_Attributes();
					attributes.positionAccessor = positionAccessor;
					attributes.normalAccessor = normalAccessor;
					attributes.colorAccessor = colorAccessor;
					attributes.texCoord0Accessor = uv0Accessor;
					attributes.texCoord1Accessor = uv1Accessor;
					attributes.texCoord2Accessor = uv2Accessor;
					attributes.texCoord3Accessor = uv3Accessor;
					attributes.jointAccessor = jointAccessor;
					attributes.weightAccessor = weightAccessor;
					attributes.tangentAccessor = tangentAccessor;
					primitive.attributes = attributes;
					GlTF_Accessor indexAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "indices_" + i), GlTF_Accessor.Type.SCALAR, GlTF_Accessor.ComponentType.USHORT);
					indexAccessor.bufferView = GlTF_Writer.ushortBufferView;
					GlTF_Writer.accessors.Add (indexAccessor);
					primitive.indices = indexAccessor;

					var mr = GetRenderer(tr);
					var sm = mr.sharedMaterials;
					if (i < sm.Length) {
						var mat = sm[i];
						var matName = GlTF_Material.GetNameFromObject(mat);
						if(GlTF_Writer.materialNames.Contains(matName))
						{
							primitive.materialIndex = GlTF_Writer.materialNames.IndexOf(matName); // THIS INDIRECTION CAN BE REMOVED!
						}
						else
						{
							GlTF_Material material = new GlTF_Material();
							material.name = GlTF_Writer.cleanNonAlphanumeric(mat.name);
							primitive.materialIndex = GlTF_Writer.materials.Count;
							GlTF_Writer.materialNames.Add(matName);
							GlTF_Writer.materials.Add (material);

							//technique
							var s = mat.shader;
							var techName = GlTF_Technique.GetNameFromObject(s);
							if(GlTF_Writer.techniqueNames.Contains(techName))
							{
								material.instanceTechniqueIndex = GlTF_Writer.techniqueNames.IndexOf(techName);// THIS INDIRECTION CAN BE REMOVED!
							}
							else
							{
								GlTF_Technique tech = new GlTF_Technique();
								tech.name = techName;
								GlTF_Technique.Parameter tParam = new GlTF_Technique.Parameter();
								tParam.name = "position";
								tParam.type = GlTF_Technique.Type.FLOAT_VEC3;
								tParam.semantic = GlTF_Technique.Semantic.POSITION;
								tech.parameters.Add(tParam);
								GlTF_Technique.Attribute tAttr = new GlTF_Technique.Attribute();
								tAttr.name = "a_position";
								tAttr.param = tParam.name;
								tech.attributes.Add(tAttr);

								if (normalAccessor != null)
								{
									tParam = new GlTF_Technique.Parameter();
									tParam.name = "normal";
									tParam.type = GlTF_Technique.Type.FLOAT_VEC3;
									tParam.semantic = GlTF_Technique.Semantic.NORMAL;
									tech.parameters.Add(tParam);
									tAttr = new GlTF_Technique.Attribute();
									tAttr.name = "a_normal";
									tAttr.param = tParam.name;
									tech.attributes.Add(tAttr);
								}

								if (uv0Accessor != null)
								{
									tParam = new GlTF_Technique.Parameter();
									tParam.name = "texcoord0";
									tParam.type = GlTF_Technique.Type.FLOAT_VEC2;
									tParam.semantic = GlTF_Technique.Semantic.TEXCOORD_0;
									tech.parameters.Add(tParam);
									tAttr = new GlTF_Technique.Attribute();
									tAttr.name = "a_texcoord0";
									tAttr.param = tParam.name;
									tech.attributes.Add(tAttr);
								}

								if (uv1Accessor != null)
								{
									tParam = new GlTF_Technique.Parameter();
									tParam.name = "texcoord1";
									tParam.type = GlTF_Technique.Type.FLOAT_VEC2;
									tParam.semantic = GlTF_Technique.Semantic.TEXCOORD_1;
									tech.parameters.Add(tParam);
									tAttr = new GlTF_Technique.Attribute();
									tAttr.name = "a_texcoord1";
									tAttr.param = tParam.name;
									tech.attributes.Add(tAttr);
								}

								if (uv2Accessor != null)
								{
									tParam = new GlTF_Technique.Parameter();
									tParam.name = "texcoord2";
									tParam.type = GlTF_Technique.Type.FLOAT_VEC2;
									tParam.semantic = GlTF_Technique.Semantic.TEXCOORD_2;
									tech.parameters.Add(tParam);
									tAttr = new GlTF_Technique.Attribute();
									tAttr.name = "a_texcoord2";
									tAttr.param = tParam.name;
									tech.attributes.Add(tAttr);
								}

								if (uv3Accessor != null)
								{
									tParam = new GlTF_Technique.Parameter();
									tParam.name = "texcoord3";
									tParam.type = GlTF_Technique.Type.FLOAT_VEC2;
									tParam.semantic = GlTF_Technique.Semantic.TEXCOORD_3;
									tech.parameters.Add(tParam);
									tAttr = new GlTF_Technique.Attribute();
									tAttr.name = "a_texcoord3";
									tAttr.param = tParam.name;
									tech.attributes.Add(tAttr);
								}

								tech.AddDefaultUniforms();

								// Populate technique with shader data
								GlTF_Writer.techniqueNames.Add (techName);
								GlTF_Writer.techniques.Add (tech);

								// create program
								GlTF_Program program = new GlTF_Program();
								program.name = GlTF_Program.GetNameFromObject(s);
								tech.program = program.name;
								foreach (var attr in tech.attributes)
								{
									program.attributes.Add(attr.name);
								}
								GlTF_Writer.programs.Add(program);
							}

							unityToPBRMaterial(mat, ref material);
						}
					}
					mesh.primitives.Add(primitive);
				}

				// If gameobject having SkinnedMeshRenderer component has been transformed,
				// the mesh would need to be baked here.
				mesh.Populate(m);
				GlTF_Writer.meshes.Add(mesh);
				node.meshIndex = GlTF_Writer.meshes.IndexOf(mesh);
			}

			// Parse animations
			if (exportAnimation)
			{
				Animator a = tr.GetComponent<Animator>();
				if (a != null)
				{
					AnimationClip[] clips = AnimationUtility.GetAnimationClips(tr.gameObject);
					for (int i = 0; i < clips.Length; i++)
					{
						//FIXME It seems not good to generate one animation per animator.
                        GlTF_Animation anim = new GlTF_Animation(GlTF_Writer.cleanNonAlphanumeric(clips[i].name));
						anim.Populate(clips[i], tr, GlTF_Writer.bakeAnimation);
						if(anim.channels.Count > 0)
							GlTF_Writer.animations.Add(anim);
					}
				}

				Animation animation = tr.GetComponent<Animation>();
				if (animation != null)
				{
					AnimationClip clip = animation.clip;
					//FIXME It seems not good to generate one animation per animator.
					GlTF_Animation anim = new GlTF_Animation(GlTF_Writer.cleanNonAlphanumeric(animation.name));
					anim.Populate(clip, tr, GlTF_Writer.bakeAnimation);
					if (anim.channels.Count > 0)
						GlTF_Writer.animations.Add(anim);
				}
			}

			// Parse transform
			if (tr.parent == null)
			{
				Matrix4x4 mat = Matrix4x4.identity;
				if(debugRightHandedScale)
					mat.m22 = -1;
				mat = mat * Matrix4x4.TRS(tr.localPosition, tr.localRotation, tr.localScale);
                node.matrix = new GlTF_Matrix(mat, true, tr.GetComponent<Light>() != null);
			}
			// Use good transform if parent object is not in selection
			else if (!trs.Contains(tr.parent))
			{
				node.hasParent = false;
				Matrix4x4 mat = Matrix4x4.identity;
				if(debugRightHandedScale)
					mat.m22 = -1;
				mat = mat * tr.localToWorldMatrix;
                node.matrix = new GlTF_Matrix(mat, true, tr.GetComponent<Light>() != null);
			}
			else
			{
				node.hasParent = true;
				if (tr.localPosition != Vector3.zero)
					node.translation = new GlTF_Translation (tr.localPosition);
				if (tr.localScale != Vector3.one)
					node.scale = new GlTF_Scale (tr.localScale);
				if (tr.localRotation != Quaternion.identity)
					node.rotation = new GlTF_Rotation (tr.localRotation);
			}

			if(!node.hasParent)
				correctionNode.childrenNames.Add(node.id);

			if (tr.GetComponent<Camera>() != null)
			{
				node.cameraName = GlTF_Writer.cleanNonAlphanumeric(tr.name);
			}

			// Parse node's skin data
			GlTF_Accessor invBindMatrixAccessor = null;
			SkinnedMeshRenderer skinMesh = tr.GetComponent<SkinnedMeshRenderer>();
			if (exportAnimation && skinMesh != null && skinMesh.enabled && checkSkinValidity(skinMesh, trs) && skinMesh.rootBone != null)
			{
				GlTF_Skin skin = new GlTF_Skin();

				skin.name = GlTF_Writer.cleanNonAlphanumeric(skinMesh.rootBone.name) + "_skeleton_" + GlTF_Writer.cleanNonAlphanumeric(node.name) + tr.GetInstanceID();

				// Create invBindMatrices accessor
				invBindMatrixAccessor = new GlTF_Accessor(skin.name + "invBindMatrices", GlTF_Accessor.Type.MAT4, GlTF_Accessor.ComponentType.FLOAT);
				invBindMatrixAccessor.bufferView = GlTF_Writer.mat4BufferView;
				GlTF_Writer.accessors.Add(invBindMatrixAccessor);

				// Generate skin data
				skin.Populate(tr, ref invBindMatrixAccessor, GlTF_Writer.accessors.Count -1);
				GlTF_Writer.skins.Add(skin);
				node.skinIndex = GlTF_Writer.skins.IndexOf(skin);
			}

			foreach (Transform t in tr.transform)
			{
				if(t.gameObject.activeInHierarchy)
					node.childrenNames.Add(GlTF_Node.GetNameFromObject(t));
			}

			GlTF_Writer.nodeNames.Add(node.id);
			GlTF_Writer.nodes.Add (node);
		}

		if (GlTF_Writer.meshes.Count == 0)
		{
			Debug.Log("No visible objects have been exported. Aboring export");
			yield return false;
		}

		writer.OpenFiles(path);
		writer.Write ();
		writer.CloseFiles();

		if(nbDisabledObjects > 0)
			Debug.Log(nbDisabledObjects + " disabled object ignored during export");

		Debug.Log("Scene has been exported to " + path);
		if(buildZip)
		{
			ZipFile zip = new ZipFile();
			Debug.Log(GlTF_Writer.exportedFiles.Count + " files generated");
			string zipName = Path.GetFileNameWithoutExtension(path) + ".zip";
			foreach(string originFilePath in GlTF_Writer.exportedFiles.Keys)
			{
				zip.AddFile(originFilePath, GlTF_Writer.exportedFiles[originFilePath]);
			}
			
			zip.Save(savedPath + "/" + zipName);

			// Remove all files
			foreach (string pa in GlTF_Writer.exportedFiles.Keys)
			{
				if (System.IO.File.Exists(pa))
					System.IO.File.Delete(pa);
			}

			Debug.Log("Files have been cleaned");
		}
		done = true;

		yield return true;
	}

	// Check if all the bones referenced by the skin are in the selection
	public bool checkSkinValidity(SkinnedMeshRenderer skin, List<Transform> selection)
	{
		string unselected = "";
		foreach(Transform t in skin.bones)
		{
			if (!selection.Contains(t))
			{
				unselected = unselected + "\n" + t.name;
			}
		}

		if(unselected.Length > 0)
		{
			Debug.LogError("Error while exportin skin for " + skin.name + " (skipping skinning export).\nClick for more details:\n \nThe following bones are used but are not selected" + unselected + "\n");
			return false;
		}

		return true;
	}

	private string toGlTFname(string name)
	{
		// remove spaces and illegal chars, replace with underscores
		string correctString = name.Replace(" ", "_");
		// make sure it doesn't start with a number
		return correctString;
	}

	private bool isInheritedFrom (Type t, Type baseT)
	{
		if (t == baseT)
			return true;
		t = t.BaseType;
		while (t != null && t != typeof(System.Object))
		{
			if (t == baseT)
				return true;
			t = t.BaseType;
		}
		return false;
	}

	private Renderer GetRenderer(Transform tr)
	{
		Renderer mr = tr.GetComponent<MeshRenderer>();
		if (mr == null) {
			mr = tr.GetComponent<SkinnedMeshRenderer>();
		}
		return mr;
	}

	private void clampColor(ref Color c)
	{
		c.r = c.r > 1.0f ? 1.0f : c.r;
		c.g = c.g > 1.0f ? 1.0f : c.g;
		c.b = c.b > 1.0f ? 1.0f : c.b;
		//c.a = c.a > 1.0f ? 1.0f : c.a;
	}

	private Mesh GetMesh(Transform tr)
	{
		var mr = GetRenderer(tr);
		Mesh m = null;
		if (mr != null && mr.enabled)
		{
			var t = mr.GetType();
			if (t == typeof(MeshRenderer))
			{
				MeshFilter mf = tr.GetComponent<MeshFilter>();
				if(!mf)
				{
					Debug.Log("The gameObject " + tr.name + " will be exported as Transform (object has no MeshFilter component attached)");
					return null;
				}
				m = mf.sharedMesh;
			} else if (t == typeof(SkinnedMeshRenderer))
			{
				SkinnedMeshRenderer smr = mr as SkinnedMeshRenderer;
				m = smr.sharedMesh;
			}
		}
		return m;
	}

	private bool handleTransparency(ref Material mat, ref GlTF_Material material)
	{
		if (mat.HasProperty("_Mode") && mat.GetFloat("_Mode") != 0)
		{
			string mode = mat.GetFloat("_Mode") == 1 ? "MASK" : "BLEND";
			GlTF_Material.StringValue alphaMode = new GlTF_Material.StringValue();
			alphaMode.name = "alphaMode";
			alphaMode.value = mode;

			GlTF_Material.FloatValue alphaCutoff = new GlTF_Material.FloatValue();
			alphaCutoff.name = "alphaCutoff";
			alphaCutoff.value = mat.GetFloat("_Cutoff");

			material.values.Add(alphaMode);
			material.values.Add(alphaCutoff);

			return true;
		}

		return false;
	}

	private void addTexturePixels(ref Texture2D texture, ref Color[] colors, IMAGETYPE outputChannel, IMAGETYPE inputChannel = IMAGETYPE.R)
	{
		int height = texture.height;
		int width = texture.width;
		Color[] inputColors = new Color[texture.width * texture.height];
		if (!texture || !getPixelsFromTexture(ref texture, out inputColors))
			return;

		if(height * width != colors.Length)
		{
			Debug.Log("Issue with texture dimensions");
			return;
		}

		if(inputChannel != IMAGETYPE.R && inputChannel != IMAGETYPE.A)
		{
			Debug.Log("Incorrect input channel (only 'R' and 'A' supported)");
		}

		for (int i = 0; i < height; ++i)
		{
			for (int j = 0; j < width; ++j)
			{
				int index = i * width + j;
				int newIndex = (height - i - 1) * width + j;
				Color c = outputChannel == IMAGETYPE.RGB ? inputColors[newIndex] : colors[index];
				float inputValue = inputChannel == IMAGETYPE.R ? inputColors[newIndex].r : inputColors[newIndex].a;

				if(outputChannel == IMAGETYPE.R)
				{
					c.r = inputValue;
				}
				else if(outputChannel == IMAGETYPE.G)
				{
					c.g = inputValue;
				}
				else if(outputChannel == IMAGETYPE.B)
				{
					c.b = inputValue;
				}
				else if(outputChannel == IMAGETYPE.G_INVERT)
				{
					c.g = 1.0f - inputValue;
				}

				colors[index] = c;
			}
		}

	}

	private int createOcclusionMetallicRoughnessTexture(ref Texture2D occlusion, ref Texture2D metallicRoughness)
	{
		string texName = "";
		int width = -1;
		int height = -1;
		string assetPath = "";
		if(occlusion)
		{
			texName = texName + GlTF_Texture.GetNameFromObject(occlusion);
			assetPath = AssetDatabase.GetAssetPath(occlusion);
			width = occlusion.width;
			height = occlusion.height;
		}
		else
		{
			texName = texName + "_";
		}

		if (metallicRoughness)
		{
			texName = texName + GlTF_Texture.GetNameFromObject(metallicRoughness);
			assetPath = AssetDatabase.GetAssetPath(metallicRoughness);
			width = metallicRoughness.width;
			height = metallicRoughness.height;
		}
		else
		{
			texName = texName + "_";
		}

		if (!GlTF_Writer.textureNames.Contains(texName))
		{
			// Create texture
			GlTF_Texture texture = new GlTF_Texture();
			texture.name = texName;

			// Export image
			GlTF_Image img = new GlTF_Image();
			img.name = texName;
			//img.uri =

			// Let's consider that the three textures have the same resolution
			Color[] outputColors = new Color[width * height];
			for (int i = 0; i < outputColors.Length; ++i)
				outputColors[i] = new Color(1.0f, 1.0f, 1.0f);

			if (occlusion)
				addTexturePixels(ref occlusion, ref outputColors, IMAGETYPE.R);
			if (metallicRoughness)
			{
				addTexturePixels(ref metallicRoughness, ref outputColors, IMAGETYPE.B);
				addTexturePixels(ref metallicRoughness, ref outputColors, IMAGETYPE.G_INVERT, IMAGETYPE.A);
			}

			Texture2D newtex = new Texture2D(width, height);
			newtex.SetPixels(outputColors);
			newtex.Apply();

			string pathInArchive = Path.GetDirectoryName(assetPath);
			string exportDir = Path.Combine(savedPath, pathInArchive);

			if (!Directory.Exists(exportDir))
				Directory.CreateDirectory(exportDir);

			string outputFilename = Path.GetFileNameWithoutExtension(assetPath) + "_converted_metalRoughness.jpg";
			string exportPath = exportDir + "/" + outputFilename;  // relative path inside the .zip
			File.WriteAllBytes(exportPath, newtex.EncodeToJPG(jpgQuality));

			if (!GlTF_Writer.exportedFiles.ContainsKey(exportPath))
				GlTF_Writer.exportedFiles.Add(exportPath, pathInArchive);
			else
				Debug.LogError("Texture '" + newtex.name + "' already exists");

			img.uri = pathInArchive + "/" + outputFilename;

			texture.source = GlTF_Writer.imageNames.Count;
			GlTF_Writer.imageNames.Add(img.name);
			GlTF_Writer.images.Add(img);

			// Add sampler
			GlTF_Sampler sampler;
			var samplerName = GlTF_Sampler.GetNameFromObject(metallicRoughness);
			if (!GlTF_Writer.samplerNames.Contains(samplerName))
			{
				sampler = new GlTF_Sampler(metallicRoughness);
				sampler.name = samplerName;
				GlTF_Writer.samplers.Add(sampler);
				GlTF_Writer.samplerNames.Add(samplerName);
			}

			GlTF_Writer.textures.Add(texture);
			GlTF_Writer.textureNames.Add(texName);
		}

		return GlTF_Writer.textureNames.IndexOf(texName);

	}

	// Get or create texture object, image and sampler
	private int processTexture(Texture2D t, IMAGETYPE format)
	{
		var texName = GlTF_Texture.GetNameFromObject(t);
		if (AssetDatabase.GetAssetPath(t).Length == 0)
		{
			Debug.LogWarning("Texture " + t.name + " cannot be found in assets");
			return -1;
		}

		if (!GlTF_Writer.textureNames.Contains(texName))
		{
			string assetPath = AssetDatabase.GetAssetPath(t);

			// Create texture
			GlTF_Texture texture = new GlTF_Texture();
			texture.name = texName;

			// Export image
			GlTF_Image img = new GlTF_Image();
			img.name = GlTF_Image.GetNameFromObject(t);
			img.uri = convertTexture(ref t, assetPath, savedPath, format);

			texture.source = GlTF_Writer.imageNames.Count;
			GlTF_Writer.imageNames.Add(img.name);
			GlTF_Writer.images.Add(img);

			// Add sampler
			GlTF_Sampler sampler;
			var samplerName = GlTF_Sampler.GetNameFromObject(t);
			if (!GlTF_Writer.samplerNames.Contains(samplerName))
			{
				sampler = new GlTF_Sampler(t);
				sampler.name = samplerName;
				GlTF_Writer.samplers.Add(sampler);
				GlTF_Writer.samplerNames.Add(samplerName);
			}

			GlTF_Writer.textures.Add(texture);
			GlTF_Writer.textureNames.Add(texName);
		}

		return GlTF_Writer.textureNames.IndexOf(texName);
	}

	// Convert material from Unity to glTF PBR
	private void unityToPBRMaterial(Material mat, ref GlTF_Material material)
	{
		bool isMaterialPBR = true;
		bool isMetal = true;
		bool hasPBRMap = false;

		if (!mat.shader.name.Contains("Standard"))
		{
			Debug.Log("Material " + mat.shader + " is not fully supported");
			isMaterialPBR = false;
		}
		else
		{
			// Is metal workflow used
			isMetal = mat.shader.name == "Standard";
			GlTF_Writer.hasSpecularMaterials = GlTF_Writer.hasSpecularMaterials || !isMetal;
			material.isMetal = isMetal;

			// Is smoothness defined by diffuse texture or PBR texture' alpha?
			if (mat.GetFloat("_SmoothnessTextureChannel") != 0)
				Debug.Log("Smoothness uses diffuse's alpha channel. Unsupported for now");

			hasPBRMap = (!isMetal && mat.GetTexture("_SpecGlossMap") != null || isMetal && mat.GetTexture("_MetallicGlossMap") != null);
		}

		//Check transparency
		bool hasTransparency = handleTransparency(ref mat, ref material);

		//Parse diffuse channel texture and color
		if (mat.HasProperty("_MainTex") && mat.GetTexture("_MainTex") != null)
		{
			var textureValue = new GlTF_Material.DictValue();
			textureValue.name = isMetal ? "baseColorTexture" : "diffuseTexture";

			int diffuseTextureIndex = processTexture((Texture2D)mat.GetTexture("_MainTex"), hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
			textureValue.intValue.Add("index", diffuseTextureIndex);
			textureValue.intValue.Add("texCoord", 0);
			material.pbrValues.Add(textureValue);
		}

		if (mat.HasProperty("_Color"))
		{
			var colorValue = new GlTF_Material.ColorValue();
			colorValue.name = isMetal ? "baseColorFactor" : "diffuseFactor";
			Color c = mat.GetColor("_Color");
			clampColor(ref c);
			colorValue.color = c;
			material.pbrValues.Add(colorValue);
		}

		//Parse PBR textures
		if (isMaterialPBR)
		{
			if (isMetal)
			{
				if (hasPBRMap) // No metallic factor if texture
				{
					var textureValue = new GlTF_Material.DictValue();
					textureValue.name = "metallicRoughnessTexture";
					Texture2D metallicRoughnessTexture = (Texture2D)mat.GetTexture("_MetallicGlossMap");
					Texture2D occlusion = (Texture2D)mat.GetTexture("_OcclusionMap");
					int metalRoughTextureIndex = createOcclusionMetallicRoughnessTexture (ref occlusion, ref metallicRoughnessTexture);
					textureValue.intValue.Add("index", metalRoughTextureIndex);
					textureValue.intValue.Add("texCoord", 0);
					material.pbrValues.Add(textureValue);
				}

				var metallicFactor = new GlTF_Material.FloatValue();
				metallicFactor.name = "metallicFactor";
				metallicFactor.value = hasPBRMap ? 1.0f : mat.GetFloat("_Metallic");
				material.pbrValues.Add(metallicFactor);

				//Roughness factor
				var roughnessFactor = new GlTF_Material.FloatValue();
				roughnessFactor.name = "roughnessFactor";
				roughnessFactor.value = hasPBRMap ? 1.0f : 1 - mat.GetFloat("_Glossiness"); // gloss scale is not supported for now(property _GlossMapScale)
				material.pbrValues.Add(roughnessFactor);
			}
			else
			{
				if (hasPBRMap) // No metallic factor if texture
				{
					var textureValue = new GlTF_Material.DictValue();
					textureValue.name = "specularGlossinessTexture";
					int specGlossTextureIndex = processTexture((Texture2D)mat.GetTexture("_SpecGlossMap"), IMAGETYPE.RGBA);
					textureValue.intValue.Add("index", specGlossTextureIndex);
					textureValue.intValue.Add("texCoord", 0);
					material.pbrValues.Add(textureValue);
				}

				var specularFactor = new GlTF_Material.ColorValue();
				specularFactor.name = "specularFactor";
				specularFactor.color = hasPBRMap ? Color.white : mat.GetColor("_SpecColor"); // gloss scale is not supported for now(property _GlossMapScale)
				specularFactor.isRGB = true;
				material.pbrValues.Add(specularFactor);

				var glossinessFactor = new GlTF_Material.FloatValue();
				glossinessFactor.name = "glossinessFactor";
				glossinessFactor.value = hasPBRMap ? 1.0f : mat.GetFloat("_Glossiness"); // gloss scale is not supported for now(property _GlossMapScale)
				material.pbrValues.Add(glossinessFactor);
			}
		}

		//BumpMap
		if (mat.HasProperty("_BumpMap") && mat.GetTexture("_BumpMap") != null)
		{
			Texture2D bumpTexture = mat.GetTexture("_BumpMap") as Texture2D;
			// Check if it's a normal or a bump map
			TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(bumpTexture)) as TextureImporter;
			bool isBumpMap = im.convertToNormalmap;

			if(isBumpMap)
			{
				Debug.LogWarning("Unsupported texture " + bumpTexture + " (normal maps generated from grayscale are not supported)");
			}
			else
			{
				var textureValue = new GlTF_Material.DictValue();
				textureValue.name = "normalTexture";

				int bumpTextureIndex = processTexture(bumpTexture, IMAGETYPE.NORMAL_MAP);
				textureValue.intValue.Add("index", bumpTextureIndex);
				textureValue.intValue.Add("texCoord", 0);
				textureValue.floatValue.Add("scale", mat.GetFloat("_BumpScale"));
				material.values.Add(textureValue);
			}
		}

		//Emissive
		if (mat.HasProperty("_EmissionMap") && mat.GetTexture("_EmissionMap") != null)
		{
			Texture2D emissiveTexture = mat.GetTexture("_EmissionMap") as Texture2D;
			var textureValue = new GlTF_Material.DictValue();
			textureValue.name = "emissiveTexture";

			int emissiveTextureIndex = processTexture(emissiveTexture, IMAGETYPE.RGB);
			textureValue.intValue.Add("index", emissiveTextureIndex);
			textureValue.intValue.Add("texCoord", 0);
			material.values.Add(textureValue);
		}

		var emissiveFactor = new GlTF_Material.ColorValue();
		emissiveFactor.name = "emissiveFactor";
		emissiveFactor.isRGB = true;
		emissiveFactor.color = mat.GetColor("_EmissionColor");
		material.values.Add(emissiveFactor);

		//Occlusion (kept as separated channel for specular workflow, but merged in R channel for metallic workflow)
		if (mat.HasProperty("_OcclusionMap") && mat.GetTexture("_OcclusionMap") != null)
		{
			Texture2D occlusionTexture = mat.GetTexture("_OcclusionMap") as Texture2D;
			var textureValue = new GlTF_Material.DictValue();
			textureValue.name = "occlusionTexture";

			int occlusionTextureIndex = processTexture(occlusionTexture, IMAGETYPE.RGB);
			textureValue.intValue.Add("index", occlusionTextureIndex);
			textureValue.intValue.Add("texCoord", 0);
			textureValue.floatValue.Add("strength", mat.GetFloat("_OcclusionStrength"));
			material.values.Add(textureValue);
		}

		// Unity materials are single sided by default
		GlTF_Material.BoolValue doubleSided = new GlTF_Material.BoolValue();
		doubleSided.name = "doubleSided";
		doubleSided.value = false;
		material.values.Add(doubleSided);
	}
	private bool getPixelsFromTexture(ref Texture2D texture, out Color[] pixels)
	{
		//Make texture readable
		TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
		if(!im)
		{
			pixels = new Color[1];
			return false;
		}
		bool readable = im.isReadable;
#if UNITY_5_4
		TextureImporterFormat format = im.textureFormat;
#else
		TextureImporterCompression format = im.textureCompression;
#endif
		TextureImporterType type = im.textureType;
		bool isConvertedBump = im.convertToNormalmap;

		if (!readable)
			im.isReadable = true;
#if UNITY_5_4
		if (type != TextureImporterType.Image)
			im.textureType = TextureImporterType.Image;
		im.textureFormat = TextureImporterFormat.ARGB32;
#else
		if (type != TextureImporterType.Default)
			im.textureType = TextureImporterType.Default;

		im.textureCompression = TextureImporterCompression.Uncompressed;
#endif
		im.SaveAndReimport();

		pixels = texture.GetPixels();

		if (!readable)
			im.isReadable = false;
#if UNITY_5_4
		if (type != TextureImporterType.Image)
			im.textureType = type;
#else
		if (type != TextureImporterType.Default)
			im.textureType = type;
#endif
		if (isConvertedBump)
			im.convertToNormalmap = true;

#if UNITY_5_4
		im.textureFormat = format;
#else
		im.textureCompression = format;
#endif

		im.SaveAndReimport();

		return true;
	}

	// Flip all images on Y and
	public string convertTexture(ref Texture2D inputTexture, string pathInProject, string exportDirectory, IMAGETYPE format)
	{
		int height = inputTexture.height;
		int width = inputTexture.width;
		Color[] textureColors = new Color[inputTexture.height * inputTexture.width];
		if(!getPixelsFromTexture(ref inputTexture, out textureColors))
		{
			Debug.Log("Failed to convert texture " + inputTexture.name + " (unsupported type or format)");
			return "";
		}
		Color[] newTextureColors = new Color[inputTexture.height * inputTexture.width];

		for (int i = 0; i < height; ++i)
		{
			for (int j = 0; j < width; ++j)
			{
				newTextureColors[i * width + j] = textureColors[(height - i - 1) * width + j];
				if (format == IMAGETYPE.RGBA_OPAQUE)
					newTextureColors[i * width + j].a = 1.0f;
			}
		}

		Texture2D newtex = new Texture2D(inputTexture.width, inputTexture.height);
		newtex.SetPixels(newTextureColors);
		newtex.Apply();

		string pathInArchive = Path.GetDirectoryName(pathInProject);
		string exportDir = Path.Combine(exportDirectory, pathInArchive);

		if (!Directory.Exists(exportDir))
			Directory.CreateDirectory(exportDir);

		string outputFilename = Path.GetFileNameWithoutExtension(pathInProject) + (format == IMAGETYPE.RGBA ? ".png" : ".jpg");
		string exportPath = exportDir + "/" + outputFilename;  // relative path inside the .zip
		string pathInGltfFile = pathInArchive + "/" + outputFilename;
		File.WriteAllBytes(exportPath, (format == IMAGETYPE.RGBA ? newtex.EncodeToPNG() : newtex.EncodeToJPG( format== IMAGETYPE.NORMAL_MAP ? 95 : jpgQuality)));

		if (!GlTF_Writer.exportedFiles.ContainsKey(exportPath))
			GlTF_Writer.exportedFiles.Add(exportPath, pathInArchive);
		else
			Debug.LogError("Texture '" + inputTexture + "' already exists");

		return pathInGltfFile;
	}
}
#endif