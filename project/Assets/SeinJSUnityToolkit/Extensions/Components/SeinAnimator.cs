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
    public new string name;
    [HideInInspector]
    public string[] modelAnimations;
    [HideInInspector]
    public string defaultAnimation;
    [HideInInspector]
    public string[] prefixes;
}
