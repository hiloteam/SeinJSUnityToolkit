#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;

public class GlTF_Animation : GlTF_Writer {
	public List<GlTF_Channel> channels = new List<GlTF_Channel>();
	public List<GlTF_AnimSampler> animSamplers = new List<GlTF_AnimSampler>();

	public enum ROTATION_TYPE
	{
		UNKNOWN,
		QUATERNION,
		EULER
	};

	int bakingFramerate = 30; // FPS

	public GlTF_Animation (string n) {
		name = n;
	}

	private struct TargetCurveSet
	{
		public AnimationCurve[] translationCurves;
		public AnimationCurve[] rotationCurves;
		//Additional curve types
		public AnimationCurve[] localEulerAnglesRaw;
		public AnimationCurve[] m_LocalEuler;
		public AnimationCurve[] scaleCurves;
		public ROTATION_TYPE rotationType;
		public void Init()
		{
			translationCurves = new AnimationCurve[3];
			rotationCurves = new AnimationCurve[4];
			scaleCurves = new AnimationCurve[3];
		}
	}

	public void Populate(AnimationClip clip, Transform tr, bool bake = true)
	{
		// 1. browse clip, collect all curves and create a TargetCurveSet for each target
		Dictionary<string, TargetCurveSet> targetCurvesBinding = new Dictionary<string, TargetCurveSet>();
		collectClipCurves(clip, ref targetCurvesBinding);

		// Baking needs all properties, fill missing curves with transform data in 2 keyframes (start, endTime)
		// where endTime is clip duration
		generateMissingCurves(clip.length, ref tr, ref targetCurvesBinding);

		if (bake)
		{
			// Bake animation for all animated nodes
			foreach (string target in targetCurvesBinding.Keys)
			{
				Transform targetTr = target.Length > 0 ? tr.Find(target) : tr;
				if (targetTr == null)
					continue;

				Transform targetObject = targetTr;
				string targetId = GlTF_Node.GetNameFromObject(targetObject);

				// Initialize accessors for current animation
				GlTF_Accessor timeAccessor = new GlTF_Accessor(targetId + "_TimeAccessor_" + clip.name, GlTF_Accessor.Type.SCALAR, GlTF_Accessor.ComponentType.FLOAT);
				timeAccessor.bufferView = GlTF_Writer.floatBufferView;
				int timeAccessorIndex = GlTF_Writer.accessors.Count;
				GlTF_Writer.accessors.Add(timeAccessor);

				// Translation
				GlTF_Channel chTranslation = new GlTF_Channel("translation", animSamplers.Count);
				GlTF_Target targetTranslation = new GlTF_Target();
				targetTranslation.id = targetId;
				targetTranslation.path = "translation";
				chTranslation.target = targetTranslation;
				channels.Add(chTranslation);

				GlTF_AnimSampler sTranslation = new GlTF_AnimSampler(timeAccessorIndex, GlTF_Writer.accessors.Count);
				GlTF_Accessor translationAccessor = new GlTF_Accessor(targetId + "_TranslationAccessor_" + clip.name, GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
				translationAccessor.bufferView = GlTF_Writer.vec3BufferViewAnim;
				GlTF_Writer.accessors.Add(translationAccessor);
				animSamplers.Add(sTranslation);

				// Rotation
				GlTF_Channel chRotation = new GlTF_Channel("rotation", animSamplers.Count);
				GlTF_Target targetRotation = new GlTF_Target();
				targetRotation.id = GlTF_Node.GetNameFromObject(targetObject);
				targetRotation.path = "rotation";
				chRotation.target = targetRotation;
				channels.Add(chRotation);

				GlTF_AnimSampler sRotation = new GlTF_AnimSampler(timeAccessorIndex, GlTF_Writer.accessors.Count);
				GlTF_Accessor rotationAccessor = new GlTF_Accessor(targetId + "_RotationAccessor_" + clip.name, GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.FLOAT);
				rotationAccessor.bufferView = GlTF_Writer.vec4BufferViewAnim;
				GlTF_Writer.accessors.Add(rotationAccessor);
				animSamplers.Add(sRotation);

				// Scale
				GlTF_Channel chScale = new GlTF_Channel("scale", animSamplers.Count);
				GlTF_Target targetScale = new GlTF_Target();
				targetScale.id = GlTF_Node.GetNameFromObject(targetObject);
				targetScale.path = "scale";
				chScale.target = targetScale;
				channels.Add(chScale);

				GlTF_AnimSampler sScale = new GlTF_AnimSampler(timeAccessorIndex, GlTF_Writer.accessors.Count);
				GlTF_Accessor scaleAccessor = new GlTF_Accessor(targetId + "_ScaleAccessor_" + clip.name, GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
				scaleAccessor.bufferView = GlTF_Writer.vec3BufferViewAnim;
				GlTF_Writer.accessors.Add(scaleAccessor);
				animSamplers.Add(sScale);

				// Bake and populate animation data
				float[] times = null;
				Vector3[] positions = null;
				Vector3[] scales = null;
				Vector4[] rotations = null;
				bakeCurveSet(targetCurvesBinding[target], clip.length, bakingFramerate, ref times, ref positions, ref rotations, ref scales);

				// Populate accessors
				timeAccessor.Populate(times);
				translationAccessor.Populate(positions);
				rotationAccessor.Populate(rotations, false);
				scaleAccessor.Populate(scales, true);
			}
		}
		else
		{
			Debug.LogError("Only baked animation is supported for now. Skipping animation");
		}

	}

	private void collectClipCurves(AnimationClip clip, ref Dictionary<string, TargetCurveSet> targetCurves)
	{
		foreach (var binding in AnimationUtility.GetCurveBindings(clip))
		{
			AnimationCurve curve = AnimationUtility.GetEditorCurve(clip, binding);

			if (!targetCurves.ContainsKey(binding.path))
			{
				TargetCurveSet curveSet = new TargetCurveSet();
				curveSet.Init();
				targetCurves.Add(binding.path, curveSet);
			}

			TargetCurveSet current = targetCurves[binding.path];
			if (binding.propertyName.Contains("m_LocalPosition"))
			{
				if (binding.propertyName.Contains(".x"))
					current.translationCurves[0] = curve;
				else if (binding.propertyName.Contains(".y"))
					current.translationCurves[1] = curve;
				else if (binding.propertyName.Contains(".z"))
					current.translationCurves[2] = curve;
			}
			else if (binding.propertyName.Contains("m_LocalScale"))
			{
				if (binding.propertyName.Contains(".x"))
					current.scaleCurves[0] = curve;
				else if (binding.propertyName.Contains(".y"))
					current.scaleCurves[1] = curve;
				else if (binding.propertyName.Contains(".z"))
					current.scaleCurves[2] = curve;
			}
			else if (binding.propertyName.ToLower().Contains("localrotation"))
			{
				current.rotationType = ROTATION_TYPE.QUATERNION;
				if (binding.propertyName.Contains(".x"))
					current.rotationCurves[0] = curve;
				else if (binding.propertyName.Contains(".y"))
					current.rotationCurves[1] = curve;
				else if (binding.propertyName.Contains(".z"))
					current.rotationCurves[2] = curve;
				else if (binding.propertyName.Contains(".w"))
					current.rotationCurves[3] = curve;
			}
			// Takes into account 'localEuler', 'localEulerAnglesBaked' and 'localEulerAnglesRaw'
			else if (binding.propertyName.ToLower().Contains("localeuler"))
			{
				current.rotationType = ROTATION_TYPE.EULER;
				if (binding.propertyName.Contains(".x"))
					current.rotationCurves[0] = curve;
				else if (binding.propertyName.Contains(".y"))
					current.rotationCurves[1] = curve;
				else if (binding.propertyName.Contains(".z"))
					current.rotationCurves[2] = curve;
			}
			targetCurves[binding.path] = current;
		}
	}

	private void generateMissingCurves(float endTime, ref Transform tr, ref Dictionary<string, TargetCurveSet> targetCurvesBinding)
	{
		foreach (string target in targetCurvesBinding.Keys)
		{
			Transform targetTr = target.Length > 0 ? tr.Find(target): tr;
			if (targetTr == null)
				continue;

			TargetCurveSet current = targetCurvesBinding[target];
			if (current.translationCurves[0] == null)
			{
				current.translationCurves[0] = createConstantCurve(targetTr.localPosition.x, endTime);
				current.translationCurves[1] = createConstantCurve(targetTr.localPosition.y, endTime);
				current.translationCurves[2] = createConstantCurve(targetTr.localPosition.z, endTime);
			}

			if (current.scaleCurves[0] == null)
			{
				current.scaleCurves[0] = createConstantCurve(targetTr.localScale.x, endTime);
				current.scaleCurves[1] = createConstantCurve(targetTr.localScale.y, endTime);
				current.scaleCurves[2] = createConstantCurve(targetTr.localScale.z, endTime);
			}

			if (current.rotationCurves[0] == null)
			{
				current.rotationCurves[0] = createConstantCurve(targetTr.localRotation.x, endTime);
				current.rotationCurves[1] = createConstantCurve(targetTr.localRotation.y, endTime);
				current.rotationCurves[2] = createConstantCurve(targetTr.localRotation.z, endTime);
				current.rotationCurves[3] = createConstantCurve(targetTr.localRotation.w, endTime);
			}
		}
	}

	private void bakeCurveSet(TargetCurveSet curveSet, float length, int bakingFramerate, ref float[] times, ref Vector3[] positions, ref Vector4[] rotations, ref Vector3[] scales)
	{
		int nbSamples = (int)(length * 30);
		float deltaTime = length / nbSamples;

		// Initialize Arrays
		times = new float[nbSamples];
		positions = new Vector3[nbSamples];
		scales = new Vector3[nbSamples];
		rotations = new Vector4[nbSamples];

		// Assuming all the curves exist now
		for (int i = 0; i < nbSamples; ++i)
		{
			float currentTime = i * deltaTime;
			times[i] = currentTime;
			positions[i] = new Vector3(curveSet.translationCurves[0].Evaluate(currentTime), curveSet.translationCurves[1].Evaluate(currentTime), curveSet.translationCurves[2].Evaluate(currentTime));
			scales[i] = new Vector3(curveSet.scaleCurves[0].Evaluate(currentTime), curveSet.scaleCurves[1].Evaluate(currentTime), curveSet.scaleCurves[2].Evaluate(currentTime));
			if(curveSet.rotationType == ROTATION_TYPE.EULER)
			{
				Quaternion eulerToQuat = Quaternion.Euler(curveSet.rotationCurves[0].Evaluate(currentTime), curveSet.rotationCurves[1].Evaluate(currentTime), curveSet.rotationCurves[2].Evaluate(currentTime));
				rotations[i] = new Vector4(eulerToQuat.x, eulerToQuat.y, eulerToQuat.z, eulerToQuat.w);
			}
			else
			{
				rotations[i] = new Vector4(curveSet.rotationCurves[0].Evaluate(currentTime), curveSet.rotationCurves[1].Evaluate(currentTime), curveSet.rotationCurves[2].Evaluate(currentTime), curveSet.rotationCurves[3].Evaluate(currentTime));
			}
		}
	}

	public AnimationCurve createConstantCurve(float value, float endTime)
	{
		// No translation curves, adding them
		AnimationCurve curve = new AnimationCurve();
		curve.AddKey(0, value);
		curve.AddKey(endTime, value);
		return curve;
	}

	public override void Write()
	{
		if (channels.Count == 0)
			return;

		Indent();		jsonWriter.Write ("{\n");
		IndentIn();
		Indent();		jsonWriter.Write("\"name\": \"" + name + "\",\n");
		Indent();		jsonWriter.Write ("\"channels\": [\n");
		foreach (GlTF_Channel c in channels)
		{
			CommaNL();
			c.Write ();
		}
		jsonWriter.WriteLine();
		Indent();		jsonWriter.Write ("],\n");

		Indent();		jsonWriter.Write ("\"samplers\": [\n");
		IndentIn();
		foreach (GlTF_AnimSampler s in animSamplers)
		{
			CommaNL();
			s.Write ();
		}
		IndentOut();
		jsonWriter.WriteLine();
		Indent();		jsonWriter.Write ("]\n");

		IndentOut();
		Indent();		jsonWriter.Write ("}");
	}
}
#endif