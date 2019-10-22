using UnityEngine;
using System.Collections;

[AddComponentMenu("Sein/Core Components/Sein Rigid Body")]
public class SeinRigidBody : MonoBehaviour
{
    [Header("Body Options")]
    // If this node is toplevel, selfType will default to Actor
    // If not toplevel, it will default to Inherit
    // If parent's type is Component, it must be Component
    public float mass = 1;
    public float friction = 0;
    public float restitution = 0;
    public bool unControl = false;
    public bool physicStatic = false;
    public bool sleeping = false;

    public static SeinRigidBody CreateBodyForPickOnly()
    {
        var body = new SeinRigidBody();
        body.unControl = false;
        body.physicStatic = true;
        body.sleeping = true;

        return body;
    }
}
