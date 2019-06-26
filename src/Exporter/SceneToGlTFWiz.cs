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
using System.Text;
using System.Reflection;
using System.Text.RegularExpressions;
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
    IGNORE,
    HDR
}

public static class KTXHeader
{
    public static byte[] IDENTIFIER = { 0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A };
    public static byte[] ENDIANESS_LE = { 1, 2, 3, 4 };

    // constants for glInternalFormat
    public static int GL_ETC1_RGB8_OES = 0x8D64;

    public static int GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
    public static int GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
    public static int GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
    public static int GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

    public static int GL_ATC_RGB_AMD = 0x8C92;
    public static int GL_ATC_RGBA_INTERPOLATED_ALPHA_AMD = 0x87EE;

    public static int GL_COMPRESSED_RGB8_ETC2 = 0x9274;
    public static int GL_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9276;
    public static int GL_COMPRESSED_RGBA8_ETC2_EAC = 0x9278;
    public static int GL_COMPRESSED_R11_EAC = 0x9270;
    public static int GL_COMPRESSED_SIGNED_R11_EAC = 0x9271;
    public static int GL_COMPRESSED_RG11_EAC = 0x9272;
    public static int GL_COMPRESSED_SIGNED_RG11_EAC = 0x9273;

    public static int GL_COMPRESSED_RED_RGTC1 = 0x8DBB;
    public static int GL_COMPRESSED_RG_RGTC2 = 0x8DBD;
    public static int GL_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT = 0x8E8F;
    public static int GL_COMPRESSED_RGBA_BPTC_UNORM = 0x8E8C;

    public static int GL_R16F = 0x822D;
    public static int GL_RG16F = 0x822F;
    public static int GL_RGBA16F = 0x881A;
    public static int GL_R32F = 0x822E;
    public static int GL_RG32F = 0x8230;
    public static int GL_RGBA32F = 0x8814;

    // constants for glBaseInternalFormat
    public static int GL_RED = 0x1903;
    public static int GL_RGB = 0x1907;
    public static int GL_RGBA = 0x1908;
    public static int GL_RG = 0x8227;
}

public class SceneToGlTFWiz : MonoBehaviour
{
    public GlTF_Writer writer;
    string savedPath = "";
    int nbSelectedObjects = 0;

    static bool done = true;

    public static GlTF_Camera parseUnityCamera(Transform tr)
    {
        if (tr.GetComponent<Camera>().orthographic)
        {
            var camera = tr.GetComponent<Camera>();
            Matrix4x4 matrix = camera.projectionMatrix;
            GlTF_Orthographic cam;
            cam = new GlTF_Orthographic();
            cam.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
            cam.type = "orthographic";
            cam.zfar = (matrix[2, 3] / matrix[2, 2]) - (1 / matrix[2, 2]);
            cam.znear = cam.zfar + (2 / matrix[2, 2]);
            cam.xmag = 1 / matrix[0, 0];
            cam.ymag = 1 / matrix[1, 1];
            GlTF_Writer.cameras.Add(cam);

            return cam;
        }
        else
        {
            var camera = tr.GetComponent<Camera>();
            GlTF_Perspective cam;
            cam = new GlTF_Perspective();
            cam.type = "perspective";
            cam.zfar = camera.farClipPlane;
            cam.znear = camera.nearClipPlane;
            cam.aspect_ratio = camera.aspect;
            cam.yfov = camera.fieldOfView;
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
        var light = tr.GetComponent<Light>();
        if (Exporter.opt_exportLightMap && light.bakingOutput.isBaked)
        {
            return null;
        }

        switch (tr.GetComponent<Light>().type)
        {
            case LightType.Point:
                GlTF_PointLight pl = new GlTF_PointLight();
                pl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
                pl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                pl.intensity = tr.GetComponent<Light>().intensity;
                pl.range = tr.GetComponent<Light>().range;
                pl.halfSpotAngle = Exporter.opt_halfSpotAngle;
                pl.quadraticAttenuation = Exporter.opt_quadraticAttenuation;
                GlTF_Writer.lights.Add(pl);
                return pl;

            case LightType.Spot:
                GlTF_SpotLight sl = new GlTF_SpotLight();
                sl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
                sl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                sl.intensity = tr.GetComponent<Light>().intensity;
                sl.range = tr.GetComponent<Light>().range;
                sl.spotAngle = tr.GetComponent<Light>().spotAngle;
                sl.halfSpotAngle = Exporter.opt_halfSpotAngle;
                sl.quadraticAttenuation = Exporter.opt_quadraticAttenuation;
                GlTF_Writer.lights.Add(sl);
                return sl;

            case LightType.Directional:
                GlTF_DirectionalLight dl = new GlTF_DirectionalLight();
                dl.color = new GlTF_ColorRGB(tr.GetComponent<Light>().color);
                dl.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                dl.intensity = tr.GetComponent<Light>().intensity;
                dl.halfSpotAngle = Exporter.opt_halfSpotAngle;
                dl.quadraticAttenuation = Exporter.opt_quadraticAttenuation;
                GlTF_Writer.lights.Add(dl);
                return dl;
        }

        return null;
    }

    public void ExportCoroutine(string path, Preset presetAsset, bool buildZip, bool exportPBRMaterials, bool exportAnimation = true, bool doConvertImages = true)
    {
        var dirPath = Path.GetDirectoryName(path);

        Transform[] transforms;
        transforms = Selection.GetTransforms(SelectionMode.TopLevel);
        foreach (Transform tr in transforms)
        {
            var go = tr.gameObject;
            if (go.GetComponent<SeinNode>() == null)
            {
                go.AddComponent<SeinNode>();
            }
        }

        if (!Exporter.opt_splitChunks)
        {
            // collect all objects in the selection deeply, add to lists
            transforms = Selection.GetTransforms(SelectionMode.Deep);
            StartCoroutine(Export(path, transforms, presetAsset, buildZip, exportPBRMaterials, exportAnimation, doConvertImages));
            return;
        }

        // collect all objects in the selection, add to lists
        transforms = Selection.GetTransforms(SelectionMode.TopLevel);
        foreach (Transform tr in transforms)
        {
            StartCoroutine(Export(Path.Combine(dirPath, tr.name + ".gltf"), tr.GetComponentsInChildren<Transform>(), presetAsset, buildZip, exportPBRMaterials, exportAnimation, doConvertImages));
        }
    }

    public int getNbSelectedObjects()
    {
        return nbSelectedObjects;
    }

    public IEnumerator Export(string path, Transform[] transforms, Preset presetAsset, bool buildZip, bool exportPBRMaterials, bool exportAnimation = true, bool doConvertImages = false)
    {
        writer = new GlTF_Writer();
        writer.Init();
        done = false;
        bool debugRightHandedScale = false;
        GlTF_Writer.exportedFiles.Clear();
        if (debugRightHandedScale)
            GlTF_Writer.convertRightHanded = false;

        writer.extraString.Add("exporterVersion", SeinUtils.version.ToString());

       
        //path = toGlTFname(path);
        savedPath = Path.GetDirectoryName(path);

        // Temp list to keep track of skeletons
        Dictionary<string, GlTF_Skin> parsedSkins = new Dictionary<string, GlTF_Skin>();
        parsedSkins.Clear();

        List<Transform> trs = new List<Transform>(transforms);
        // Prefilter selected nodes and look for skinning in order to list "bones" nodes
        //FIXME: improve this
        List<Transform> bones = new List<Transform>();
        foreach (Transform tr in trs)
        {
            if (!tr.gameObject.activeSelf)
                continue;

            SkinnedMeshRenderer skin = tr.GetComponent<SkinnedMeshRenderer>();
            if (skin)
            {
                foreach (Transform bone in skin.bones)
                {
                    bones.Add(bone);
                }
            }
        }

        if (Exporter.opt_exportEnvLight)
        {
            if (RenderSettings.ambientMode == UnityEngine.Rendering.AmbientMode.Flat)
            {
                GlTF_Node node = new GlTF_Node();
                node.id = "sein-ambient-light";
                node.uuid = node.GetHashCode();
                node.name = "sein-ambient-light";
                var l = new GlTF_AmbientLight();
                l.color = new GlTF_ColorRGB(RenderSettings.ambientLight);
                l.intensity = RenderSettings.ambientIntensity;
                node.seinAmibentLight = l;

                GlTF_Writer.rootNodes.Add(node);
                GlTF_Writer.nodes.Add(node);
                GlTF_Writer.nodeIDs.Add(node.uuid);
                GlTF_Writer.nodeNames.Add(node.uuid, node.name);
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
            node.uuid = GlTF_Node.GetIDFromObject(tr);
            node.name = GlTF_Writer.cleanNonAlphanumeric(tr.name);
            GlTF_Writer.nodeTransforms.Add(tr, node);

            if (tr.GetComponent<Camera>() != null)
            {
                GlTF_Camera cam = parseUnityCamera(tr);
                node.cameraIndex = GlTF_Writer.cameras.IndexOf(cam);
            }

            if (tr.GetComponent<Light>() != null)
            {
                GlTF_Light l = parseUnityLight(tr);
                if (l != null)
                {
                    node.lightName = GlTF_Writer.cleanNonAlphanumeric(tr.name);
                    node.lightIndex = GlTF_Writer.lights.IndexOf(l);
                }
            }

            if (tr.GetComponent<SeinNode>() != null)
            {
                node.seinNode = new GlTF_SeinNode();
                node.seinNode.node = tr.GetComponent<SeinNode>();
            }

            if (tr.GetComponent<SeinRigidBody>() != null)
            {
                if (node.physicBody == null) {
                    node.physicBody = new GlTF_SeinPhysicBody();
                }

                node.physicBody.rigidbody = tr.GetComponent<SeinRigidBody>();
            }

            if (tr.GetComponent<SeinAnimator>() != null)
            {
                if (node.animator == null)
                {
                    node.animator = new GlTF_SeinAnimator();
                }

                node.animator.animator = tr.GetComponent<SeinAnimator>();
            }

            if (tr.GetComponents<Collider>().Length != 0)
            {
                if (node.physicBody == null)
                {
                    node.physicBody = new GlTF_SeinPhysicBody();
                    node.physicBody.rigidbody = SeinRigidBody.CreateBodyForPickOnly();
                }

                node.physicBody.colliders = new List<Collider>(tr.GetComponents<Collider>());
            }

            if (tr.GetComponent<SeinAudioListener>() != null)
            {
                if (node.seinAudioListener == null)
                {
                    node.seinAudioListener = new GlTF_SeinAudioListener();
                }

                node.seinAudioListener.listener = tr.GetComponent<SeinAudioListener>();
            }

            if (tr.GetComponent<SeinAudioSource>() != null)
            {
                if (node.seinAudioSource == null)
                {
                    node.seinAudioSource = new GlTF_SeinAudioSource();
                }

                node.seinAudioSource.source = tr.GetComponent<SeinAudioSource>();
                foreach (var clip in node.seinAudioSource.source.clips)
                {
                    if (!GlTF_Writer.audioClips.Contains(clip.clip))
                    {
                        processAudioClip(clip.clip);
                        GlTF_Writer.audioClips.Add(clip.clip);
                    }
                }
            }

            Renderer mr = GetRenderer(tr);
            Mesh m = GetMesh(tr);
            if (m != null)
            {
                string materialsID = "";
                var sm = mr.sharedMaterials;
                foreach (var mat in sm)
                {
                    materialsID += GlTF_Material.GetNameFromObject(mat);
                }

                if (GlTF_Writer.exportMeshes.ContainsKey(m) && GlTF_Writer.exportMeshes[m].ContainsKey(materialsID))
                {
                    node.meshIndex = GlTF_Writer.meshes.IndexOf(GlTF_Writer.exportMeshes[m][materialsID]);
                    createLightMap(GetRenderer(tr), ref node);
                }
                else
                {
                    GlTF_Mesh mesh = new GlTF_Mesh();
                    mesh.name = GlTF_Writer.cleanNonAlphanumeric(m.name);
                    mesh.materialsID = materialsID;

                    GlTF_Accessor positionAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "position"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
                    positionAccessor.bufferView = GlTF_Writer.vec3BufferView;
                    GlTF_Writer.accessors.Add(positionAccessor);

                    GlTF_Accessor normalAccessor = null;
                    if (m.normals.Length > 0)
                    {
                        normalAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "normal"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
                        normalAccessor.bufferView = GlTF_Writer.vec3BufferView;
                        GlTF_Writer.accessors.Add(normalAccessor);
                    }

                    GlTF_Accessor colorAccessor = null;
                    if (m.colors.Length > 0)
                    {
                        colorAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "color"), GlTF_Accessor.Type.VEC4, GlTF_Accessor.ComponentType.FLOAT);
                        colorAccessor.bufferView = GlTF_Writer.vec4BufferView;
                        GlTF_Writer.accessors.Add(colorAccessor);
                    }

                    GlTF_Accessor uv0Accessor = null;
                    if (m.uv.Length > 0)
                    {
                        uv0Accessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv0"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
                        uv0Accessor.bufferView = GlTF_Writer.vec2BufferView;
                        GlTF_Writer.accessors.Add(uv0Accessor);
                    }

                    GlTF_Accessor uv1Accessor = null;
                    if (m.uv2.Length > 0)
                    {
                        // check if object is affected by a lightmap
                        uv1Accessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv1"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
                        uv1Accessor.bufferView = GlTF_Writer.vec2BufferView;
                        GlTF_Writer.accessors.Add(uv1Accessor);
                    }

                    GlTF_Accessor uv2Accessor = null;
                    if (m.uv3.Length > 0)
                    {
                        uv2Accessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv2"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
                        uv2Accessor.bufferView = GlTF_Writer.vec2BufferView;
                        GlTF_Writer.accessors.Add(uv2Accessor);
                    }

                    GlTF_Accessor uv3Accessor = null;
                    if (m.uv4.Length > 0)
                    {
                        uv3Accessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "uv3"), GlTF_Accessor.Type.VEC2, GlTF_Accessor.ComponentType.FLOAT);
                        uv3Accessor.bufferView = GlTF_Writer.vec2BufferView;
                        GlTF_Writer.accessors.Add(uv3Accessor);
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

                    GlTF_Mesh m2 = null;
                    if (GlTF_Writer.exportMeshes.ContainsKey(m))
                    {
                        foreach (GlTF_Mesh item in GlTF_Writer.exportMeshes[m].Values)
                        {
                            m2 = item;
                            break;
                        }
                    }

                    var morphTargets = new List<GlTF_Attributes>();
                    if (m2 == null && m.blendShapeCount > 0)
                    {
                        for (int i = 0; i < m.blendShapeCount; i += 1)
                        {
                            var tname = m.GetBlendShapeName(i);
                            mesh.morphWeights.Add(0);
                            mesh.morphTargetNames.Add(tname);
                            var attrs = new GlTF_Attributes();
                            var avs = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "target_position"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
                            avs.bufferView = GlTF_Writer.vec3BufferView;
                            GlTF_Writer.accessors.Add(avs);
                            attrs.positionAccessor = avs;
                            if (m.normals.Length > 0)
                            {
                                var ans = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "target_normals"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
                                ans.bufferView = GlTF_Writer.vec3BufferView;
                                GlTF_Writer.accessors.Add(ans);
                                attrs.normalAccessor = ans;
                            }
                            //if (m.tangents.Length > 0)
                            //{
                            //    var ats = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "target_tangents"), GlTF_Accessor.Type.VEC3, GlTF_Accessor.ComponentType.FLOAT);
                            //    ats.bufferView = GlTF_Writer.vec3BufferView;
                            //    GlTF_Writer.accessors.Add(ats);
                            //    attrs.tangentAccessor = ats;
                            //}

                            morphTargets.Add(attrs);
                        }
                    }

                    var smCount = m.subMeshCount;
                    var customMaterials = tr.GetComponents<SeinCustomMaterial>();
                    for (var i = 0; i < smCount; ++i)
                    {
                        GlTF_Primitive primitive = new GlTF_Primitive();
                        primitive.name = GlTF_Primitive.GetNameFromObject(m, i);
                        primitive.index = i;
                        GlTF_Attributes attributes = new GlTF_Attributes();

                        if (m2 != null)
                        {
                            attributes = primitive.attributes = m2.primitives[i].attributes;
                            primitive.indices = m2.primitives[i].indices;
                            primitive.morphTargets = m2.primitives[i].morphTargets;
                        }
                        else
                        {
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
                            primitive.morphTargets = morphTargets;
                            GlTF_Accessor indexAccessor = new GlTF_Accessor(GlTF_Accessor.GetNameFromObject(m, "indices_" + i), GlTF_Accessor.Type.SCALAR, GlTF_Accessor.ComponentType.USHORT);
                            indexAccessor.bufferView = GlTF_Writer.ushortBufferView;
                            GlTF_Writer.accessors.Add(indexAccessor);
                            primitive.indices = indexAccessor;
                        }

                        if (i < sm.Length)
                        {
                            var mat = sm[i];
                            var matName = GlTF_Material.GetNameFromObject(mat);

                            if (GlTF_Writer.materialNames.Contains(matName))
                            {
                                primitive.materialIndex = GlTF_Writer.materialNames.IndexOf(matName); // THIS INDIRECTION CAN BE REMOVED!
                            }
                            else
                            {
                                GlTF_Material material = new GlTF_Material();
                                material.name = GlTF_Writer.cleanNonAlphanumeric(mat.name);
                                primitive.materialIndex = GlTF_Writer.materials.Count;

                                if (customMaterials.Length == 1)
                                {
                                    material.seinCustomMaterial = customMaterials[0];
                                }
                                else
                                {
                                    SeinCustomMaterial cm = null;
                                    foreach (var tcm in customMaterials)
                                    {
                                        if (tcm.unityMaterialName == mat.name)
                                        {
                                            cm = tcm;
                                        }
                                    }

                                    if (cm == null && customMaterials.Length > i)
                                    {
                                        cm = customMaterials[i];
                                    }

                                    material.seinCustomMaterial = cm;
                                }

                                GlTF_Writer.materialNames.Add(matName);
                                GlTF_Writer.materials.Add(material);

                                if (material.seinCustomMaterial)
                                {
                                    createSeinCustomMaterial(mat, ref material);
                                }
                                else if (
                                    mat.shader.name.Contains("Standard")
                                    || mat.shader.name.Contains("Autodesk Interactive")
                                    || mat.shader.name == "Sein/Unlit"
                                )
                                {
                                    unityToPBRMaterial(mat, ref material);
                                }
                                else if (mat.shader.name == "Sein/PBR")
                                {
                                    createSeinPBRMaterial(mat, ref material);
                                }
                                else if (mat.shader.name.Contains("Sein/"))
                                {
                                    unityToSeinMaterial(mat, ref material);
                                    createSeinCustomMaterial(mat, ref material);
                                }
                                else
                                {
                                    createKHRWebGLMaterial(mat, attributes, ref material);
                                }

                                // Unity materials are single sided by default
                                GlTF_Material.BoolValue doubleSided = new GlTF_Material.BoolValue();
                                doubleSided.name = "doubleSided";
                                doubleSided.value = false;
                                material.values.Add(doubleSided);
                            }
                        }
                        mesh.primitives.Add(primitive);
                    }

                    createLightMap(GetRenderer(tr), ref node);
                    // If gameobject having SkinnedMeshRenderer component has been transformed,
                    // the mesh would need to be baked here.
                    mesh.Populate(m);
                    GlTF_Writer.meshes.Add(mesh);
                    if (!GlTF_Writer.exportMeshes.ContainsKey(m))
                    {
                        GlTF_Writer.exportMeshes.Add(m, new Dictionary<string, GlTF_Mesh>());
                    }
                    GlTF_Writer.exportMeshes[m].Add(materialsID, mesh);
                    node.meshIndex = GlTF_Writer.meshes.IndexOf(mesh);
                }
            }

            var lt = tr.GetComponent<Light>();
            // Parse transform
            if (tr.parent == null)
            {
                Matrix4x4 mat = Matrix4x4.identity;
                if (debugRightHandedScale)
                    mat.m22 = -1;
                mat = mat * Matrix4x4.TRS(tr.localPosition, tr.localRotation, tr.localScale);

                node.matrix = new GlTF_Matrix(mat, true, lt != null && lt.type != LightType.Directional);
            }
            // Use good transform if parent object is not in selection
            else if (!trs.Contains(tr.parent))
            {
                node.hasParent = false;
                Matrix4x4 mat = Matrix4x4.identity;
                if (debugRightHandedScale)
                    mat.m22 = -1;
                mat = mat * tr.localToWorldMatrix;
                node.matrix = new GlTF_Matrix(mat, true, lt != null && lt.type != LightType.Directional);
            }
            else
            {
                node.hasParent = true;
                if (tr.localPosition != Vector3.zero)
                    node.translation = new GlTF_Translation(tr.localPosition);
                if (tr.localScale != Vector3.one)
                    node.scale = new GlTF_Scale(tr.localScale);
                if (tr.localRotation != Quaternion.identity)
                    node.rotation = new GlTF_Rotation(tr.localRotation);
            }

            if (!node.hasParent) {
                GlTF_Writer.rootNodes.Add(node);
            }

            if (tr.GetComponent<Camera>() != null)
            {
                node.cameraName = GlTF_Writer.cleanNonAlphanumeric(tr.name);
            }

            Dictionary<string, int> names = new Dictionary<string, int>();
            int index = 0;
            SeinNode seinNode = tr.GetComponent<SeinNode>();
            bool needCheckConfilct = seinNode == null || (!seinNode.skipThisNode && seinNode.selfType != ESeinNodeType.Actor);
            foreach (Transform t in tr.transform)
            { 
                if (t.gameObject.activeInHierarchy)
                {
                    int cID = GlTF_Node.GetIDFromObject(t);
                    node.childrenIDs.Add(cID);

                    int i;
                    i = names.TryGetValue(t.name, out i) ? i : -1;
                    i += 1;

                    string nodeName = t.name;
                    if (i == 0)
                    {
                        names.Add(t.name, i);
                        if (needCheckConfilct && nodeName == tr.name)
                        {
                            nodeName += "_" + i;
                        }
                    }
                    else
                    {
                        names[t.name] = i;
                        nodeName += "_" + i;
                    }

                    GlTF_Writer.nodeNames[cID] = nodeName;
                    index += 1;
                }
            }

            GlTF_Writer.nodeIDs.Add(node.uuid);
            GlTF_Writer.nodes.Add(node);
        }

        foreach (var tr in trs)
        {
            if (!GlTF_Writer.nodeTransforms.ContainsKey(tr))
            {
                continue;
            }

            var node = GlTF_Writer.nodeTransforms[tr];
            // Parse node's skin data
            GlTF_Accessor invBindMatrixAccessor = null;
            SkinnedMeshRenderer skinMesh = tr.GetComponent<SkinnedMeshRenderer>();
            if (exportAnimation && skinMesh != null && skinMesh.enabled && checkSkinValidity(skinMesh, trs) && skinMesh.rootBone != null)
            {
                GlTF_Skin skin = new GlTF_Skin();

                skin.name = GlTF_Writer.cleanNonAlphanumeric(skinMesh.rootBone.name) + "_skeleton_" + GlTF_Writer.cleanNonAlphanumeric(node.name);
                skin.skeleton = GlTF_Writer.nodes.IndexOf(GlTF_Writer.nodeTransforms[skinMesh.rootBone]);

                // Create invBindMatrices accessor
                invBindMatrixAccessor = new GlTF_Accessor(skin.name + "invBindMatrices", GlTF_Accessor.Type.MAT4, GlTF_Accessor.ComponentType.FLOAT);
                invBindMatrixAccessor.bufferView = GlTF_Writer.mat4BufferView;
                GlTF_Writer.accessors.Add(invBindMatrixAccessor);

                // Generate skin data
                skin.Populate(tr, ref invBindMatrixAccessor, GlTF_Writer.accessors.Count - 1);
                GlTF_Writer.skins.Add(skin);
                node.skinIndex = GlTF_Writer.skins.IndexOf(skin);
            }

            // Parse animations
            if (exportAnimation)
            {
                Animator a = tr.GetComponent<Animator>();
                bool nameConfilct = false;
                if (a != null)
                {
                    AnimationClip[] clips = AnimationUtility.GetAnimationClips(tr.gameObject);
                    for (int i = 0; i < clips.Length; i++)
                    {
                        //FIXME It seems not good to generate one animation per animator.
                        GlTF_Animation anim = new GlTF_Animation(GlTF_Writer.cleanNonAlphanumeric(clips[i].name));
                        anim.Populate(clips[i], tr, GlTF_Writer.bakeAnimation);
                        if (GlTF_Writer.animationNames.Contains(anim.name))
                        {
                            anim.name = node.name + "@" + anim.name;
                            nameConfilct = true;
                        }
                        if (anim.channels.Count > 0)
                        {
                            GlTF_Writer.animations.Add(anim);
                            GlTF_Writer.animationNames.Add(anim.name);
                        }
                    }
                }

                Animation animation = tr.GetComponent<Animation>();
                if (animation != null)
                {
                    AnimationClip clip = animation.clip;
                    //FIXME It seems not good to generate one animation per animator.
                    GlTF_Animation anim = new GlTF_Animation(GlTF_Writer.cleanNonAlphanumeric(animation.name));
                    anim.Populate(clip, tr, GlTF_Writer.bakeAnimation);
                    if (GlTF_Writer.animationNames.Contains(anim.name))
                    {
                        anim.name = node.name + "@" + anim.name;
                        nameConfilct = true;
                    }
                    if (anim.channels.Count > 0)
                    {
                        GlTF_Writer.animations.Add(anim);
                        GlTF_Writer.animationNames.Add(anim.name);
                    }
                }

                if (nameConfilct && node.animator != null)
                {
                    node.animator.animator.prefix = node.name;
                }
            }
        }

        if (GlTF_Writer.nodes.Count == 0)
        {
            Debug.Log("No visible objects have been exported. Aboring export");
            yield return false;
        }

        writer.OpenFiles(path);
        writer.Write();
        writer.CloseFiles();

        if (nbDisabledObjects > 0)
            Debug.Log(nbDisabledObjects + " disabled object ignored during export");

        Debug.Log("Scene has been exported to " + path);
        if (buildZip)
        {
            ZipFile zip = new ZipFile();
            Debug.Log(GlTF_Writer.exportedFiles.Count + " files generated");
            string zipName = Path.GetFileNameWithoutExtension(path) + ".zip";
            foreach (string originFilePath in GlTF_Writer.exportedFiles.Keys)
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
        foreach (Transform t in skin.bones)
        {
            if (!selection.Contains(t))
            {
                unselected = unselected + "\n" + t.name;
            }
        }

        if (unselected.Length > 0)
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

    private bool isInheritedFrom(Type t, Type baseT)
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
        if (mr == null)
        {
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
                if (!mf)
                {
                    Debug.Log("The gameObject " + tr.name + " will be exported as Transform (object has no MeshFilter component attached)");
                    return null;
                }
                m = mf.sharedMesh;
            }
            else if (t == typeof(SkinnedMeshRenderer))
            {
                SkinnedMeshRenderer smr = mr as SkinnedMeshRenderer;
                m = smr.sharedMesh;
            }
        }
        return m;
    }

    private bool handleTransparency(ref Material mat, ref GlTF_Material material)
    {
        if (!mat.HasProperty("_Mode"))
        {
            return false;
        }

        GlTF_Material.StringValue alphaMode = new GlTF_Material.StringValue();
        GlTF_Material.FloatValue alphaCutoff = new GlTF_Material.FloatValue();

        switch ((int)mat.GetFloat("_Mode"))
        {
            // Opaque
            case 0:
                return false;
            // Cutout
            case 1:
                alphaMode.name = "alphaMode";
                alphaMode.value = "MASK";
                alphaCutoff.name = "alphaCutoff";
                alphaCutoff.value = mat.GetFloat("_Cutoff");
                material.values.Add(alphaMode);
                material.values.Add(alphaCutoff);
                break;
            // Transparent
            case 2:
            case 3:
                alphaMode.name = "alphaMode";
                alphaMode.value = "BLEND";
                material.values.Add(alphaMode);
                break;
        }

        return true;
    }

    private void addTexturePixels(ref Texture2D texture, ref Color[] colors, IMAGETYPE outputChannel, IMAGETYPE inputChannel = IMAGETYPE.R)
    {
        int height = texture.height;
        int width = texture.width;
        Color[] inputColors = new Color[texture.width * texture.height];
        if (!texture || !getPixelsFromTexture(ref texture, out inputColors))
            return;

        if (height * width != colors.Length)
        {
            Debug.Log("Issue with texture dimensions");
            return;
        }

        for (int i = 0; i < height; ++i)
        {
            for (int j = 0; j < width; ++j)
            {
                int index = i * width + j;
                int newIndex = (height - i - 1) * width + j;
                Color c = outputChannel == IMAGETYPE.RGB ? inputColors[newIndex] : colors[index];
                float inputValue;
                if (outputChannel == IMAGETYPE.R)
                {
                    inputValue = inputColors[newIndex].r;
                }
                else if (outputChannel == IMAGETYPE.G)
                {
                    inputValue = inputColors[newIndex].g;
                }
                else if (outputChannel == IMAGETYPE.B)
                {
                    inputValue = inputColors[newIndex].b;
                }
                else
                {
                    inputValue = inputColors[newIndex].a;
                }

                if (outputChannel == IMAGETYPE.R)
                {
                    c.r = inputValue;
                }
                else if (outputChannel == IMAGETYPE.G)
                {
                    c.g = inputValue;
                }
                else if (outputChannel == IMAGETYPE.B)
                {
                    c.b = inputValue;
                }
                else if (outputChannel == IMAGETYPE.G_INVERT)
                {
                    c.g = 1.0f - inputValue;
                }

                colors[index] = c;
            }
        }

    }

    private int createOcclusionMetallicRoughnessTexture(
        ref Texture2D metallic,
        ref Texture2D roughness,
        ref Texture2D occlusion,
        IMAGETYPE metallicChannel = IMAGETYPE.R,
        IMAGETYPE roughnessChannel = IMAGETYPE.R,
        IMAGETYPE occlusionChannel = IMAGETYPE.R,
        IMAGETYPE roughnessDist = IMAGETYPE.G_INVERT
    )
    {
        string texName = GlTF_Texture.GetNameFromObject(metallic) + "_orm";
        var textureM = metallic;
        var textureR = roughness;
        var textureAO = occlusion;

        if (!GlTF_Writer.textureNames.Contains(texName))
        {
            int width = textureM.width;
            int height = textureM.height;
            string assetPath = AssetDatabase.GetAssetPath(textureM);

            if (textureR != null)
            {
                width = textureR.width > width ? textureR.width : width;
                height = textureR.height > height ? textureR.height : height;
            }

            if (textureAO != null)
            {
                width = textureAO.width > width ? textureAO.width : width;
                height = textureAO.height > height ? textureAO.height : height;
            }

            if (textureM.width != width || textureM.height != height)
            {
                cloneAndResize(ref metallic, out textureM, width, height);
            }

            if (textureR != null && (textureR.width != width || textureR.height != height))
            {
                cloneAndResize(ref roughness, out textureR, width, height);
            }

            if (textureAO != null && (textureAO.width != width || textureAO.height != height))
            {
                cloneAndResize(ref occlusion, out textureAO, width, height);
            }

            // Create texture
            GlTF_Texture texture = new GlTF_Texture();
            texture.name = texName;

            // Export image
            GlTF_Image img = new GlTF_Image();
            img.name = texName;

            // Let's consider that the three textures have the same resolution
            Color[] outputColors = new Color[width * height];
            for (int i = 0; i < outputColors.Length; ++i)
            {
                outputColors[i] = new Color(0.0f, 0.0f, 0.0f);
            }

            addTexturePixels(ref textureM, ref outputColors, IMAGETYPE.B, metallicChannel);

            if (textureR != null)
            {
                addTexturePixels(ref textureR, ref outputColors, roughnessDist, roughnessChannel);
            }

            if (textureAO != null)
            {
                addTexturePixels(ref textureAO, ref outputColors, IMAGETYPE.R, occlusionChannel);
            }

            Texture2D newtex = new Texture2D(width, height);
            newtex.name = texName;
            newtex.SetPixels(outputColors);
            newtex.Apply();
            if (newtex.width > Exporter.opt_maxSize || newtex.height > Exporter.opt_maxSize)
            {
                TextureScale.Bilinear(newtex, Exporter.opt_maxSize, Exporter.opt_maxSize);
            }

            string pathInArchive = GlTF_Writer.cleanPath(Path.GetDirectoryName(assetPath).Replace("Assets/Resources/", "").Replace("Assets/", ""));
            string exportDir = Path.Combine(savedPath, pathInArchive);

            if (!Directory.Exists(exportDir))
                Directory.CreateDirectory(exportDir);

            string outputFilename = Path.GetFileNameWithoutExtension(assetPath) + "_orm" + (Exporter.opt_forcePNG ? ".png" : ".jpg");
            outputFilename = GlTF_Writer.cleanPath(outputFilename);
            string exportPath = exportDir + "/" + outputFilename;  // relative path inside the .zip
            if (Exporter.opt_forcePNG)
            {
                File.WriteAllBytes(exportPath, newtex.EncodeToPNG());
            }
            else
            {
                File.WriteAllBytes(exportPath, newtex.EncodeToJPG(Exporter.opt_jpgQuality));
            }

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
            var samplerName = GlTF_Sampler.GetNameFromObject(newtex);
            if (!GlTF_Writer.samplerNames.Contains(samplerName))
            {
                sampler = new GlTF_Sampler(newtex)
                {
                    name = samplerName
                };
                GlTF_Writer.samplers.Add(sampler);
                GlTF_Writer.samplerNames.Add(samplerName);
            }

            GlTF_Writer.textures.Add(texture);
            GlTF_Writer.textureNames.Add(texName);
        }

        return GlTF_Writer.textureNames.IndexOf(texName);

    }

    private void cloneAndResize(ref Texture2D tex, out Texture2D newtex, int width, int height)
    {
        TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(tex)) as TextureImporter;

        if (!im)
        {
            newtex = null;
            return;
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

        newtex = new Texture2D(tex.width, tex.height);
        newtex.name = tex.name;
        newtex.SetPixels(tex.GetPixels());
        newtex.Apply();
        TextureScale.Bilinear(newtex, width, height);

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
    }

    private void processAudioClip(SeinAudioClip audioClip)
    {
        var clip = audioClip.clip;

        string assetPath = AssetDatabase.GetAssetPath(clip);
        string pathInArchive = GlTF_Writer.cleanPath(Path.GetDirectoryName(assetPath).Replace("Assets/Resources/", "").Replace("Assets/", ""));
        string exportDir = Path.Combine(savedPath, pathInArchive);

        if (!Directory.Exists(exportDir))
            Directory.CreateDirectory(exportDir);

        string outputFilename = Path.GetFileName(assetPath);
        outputFilename = GlTF_Writer.cleanPath(outputFilename);
        string exportPath = exportDir + "/" + outputFilename;  // relative path inside the .zip
        FileUtil.CopyFileOrDirectory(assetPath, exportPath);

        GlTF_Writer.audioClipURIs.Add(audioClip, pathInArchive + "/" + outputFilename);
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

    private void createKHRWebGLMaterial(Material mat, GlTF_Attributes attributes, ref GlTF_Material material)
    {
        //technique
        material.useKHRTechnique = true;
        var s = mat.shader;
        var techName = GlTF_Technique.GetNameFromObject(s);
        if (GlTF_Writer.techniqueNames.Contains(techName))
        {
            material.instanceTechniqueIndex = GlTF_Writer.techniqueNames.IndexOf(techName);// THIS INDIRECTION CAN BE REMOVED!
        }
        else
        {
            GlTF_Technique tech = new GlTF_Technique();
            tech.name = techName;
            GlTF_Technique.Attribute tAttr = new GlTF_Technique.Attribute();
            tAttr.name = "a_position";
            tAttr.type = GlTF_Technique.Type.FLOAT_VEC3;
            tAttr.semantic = GlTF_Technique.Semantic.POSITION;
            tech.attributes.Add(tAttr);

            if (attributes.normalAccessor != null)
            {
                tAttr = new GlTF_Technique.Attribute();
                tAttr.name = "a_normal";
                tAttr.type = GlTF_Technique.Type.FLOAT_VEC3;
                tAttr.semantic = GlTF_Technique.Semantic.NORMAL;
                tech.attributes.Add(tAttr);
            }

            if (attributes.texCoord0Accessor != null)
            {
                tAttr = new GlTF_Technique.Attribute();
                tAttr.name = "a_texcoord0";
                tAttr.type = GlTF_Technique.Type.FLOAT_VEC2;
                tAttr.semantic = GlTF_Technique.Semantic.TEXCOORD_0;
                tech.attributes.Add(tAttr);
            }

            if (attributes.texCoord1Accessor != null)
            {
                tAttr = new GlTF_Technique.Attribute();
                tAttr.name = "a_texcoord1";
                tAttr.type = GlTF_Technique.Type.FLOAT_VEC2;
                tAttr.semantic = GlTF_Technique.Semantic.TEXCOORD_1;
                tech.attributes.Add(tAttr);
            }

            if (attributes.texCoord2Accessor != null)
            {
                tAttr = new GlTF_Technique.Attribute();
                tAttr.name = "a_texcoord2";
                tAttr.type = GlTF_Technique.Type.FLOAT_VEC2;
                tAttr.semantic = GlTF_Technique.Semantic.TEXCOORD_2;
                tech.attributes.Add(tAttr);
            }

            if (attributes.texCoord3Accessor != null)
            {
                tAttr = new GlTF_Technique.Attribute();
                tAttr.name = "a_texcoord3";
                tAttr.type = GlTF_Technique.Type.FLOAT_VEC2;
                tAttr.semantic = GlTF_Technique.Semantic.TEXCOORD_3;
                tech.attributes.Add(tAttr);
            }

            tech.AddDefaultUniforms();

            // Populate technique with shader data
            GlTF_Writer.techniqueNames.Add(techName);
            GlTF_Writer.techniques.Add(tech);

            int vsIndex = -1;
            int fsIndex = -1;
            string shaderPath = AssetDatabase.GetAssetPath(s);

            if (GlTF_Writer.shaderPathes.Contains(shaderPath))
            {
                vsIndex = GlTF_Writer.shaderPathes.IndexOf(shaderPath);
                fsIndex = vsIndex + 1;
            }
            else
            {
                string shaderSavePath = shaderPath.Replace("Assets/Resources/", "").Replace("Assets/", "").Replace(".shader", "");
                string exportDir = Path.Combine(savedPath, shaderSavePath);

                if (!Directory.Exists(exportDir))
                    Directory.CreateDirectory(exportDir);

                string shaderContent = File.ReadAllText(shaderPath);
                Match m = Regex.Match(shaderContent, @"[\s\S]+#ifdef VERTEX([\s\S]+)#endif[\s\S]+#ifdef FRAGMENT([\s\S]+)#endif[\s\S]+");
                File.WriteAllText(exportDir + "/vertex.glsl", GlTF_Shader.convertShader(m.Groups[1].Value, tech.generateShaderHeader(true)));
                File.WriteAllText(exportDir + "/fragment.glsl", GlTF_Shader.convertShader(m.Groups[2].Value, tech.generateShaderHeader(false)));
                var vs = new GlTF_Shader();
                vs.type = GlTF_Shader.Type.Vertex;
                vs.uri = shaderSavePath + "/vertex.glsl";
                GlTF_Writer.shaders.Add(vs);
                var fs = new GlTF_Shader();
                fs.type = GlTF_Shader.Type.Fragment;
                fs.uri = shaderSavePath + "/fragment.glsl";
                GlTF_Writer.shaders.Add(fs);
                GlTF_Writer.shaderPathes.Add(shaderPath);

                vsIndex = GlTF_Writer.shaders.Count - 2;
                fsIndex = GlTF_Writer.shaders.Count - 1;
            }

            // create program
            GlTF_Program program = new GlTF_Program();
            program.name = GlTF_Program.GetNameFromObject(s);
            program.vertexShader = vsIndex;
            program.fragmentShader = fsIndex;
            GlTF_Writer.programs.Add(program);
            tech.program = GlTF_Writer.programs.Count - 1;

            bool hasTransparency = handleTransparency(ref mat, ref material);
            var count = ShaderUtil.GetPropertyCount(s);
            for (var i = 0; i < count; i++)
            {
                var pName = ShaderUtil.GetPropertyName(s, i);
                var type = ShaderUtil.GetPropertyType(s, i);
                var uni = new GlTF_Technique.Uniform();
                uni.name = pName;
                switch (type) {
                    case ShaderUtil.ShaderPropertyType.Color:
                        var colorValue = new GlTF_Material.ColorValue();
                        colorValue.name = pName;
                        Color c = mat.GetColor(pName);
                        clampColor(ref c);
                        colorValue.color = c;
                        material.khrValues.Add(colorValue);
                        uni.type = GlTF_Technique.Type.FLOAT_VEC4;
                        tech.uniforms.Add(uni);
                        break;
                    case ShaderUtil.ShaderPropertyType.Float:
                        var floatValue = new GlTF_Material.FloatValue();
                        floatValue.name = pName;
                        float f = mat.GetFloat(pName);
                        floatValue.value = f;
                        material.khrValues.Add(floatValue);
                        uni.type = GlTF_Technique.Type.FLOAT;
                        tech.uniforms.Add(uni);
                        break;
                    case ShaderUtil.ShaderPropertyType.Vector:
                        var vecValue = new GlTF_Material.VectorValue();
                        vecValue.name = pName;
                        var vec = mat.GetVector(pName);
                        vecValue.vector = vec;
                        material.khrValues.Add(vecValue);
                        uni.type = GlTF_Technique.Type.FLOAT_VEC4;
                        tech.uniforms.Add(uni);
                        break;
                    case ShaderUtil.ShaderPropertyType.TexEnv:
                        if (mat.GetTexture(pName) != null)
                        {
                            var textureValue = new GlTF_Material.DictValue();
                            textureValue.name = pName;

                            int index = processTexture((Texture2D)mat.GetTexture(pName), hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
                            textureValue.intValue.Add("index", index);
                            textureValue.intValue.Add("texCoord", 0);
                            material.khrValues.Add(textureValue);
                            uni.type = GlTF_Technique.Type.SAMPLER_2D;
                            tech.uniforms.Add(uni);
                        }
                        break;
                }
            }
        }
    }

    private void createSeinCustomMaterial(Material mat, ref GlTF_Material material)
    {
        bool hasTransparency = handleTransparency(ref mat, ref material);

        if (material.seinCustomMaterial.uniformsTexture.Length != 0)
        {
            foreach (var uniform in material.seinCustomMaterial.uniformsTexture)
            {
                int diffuseTextureIndex = processTexture(uniform.value, hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
                uniform.index = diffuseTextureIndex;
                uniform.texCoord = 0;
            }
        }

        if (material.seinCustomMaterial.uniformsCubeTexture.Length != 0)
        {
            foreach (var uniform in material.seinCustomMaterial.uniformsCubeTexture)
            {
                // todo: support cubemap
                //int diffuseTextureIndex = processTexture(uniform.value, hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
                //uniform.index = diffuseTextureIndex;
                //uniform.texCoord = 0;
            }
        }
    }

    private void unityToSeinMaterial(Material mat, ref GlTF_Material material)
    {
        if (Exporter.tempGoForSein == null)
        {
            Exporter.tempGoForSein = new GameObject();
        }

        var customMaterial = Exporter.tempGoForSein.AddComponent<SeinCustomMaterial>();
        var className = mat.shader.name.Replace("Sein/", "");
        if (!className.Contains("Material")) {
            className += "Material";
        }
        customMaterial.className = className;
        customMaterial.renderOrder = mat.renderQueue;
        var floatArray = new List<SeinMaterialUniformFloat>();
        var vector4Array = new List<SeinMaterialUniformFloatVec4>();
        var textureArray = new List<SeinMaterialUniformTexture>();

        for (int i = 0; i < ShaderUtil.GetPropertyCount(mat.shader); i += 1)
        {
            var propType = ShaderUtil.GetPropertyType(mat.shader, i);
            var propName = ShaderUtil.GetPropertyName(mat.shader, i);

            if (propName == "cloneForInst")
            {
                customMaterial.cloneForInst = mat.GetInt("cloneForInst") != 0;
                continue;
            }

            if (ShaderUtil.IsShaderPropertyHidden(mat.shader, i))
            {
                continue;
            }

            var n = propName;
            if (propName.Substring(0, 1) == "_")
            {
                propName = propName.Substring(1);
            }

            switch (propType)
            {
                case ShaderUtil.ShaderPropertyType.Float:
                case ShaderUtil.ShaderPropertyType.Range:
                    floatArray.Add(new SeinMaterialUniformFloat { name = propName, value = mat.GetFloat(n) });
                    break;
                case ShaderUtil.ShaderPropertyType.Color:
                    vector4Array.Add(new SeinMaterialUniformFloatVec4 { name = propName, value = mat.GetColor(n) });
                    break;
                case ShaderUtil.ShaderPropertyType.Vector:
                    vector4Array.Add(new SeinMaterialUniformFloatVec4 { name = propName, value = mat.GetVector(n) });
                    break;
                case ShaderUtil.ShaderPropertyType.TexEnv:
                    if (mat.GetTexture(n) != null)
                    {
                        textureArray.Add(new SeinMaterialUniformTexture { name = propName, value = (Texture2D)mat.GetTexture(n) });
                    }
                    break;
            }

            customMaterial.uniformsFloat = floatArray.ToArray();
            customMaterial.uniformsFloatVec4 = vector4Array.ToArray();
            customMaterial.uniformsTexture = textureArray.ToArray();
        }

        material.seinCustomMaterial = customMaterial;
    }

    // convert Sein/PBR to Gltf
    private void createSeinPBRMaterial(Material mat, ref GlTF_Material material)
    {
        bool isMetal = mat.GetInt("workflow") == 0;
        GlTF_Writer.hasSpecularMaterials = GlTF_Writer.hasSpecularMaterials || !isMetal;
        material.isMetal = isMetal;
        material.isUnlit = mat.GetInt("unlit") == 1;
        GlTF_Writer.hasUnlitMaterial = GlTF_Writer.hasUnlitMaterial || material.isUnlit;
        bool hasTransparency = handleTransparency(ref mat, ref material);

        if (mat.GetTexture("_baseColorMap") != null)
        {
            var value = new GlTF_Material.DictValue();
            value.name = isMetal ? "baseColorTexture" : "diffuseTexture";

            int diffuseTextureIndex = processTexture((Texture2D)mat.GetTexture("_baseColorMap"), hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
            value.intValue.Add("index", diffuseTextureIndex);
            value.intValue.Add("texCoord", 0);
            material.pbrValues.Add(value);
        }

        if (mat.GetColor("_baseColor") != null)
        {
            var value = new GlTF_Material.ColorValue();
            value.name = isMetal ? "baseColorFactor" : "diffuseFactor";
            Color c = mat.GetColor("_baseColor");
            clampColor(ref c);
            value.color = c;
            material.pbrValues.Add(value);
        }

        if (material.isUnlit)
        {
            return;
        }

        bool hasPBRMap = (!isMetal && mat.GetTexture("_specularGlossinessMap") != null) || (isMetal && mat.GetTexture("_metallicMap") != null);

        if (isMetal)
        {
            if (hasPBRMap)
            {
                var textureValue = new GlTF_Material.DictValue();
                textureValue.name = "metallicRoughnessTexture";
                Texture2D metallicTexture = (Texture2D)mat.GetTexture("_metallicMap");
                Texture2D roughnessTexture = (Texture2D)mat.GetTexture("_roughnessMap");
                Texture2D occlusion = (Texture2D)mat.GetTexture("_OcclusionMap");

                int metalRoughTextureAoIndex = createOcclusionMetallicRoughnessTexture(
                    ref metallicTexture, ref roughnessTexture, ref occlusion,
                    IMAGETYPE.B, IMAGETYPE.G, IMAGETYPE.R, IMAGETYPE.G
                );

                textureValue.intValue.Add("index", metalRoughTextureAoIndex);
                textureValue.intValue.Add("texCoord", 0);
                material.pbrValues.Add(textureValue);

                if (occlusion != null)
                {
                    var aoValue = new GlTF_Material.DictValue();
                    aoValue.name = "occlusionTexture";

                    aoValue.intValue.Add("index", metalRoughTextureAoIndex);
                    aoValue.intValue.Add("texCoord", 0);
                    aoValue.floatValue.Add("strength", mat.GetFloat("_occlusionStrength"));
                    material.values.Add(aoValue);
                }
            }

            var metallicFactor = new GlTF_Material.FloatValue();
            metallicFactor.name = "metallicFactor";
            metallicFactor.value = hasPBRMap ? 1.0f : mat.GetFloat("_metallic");
            material.pbrValues.Add(metallicFactor);

            //Roughness factor
            // gloss scale is not supported for now(property _GlossMapScale)
            var roughnessFactor = new GlTF_Material.FloatValue();
            roughnessFactor.name = "roughnessFactor";
            roughnessFactor.value = mat.GetFloat("_roughness");
            material.pbrValues.Add(roughnessFactor);
        } else
        {
            if (hasPBRMap) // No metallic factor if texture
            {
                var textureValue = new GlTF_Material.DictValue();
                textureValue.name = "specularGlossinessTexture";
                int specGlossTextureIndex = processTexture((Texture2D)mat.GetTexture("_specularGlossinessMap"), IMAGETYPE.RGBA);
                textureValue.intValue.Add("index", specGlossTextureIndex);
                textureValue.intValue.Add("texCoord", 0);
                material.pbrValues.Add(textureValue);
            }

            var specularFactor = new GlTF_Material.ColorValue();
            specularFactor.name = "specularFactor";
            specularFactor.color = hasPBRMap ? Color.white : mat.GetColor("_specular"); // gloss scale is not supported for now(property _GlossMapScale)
            specularFactor.isRGB = true;
            material.pbrValues.Add(specularFactor);

            var glossinessFactor = new GlTF_Material.FloatValue();
            glossinessFactor.name = "glossinessFactor";
            glossinessFactor.value = hasPBRMap ? 1.0f : mat.GetFloat("_glossiness"); // gloss scale is not supported for now(property _GlossMapScale)
            material.pbrValues.Add(glossinessFactor);
        }

        if (mat.GetTexture("_normalMap") != null)
        {
            var textureValue = new GlTF_Material.DictValue();
            textureValue.name = "normalTexture";

            int bumpTextureIndex = processTexture((Texture2D)mat.GetTexture("_normalMap"), IMAGETYPE.NORMAL_MAP);
            textureValue.intValue.Add("index", bumpTextureIndex);
            textureValue.intValue.Add("texCoord", 0);
            material.values.Add(textureValue);
        }

        if (mat.GetTexture("_emissionMap") != null)
        {
            Texture2D emissiveTexture = mat.GetTexture("_emissionMap") as Texture2D;
            var textureValue = new GlTF_Material.DictValue();
            textureValue.name = "emissiveTexture";

            int emissiveTextureIndex = processTexture(emissiveTexture, IMAGETYPE.RGB);
            textureValue.intValue.Add("index", emissiveTextureIndex);
            textureValue.intValue.Add("texCoord", 0);
            material.values.Add(textureValue);
        }

        var emissive = mat.GetColor("_emission");
        if (!emissive.Equals(new Color(0, 0, 0)))
        {
            var emissiveFactor = new GlTF_Material.ColorValue();
            emissiveFactor.name = "emissiveFactor";
            emissiveFactor.isRGB = true;
            emissiveFactor.color = mat.GetColor("_emission");
            material.values.Add(emissiveFactor);
        }

        //Occlusion (kept as separated channel for specular workflow, but merged in R channel for metallic workflow)
        if ((!isMetal || (isMetal && !hasPBRMap)) && mat.HasProperty("_occlusionMap") && mat.GetTexture("_occlusionMap") != null)
        {
            Texture2D occlusionTexture = mat.GetTexture("_occlusionMap") as Texture2D;
            var textureValue = new GlTF_Material.DictValue();
            textureValue.name = "occlusionTexture";

            int occlusionTextureIndex = processTexture(occlusionTexture, IMAGETYPE.RGB);
            textureValue.intValue.Add("index", occlusionTextureIndex);
            textureValue.intValue.Add("texCoord", 0);
            textureValue.floatValue.Add("strength", mat.GetFloat("_occlusionStrength"));
            material.values.Add(textureValue);
        }
    }

    // Convert material from Unity to glTF PBR
    private void unityToPBRMaterial(Material mat, ref GlTF_Material material)
    {
        bool isMaterialPBR = true;
        bool isMetal = true;
        bool hasPBRMap = false;
        // Is metal workflow used
        isMetal = mat.shader.name == "Standard" || mat.shader.name == "Autodesk Interactive" || mat.shader.name == "Sein/Unlit";
        GlTF_Writer.hasSpecularMaterials = GlTF_Writer.hasSpecularMaterials || !isMetal;
        material.isMetal = isMetal;
        material.isUnlit = mat.shader.name == "Sein/Unlit";
        GlTF_Writer.hasUnlitMaterial = GlTF_Writer.hasUnlitMaterial || material.isUnlit;

        // Is smoothness defined by diffuse texture or PBR texture' alpha?
        if (mat.HasProperty("_SmoothnessTextureChannel") && Math.Abs(mat.GetFloat("_SmoothnessTextureChannel")) > 0.01)
            Debug.Log("Smoothness uses diffuse's alpha channel. Unsupported for now");

        hasPBRMap = (!isMetal && mat.GetTexture("_SpecGlossMap") != null) || (isMetal && mat.GetTexture("_MetallicGlossMap") != null);

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
                    Texture2D metallicTexture = (Texture2D)mat.GetTexture("_MetallicGlossMap");
                    Texture2D occlusion = (Texture2D)mat.GetTexture("_OcclusionMap");

                    int metalRoughTextureAoIndex;
                    if (mat.shader.name == "Autodesk Interactive") {
                        Texture2D roughnessTexture = (Texture2D)mat.GetTexture("_SpecGlossMap");
                        metalRoughTextureAoIndex = createOcclusionMetallicRoughnessTexture(
                            ref metallicTexture, ref roughnessTexture, ref occlusion,
                            IMAGETYPE.R, IMAGETYPE.R, IMAGETYPE.R, IMAGETYPE.G
                        );
                    }
                    else
                    {
                        var channel = mat.GetInt("_SmoothnessTextureChannel");
                        if (channel == 0)
                        {
                            metalRoughTextureAoIndex = createOcclusionMetallicRoughnessTexture(
                                ref metallicTexture, ref metallicTexture, ref occlusion,
                                IMAGETYPE.R, IMAGETYPE.A
                            );
                        }
                        else
                        {
                            var baseColor = (Texture2D)mat.GetTexture("_MainTex");
                            metalRoughTextureAoIndex = createOcclusionMetallicRoughnessTexture(
                                ref metallicTexture, ref baseColor, ref occlusion,
                                IMAGETYPE.R, IMAGETYPE.A
                            );
                        }
                    }

                    textureValue.intValue.Add("index", metalRoughTextureAoIndex);
                    textureValue.intValue.Add("texCoord", 0);
                    material.pbrValues.Add(textureValue);

                    if (occlusion != null)
                    {
                        var aoValue = new GlTF_Material.DictValue();
                        aoValue.name = "occlusionTexture";

                        aoValue.intValue.Add("index", metalRoughTextureAoIndex);
                        aoValue.intValue.Add("texCoord", 0);
                        aoValue.floatValue.Add("strength", mat.GetFloat("_OcclusionStrength"));
                        material.values.Add(aoValue);
                    }
                }

                var metallicFactor = new GlTF_Material.FloatValue();
                metallicFactor.name = "metallicFactor";
                metallicFactor.value = hasPBRMap ? 1.0f : mat.GetFloat("_Metallic");
                material.pbrValues.Add(metallicFactor);

                //Roughness factor
                // gloss scale is not supported for now(property _GlossMapScale)
                var roughnessFactor = new GlTF_Material.FloatValue();
                roughnessFactor.name = "roughnessFactor";
                if (mat.shader.name == "Autodesk Interactive")
                {
                    roughnessFactor.value = 1.0f;
                }
                else
                {
                    roughnessFactor.value = mat.GetFloat("_GlossMapScale");
                }
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

            if (isBumpMap)
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
        if ((!isMetal || (isMetal && !hasPBRMap)) && mat.HasProperty("_OcclusionMap") && mat.GetTexture("_OcclusionMap") != null)
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
    }

    private void createLightMap(Renderer mr, ref GlTF_Node node)
    {
        var seinRenderer = new GlTF_SeinRenderer();
        int lightmapIndex = mr.lightmapIndex;

        if (Exporter.opt_exportLightMap && lightmapIndex > -1)
        {
            Vector4 lightmapScaleOffset = mr.lightmapScaleOffset;

            var lightData = LightmapSettings.lightmaps[lightmapIndex];
            var lightTexture = lightData.lightmapColor;
            var lightTextureIndex = processTexture(lightTexture, IMAGETYPE.HDR);
            seinRenderer.uvScale = new Vector2(lightmapScaleOffset.x, lightmapScaleOffset.y);
            seinRenderer.uvOffset = new Vector2(lightmapScaleOffset.z, lightmapScaleOffset.w);
            seinRenderer.lightMapIndex = lightTextureIndex;
        }

        seinRenderer.castShadows = mr.shadowCastingMode == UnityEngine.Rendering.ShadowCastingMode.On;
        seinRenderer.receiveShadows = mr.receiveShadows;
        seinRenderer.gammaCorrection = PlayerSettings.colorSpace == ColorSpace.Linear;

        node.seinRenderer = seinRenderer;
    }

    private bool getPixelsFromTexture(ref Texture2D texture, out Color[] pixels)
    {
        //Make texture readable
        TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
        if (!im)
        {
            if (texture)
            {
                pixels = texture.GetPixels();
                return true;
            }

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
        if (!getPixelsFromTexture(ref inputTexture, out textureColors))
        {
            Debug.Log("Failed to convert texture " + inputTexture.name + " (unsupported type or format)");
            return "";
        }

        //Texture2D newtex = new Texture2D(inputTexture.width, inputTexture.height, inputTexture.format, false);
        Texture2D newtex = null;

        if (format != IMAGETYPE.HDR)
        {
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

            newtex = new Texture2D(inputTexture.width, inputTexture.height);
            newtex.SetPixels(newTextureColors);
            newtex.Apply();
            if (newtex.width > Exporter.opt_maxSize || newtex.height > Exporter.opt_maxSize)
            {
                TextureScale.Bilinear(newtex, Exporter.opt_maxSize, Exporter.opt_maxSize);
            }
        }
        else
        {
            newtex = lmToRGBD(textureColors, inputTexture.width, inputTexture.height);
        }

        string pathInArchive = GlTF_Writer.cleanPath(Path.GetDirectoryName(pathInProject).Replace("Assets/Resources/", "").Replace("Assets/", ""));
        string exportDir = Path.Combine(exportDirectory, pathInArchive);

        if (!Directory.Exists(exportDir))
            Directory.CreateDirectory(exportDir);

        string outputFilename = Path.GetFileNameWithoutExtension(pathInProject) + (format == IMAGETYPE.RGBA || Exporter.opt_forcePNG ? ".png" : format == IMAGETYPE.HDR ? ".png" : ".jpg");
        outputFilename = GlTF_Writer.cleanPath(outputFilename);
        string exportPath = exportDir + "/" + outputFilename;  // relative path inside the .zip
        string pathInGltfFile = pathInArchive + "/" + outputFilename;

        byte[] content = { };
        if (format == IMAGETYPE.RGBA || Exporter.opt_forcePNG)
        {
            content = newtex.EncodeToPNG();
        }
        else if (format == IMAGETYPE.HDR)
        {
            // rgbd format
            content = newtex.EncodeToPNG();
        }
        else
        {
            content = newtex.EncodeToJPG(format == IMAGETYPE.NORMAL_MAP ? 95 : Exporter.opt_jpgQuality);
        }

        File.WriteAllBytes(exportPath, content);

        if (!GlTF_Writer.exportedFiles.ContainsKey(exportPath))
            GlTF_Writer.exportedFiles.Add(exportPath, pathInArchive);
        else
            Debug.LogError("Texture '" + inputTexture + "' already exists");

        return pathInGltfFile;
    }

    private Texture2D lmToRGBD(Color[] colors, int width, int height)
    {
        var tex = new Texture2D(width, height);
        Color[] newColors = new Color[width * height];
        var isGammaSpace = PlayerSettings.colorSpace == ColorSpace.Gamma;

        if (isGammaSpace)
        {
            // we need linear space lightmap in Sein
            // realColor = color.linear;
            Debug.LogWarning("You are using lightmap in `Gamma ColorSpace`, it may have wrong result in Sein ! Please checkout 'http://seinjs.com/guide/baking' for details !");
        }

        for (int i = 0; i < height; ++i)
        {
            for (int j = 0; j < width; ++j)
            {
                var origColor = colors[(height - i - 1) * width + j];
                Color color = new Color(0, 0, 0, 1);

                if (Math.Abs(origColor.a) > 0.001)
                {
                    origColor = decodeRGBM(origColor, isGammaSpace);

                    var d = 1f;
                    var m = Math.Max(origColor.r, Math.Max(origColor.g, origColor.b));

                    if (m > 1f)
                    {
                        d = 1f / m;
                    }

                    color = new Color(
                        origColor.r * d,
                        origColor.g * d,
                        origColor.b * d,
                        d
                    );
                }

                newColors[i * width + j] = color;
            }
        }

        tex.SetPixels(newColors);
        tex.Apply();
        return tex;
    }

    // http://dphgame.com/doku.php?id=shader%E5%9F%BA%E7%A1%80:unity%E5%86%85%E7%BD%AEshader:%E5%85%AC%E5%85%B1%E5%87%BD%E6%95%B0#decodelightmap
    private Color decodeRGBM(Color color, bool isGammaSpace)
    {
        Color realColor = color;
        float dFactor = realColor.a;

        return new Color(
            dFactor * realColor.r,
            dFactor * realColor.g,
            dFactor * realColor.b,
            1
        );
    }
}
#endif