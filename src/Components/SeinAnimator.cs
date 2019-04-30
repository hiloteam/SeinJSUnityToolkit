using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

#if UNITY_EDITOR
using UnityEditor;
#endif

[AddComponentMenu("Sein/Core Components/Sein Animator"), ExecuteInEditMode]
public class SeinAnimator : MonoBehaviour
{
    static Dictionary<int, List<string>> allAnimations = new Dictionary<int, List<string>>();
    static int currentGoID;
    static bool callbackRegisterd = false;

    static void OnSelectionChange()
    {
        var activeGameObject = Selection.activeGameObject;
        currentGoID = activeGameObject.GetHashCode();

        var parent = activeGameObject.transform;
        while (parent != null)
        {
            if (parent.GetComponent<Animator>() != null)
            {
                currentGoID = parent.gameObject.GetHashCode();
                break;
            }

            parent = parent.parent;
        }
    }

    private class StringInList : PropertyAttribute
    {
        public delegate string[] GetStringList();

        public StringInList()
        {
            if (allAnimations.ContainsKey(currentGoID))
            {
                List = allAnimations[currentGoID].ToArray();
            }
        }

        public string[] List
        {
            get;
            private set;
        }
    }

#if UNITY_EDITOR
    [CustomPropertyDrawer(typeof(StringInList))]
    private class StringInListDrawer : PropertyDrawer
    {
        // Draw the property inside the given rect
        public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
        {
            var stringInList = attribute as StringInList;
            var list = stringInList.List;
            if (property.propertyType == SerializedPropertyType.String)
            {
                int index = Mathf.Max(0, Array.IndexOf(list, property.stringValue));
                index = EditorGUI.Popup(position, property.displayName, index, list);

                property.stringValue = list[index];
            }
            else if (property.propertyType == SerializedPropertyType.Integer)
            {
                property.intValue = EditorGUI.Popup(position, property.displayName, property.intValue, list);
            }
            else
            {
                base.OnGUI(position, property, label);
            }
        }
    }
#endif

    public static string extensionName = "Sein_animator";

    // If not set, use all
    [StringInList()]
    public string[] modelAnimations;
    [StringInList()]
    public string defaultAnimation;

    public void OnEnable()
    {
        var parent = this.transform;
        Animator animator;

        while (parent != null)
        {
            animator = parent.GetComponent<Animator>();

            if (animator != null)
            {
                break;
            }

            parent = parent.parent;
        }

        currentGoID = parent.gameObject.GetHashCode();
        var animations = allAnimations[currentGoID] = new List<string>();

        var clips = AnimationUtility.GetAnimationClips(parent.gameObject);
        foreach (var clip in clips)
        {
            animations.Add(clip.name);
        }

        if (!callbackRegisterd)
        {
            Selection.selectionChanged += OnSelectionChange;
            callbackRegisterd = true;
        }
    }
}
