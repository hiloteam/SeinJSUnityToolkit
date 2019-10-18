using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

#if UNITY_EDITOR
using UnityEditor;
#endif

[AddComponentMenu("Sein/Core Components/Sein Animator")]
public class SeinAnimator : MonoBehaviour
{
    [HideInInspector]
    public string[] modelAnimations;
    [HideInInspector]
    public string defaultAnimation;
    public string[] prefixes;
}
