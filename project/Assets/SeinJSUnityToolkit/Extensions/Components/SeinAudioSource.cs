using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public enum ESeinAudioPanningModelType
{
    equalpower,
    HRTF
}

public enum ESeinAudioDistanceModelType
{
    linear,
    inverse,
    exponential
}

[Serializable]
public struct SeinAudioOneClip
{
    public string name;
    public SeinAudioClip clip;
}

[Serializable]
public class SeinAudioSourceSpaceOptions
{
    public bool rotatable;
    public ESeinAudioPanningModelType panningModel = ESeinAudioPanningModelType.HRTF;
    public ESeinAudioDistanceModelType distanceModel = ESeinAudioDistanceModelType.linear;
    public float refDistance = 1;
    public float maxDistance = 10000;
    public float rolloffFactor = 1;
    public float coneInnerAngle = 360;
    public float coneOuterAngle = 0;
    public float coneOuterGain = 0;
}

[Serializable]
public class SeinAudioSourceAutoPlayOptions
{
    public bool loop = true;
    public float start = 0;
    public float end = 0;
}

[AddComponentMenu("Sein/Audio Extension/Sein Audio Source"), ExecuteInEditMode]
public class SeinAudioSource : MonoBehaviour
{
    public SeinAudioOneClip[] clips = { };
    public string defaultClip = "";
    public bool needAutoPlay;
    public SeinAudioSourceAutoPlayOptions autoPlayOptions;
    public bool isSpaceAudio;
    public SeinAudioSourceSpaceOptions spaceOptions;

    public void OnEnable()
    {
        if (clips.Length <= 0)
        {
            return;
        }

        SeinAudioClip ac = null;
        if (defaultClip == "")
        {
            defaultClip = clips[0].name;
            ac = clips[0].clip;
        }
        else
        {
            bool rightDefaultClip = false;
            foreach (var clip in clips)
            {
                if (clip.name == defaultClip)
                {
                    rightDefaultClip = true;
                    ac = clip.clip;
                    break;
                }
            }
            if (!rightDefaultClip)
            {
                defaultClip = clips[0].name;
                ac = clips[0].clip;
            }
        }
    }
}
