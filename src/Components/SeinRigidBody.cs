using UnityEngine;
using System.Collections;

[AddComponentMenu("Sein/Core Components/Sein Rigid Body")]
public class SeinRigidBody : MonoBehaviour
{
    public static string extensionName = "Sein_physicBody";

    [Header("Node Type")]
    // If this node is toplevel, selfType will default to Actor
    // If not toplevel, it will default to Inherit
    // If parent's type is Component, it must be Component
    public float mass = 0;
    public float friction = 0;
    public float restitution = 0;
    public bool unControl = false;
    public bool physicStatic = false;
}
