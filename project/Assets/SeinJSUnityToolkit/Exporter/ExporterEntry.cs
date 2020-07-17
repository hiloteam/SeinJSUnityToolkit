/**
 * @File   : ExportorEntry.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using GLTF;
using System.Collections.Generic;
using System.IO;
using System;
using Newtonsoft.Json;
using System.Text;

namespace SeinJS
{
    public class ExporterEntry
    {
        public class Pair<Key, Value>
        {
            public Key key;
            public Value value;

            public Pair(Key key, Value value) {
                this.key = key;
                this.value = value;
            }
        }

        public class EntryBufferView
        {
            public BufferViewId id;
            public BufferView view = new BufferView();
            public byte[] byteBuffer;
            public MemoryStream streamBuffer;
        }

        public class GLTFAnimationInfo
        {
            public AccessorId timeId;
            public AccessorId propertyId;
            public AnimationUtility.TangentMode tangentMode;
        }

        public string path;
        public string name;
        public Transform[] transforms;
        public GLTFRoot root = new GLTFRoot();
        public Dictionary<Transform, List<Transform>> transformsInSameActor = new Dictionary<Transform, List<Transform>>();
        public List<Transform> bones = new List<Transform>();
        public Dictionary<Transform, Node> tr2node = new Dictionary<Transform, Node>();
        public Dictionary<Transform, NodeId> tr2nodeId = new Dictionary<Transform, NodeId>();
        public Dictionary<Node, Transform> node2tr = new Dictionary<Node, Transform>();

        private List<EntryBufferView> _bufferViews = new List<EntryBufferView>();
		// for each mesh
		private Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>> _mesh2attrs= new Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>>();
        private Dictionary<UnityEngine.Mesh, List<Dictionary<string, AccessorId>>> _mesh2targets = new Dictionary<UnityEngine.Mesh, List<Dictionary<string, AccessorId>>>();
        private Dictionary<UnityEngine.Mesh, Dictionary<int, AccessorId>> _mesh2indices = new Dictionary<UnityEngine.Mesh, Dictionary<int, AccessorId>>();
        private Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>> _mesh2Id = new Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>>();
        // key: SeinCustomMaterial componenet or UnityMateiral InistanceID
        private Dictionary<int, MaterialId> _material2ID = new Dictionary<int, MaterialId>();
        private Dictionary<Texture2D, TextureId> _texture2d2ID = new Dictionary<Texture2D, TextureId>();
        private Dictionary<UnityEngine.Texture, CubeTextureId> _cubemap2ID = new Dictionary<UnityEngine.Texture, CubeTextureId>();
        private Dictionary<Texture2D, ImageId> _texture2d2ImageID = new Dictionary<Texture2D, ImageId>();
        private Dictionary<SkinnedMeshRenderer, SkinId> _skin2ID = new Dictionary<SkinnedMeshRenderer, SkinId>();
        private Dictionary<AnimationClip, GLTF.Schema.Animation> _animClip2anim = new Dictionary<AnimationClip, GLTF.Schema.Animation>();
        private Dictionary<AnimationClip, List<Dictionary<GLTFAnimationChannelPath, GLTFAnimationInfo>>> _animClip2Accessors = new Dictionary<AnimationClip, List<Dictionary<GLTFAnimationChannelPath, GLTFAnimationInfo>>>();
        private Dictionary<UnityEngine.Camera, CameraId> _camera2ID = new Dictionary<UnityEngine.Camera, CameraId>();

        // key: instanceId
        public static Dictionary<string, Texture2D> composedTextures = new Dictionary<string, Texture2D>();

        public static void Init()
		{
            composedTextures.Clear();
        }

        public EntryBufferView CreateByteBufferView(string name, int size, int stride)
        {
            if (root.BufferViews == null)
            {
                root.BufferViews = new List<BufferView>();
            }

            var bufferView = new EntryBufferView();
            bufferView.byteBuffer = new byte[size];
            bufferView.view.Name = name;
            bufferView.view.ByteStride = stride;
            _bufferViews.Add(bufferView);
            root.BufferViews.Add(bufferView.view);
            bufferView.id = new BufferViewId { Id = root.BufferViews.Count - 1, Root = root };

            return bufferView;
        }

        public EntryBufferView CreateStreamBufferView(string name)
        {
            if (root.BufferViews == null)
            {
                root.BufferViews = new List<BufferView>();
            }

            var bufferView = new EntryBufferView();
            bufferView.streamBuffer = new MemoryStream();
            bufferView.view.Name = name;
            _bufferViews.Add(bufferView);
            root.BufferViews.Add(bufferView.view);
            bufferView.id = new BufferViewId { Id = root.BufferViews.Count - 1, Root = root };

            return bufferView;
        }

        public void AddExtension(string extension)
        {
            if (root.ExtensionsRequired == null)
            {
                root.ExtensionsRequired = new List<string>();
                root.ExtensionsUsed = new List<string>();
            }

            if (!root.ExtensionsUsed.Contains(extension))
            {
                root.ExtensionsUsed.Add(extension);
                root.ExtensionsRequired.Add(extension);
            }
        }

        public NodeId SaveNode(Transform tr)
        {
            if (root.Nodes == null)
            {
                root.Nodes = new List<Node>();
            }

            var isBone = bones.Contains(tr);

            var node = new Node
            {
                Name = tr.name,
                UseTRS = isBone
            };

            if (!isBone)
            {
                var matrix = new UnityEngine.Matrix4x4();
                matrix.SetTRS(tr.localPosition, tr.localRotation, tr.localScale);
                if (!matrix.Equals(Matrix4x4.identity))
                {
                    node.Matrix = Utils.ConvertMat4LeftToRightHandedness(matrix);
                }
            }
            else
            {
                node.Translation = Utils.ConvertVector3LeftToRightHandedness(tr.localPosition);
                node.Rotation = Utils.ConvertQuatLeftToRightHandedness(tr.localRotation);
                node.Scale = new GLTF.Math.Vector3(tr.localScale.x, tr.localScale.y, tr.localScale.z);
            }

            root.Nodes.Add(node);
            tr2node.Add(tr, node);
            node2tr.Add(node, tr);

            var id = new NodeId { Id = root.Nodes.Count - 1, Root = root };
            tr2nodeId.Add(tr, id);

            return id;
        }

        public Pair<MeshId, bool> SaveMesh(UnityEngine.Mesh mesh, Renderer renderer)
        {
            if (root.Meshes == null)
            {
                root.Meshes = new List<GLTF.Schema.Mesh>();
            }

            var m = new GLTF.Schema.Mesh();
            string cacheId = "";
            foreach (var mat in renderer.sharedMaterials)
            {
                cacheId += mat.GetInstanceID();
            }

            if (_mesh2Id.ContainsKey(mesh) && _mesh2Id[mesh].ContainsKey(cacheId))
            {
                return new Pair<MeshId, bool>(_mesh2Id[mesh][cacheId], false);
            }

            var attributes = GenerateAttributes(mesh);
            var targets = GenerateMorphTargets(mesh, renderer, m);
            m.Name = mesh.name;
            m.Primitives = new List<MeshPrimitive>();

            EntryBufferView indices = null;

            for (int i = 0; i < mesh.subMeshCount; i += 1)
            {
                var primitive = new MeshPrimitive();
                m.Primitives.Add(primitive);
                primitive.Attributes = attributes;
                primitive.Mode = DrawMode.Triangles;
                if (targets.Count > 0)
                {
                    primitive.Targets = targets;
                }
                SaveIndices(mesh, primitive, i, ref indices);
            }

            root.Meshes.Add(m);
            var id = new MeshId { Id = root.Meshes.Count - 1, Root = root };

            if (!_mesh2Id.ContainsKey(mesh))
            {
                _mesh2Id.Add(mesh, new Dictionary<string, MeshId>());
            }
            _mesh2Id[mesh].Add(cacheId, id);

            return new Pair<MeshId, bool>(id, true);
        }

        private Dictionary<string, AccessorId> GenerateAttributes(UnityEngine.Mesh mesh)
        {
            if (_mesh2attrs.ContainsKey(mesh))
            {
                return _mesh2attrs[mesh];
            }

            var attrs= new Dictionary<string, AccessorId>();

            int stride = GetBufferLength(mesh);
            var bufferView = CreateByteBufferView(mesh.name + "-primitives", stride * mesh.vertexCount, stride);

            int offset = 0;
            attrs.Add("POSITION", PackAttrToBuffer(bufferView, mesh.vertices, offset, (Vector3[] data, int i) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[i]); }));
            offset += 3 * 4;

            if (mesh.normals.Length > 0 && !ExporterSettings.Export.unlit)
            {
                attrs.Add("NORMAL", PackAttrToBuffer(bufferView, mesh.normals, offset, (Vector3[] data, int i) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[i]); }));
                offset += 3 * 4;
            }

            if (!ExporterSettings.Export.noVertexColor && mesh.colors.Length > 0)
            {
                attrs.Add("COLOR_0", PackAttrToBuffer(bufferView, mesh.colors, offset));
                offset += 4 * 4;
            }

            if (mesh.uv.Length > 0)
            {
                attrs.Add("TEXCOORD_0", PackAttrToBuffer(bufferView, mesh.uv, offset));
                offset += 2 * 4;
            }

            if (mesh.uv2.Length > 0)
            {
                attrs.Add("TEXCOORD_1", PackAttrToBuffer(bufferView, mesh.uv2, offset));
                offset += 2 * 4;
            }

            if (mesh.tangents.Length > 0 && !ExporterSettings.Export.unlit)
            {
                attrs.Add("TANGENT", PackAttrToBuffer(bufferView, mesh.tangents, offset, (Vector4[] data, int i) => { return Utils.ConvertVector4LeftToRightHandedness(ref data[i]); }));
                offset += 4 * 4;
            }

            if (mesh.boneWeights.Length > 0)
            {
                attrs.Add("JOINTS_0", PackAttrToBufferShort(bufferView, mesh.boneWeights, offset));
                offset += 2 * 4;
                attrs.Add("WEIGHTS_0", PackAttrToBuffer(bufferView, ExporterUtils.BoneWeightToWeightVec4(mesh.boneWeights), offset));
                offset += 4 * 4;
            }

            foreach(var attr in attrs)
            {
                attr.Value.Value.Name += "-" + attr.Key;
            }

            _mesh2attrs.Add(mesh, attrs);

            return attrs;
        }

        private List<Dictionary<string, AccessorId>> GenerateMorphTargets(UnityEngine.Mesh mesh, Renderer renderer, GLTF.Schema.Mesh m)
        {
            if (mesh.blendShapeCount <= 0)
            {
                return new List<Dictionary<string, AccessorId>>();
            }

            var sm = (SkinnedMeshRenderer)renderer;

            if (_mesh2targets.ContainsKey(mesh))
            {
                return _mesh2targets[mesh];
            }

            var targets = new List<Dictionary<string, AccessorId>>();
            var targetNames = new JArray();
            m.Extras = new JProperty("extras", new JObject(new JProperty("targetNames", targetNames)));

            int stride = 0;
            for (int i = 0; i < mesh.blendShapeCount; i += 1)
            {
                stride += 3 * 4;
                if (mesh.normals.Length > 0 && !ExporterSettings.Export.unlit)
                {
                    stride += 3 * 4;
                }
                if (mesh.tangents.Length > 0 && !ExporterSettings.Export.unlit)
                {
                    stride += 4 * 4;
                }
            }
            var bufferView = CreateByteBufferView(mesh.name + "-targets", stride * mesh.vertexCount, stride);

            Vector3[] vertices = new Vector3[mesh.vertexCount];
            Vector3[] normals = new Vector3[mesh.normals.Length];
            Vector3[] tangents = new Vector3[mesh.tangents.Length];
            int offset = 0;

            m.Weights = new List<double>();

            int attrsCount = 0;
            for (int i = 0; i < mesh.blendShapeCount; i += 1)
            {
                attrsCount += 1;
                var name = mesh.GetBlendShapeName(i);
                var target = new Dictionary<string, AccessorId>();
                targets.Add(target);

                targetNames.Add(name);
                m.Weights.Add(sm.GetBlendShapeWeight(i));

                mesh.GetBlendShapeFrameVertices(i, 0, vertices, normals, tangents);

                target.Add("POSITION", PackAttrToBuffer(bufferView, vertices, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                target["POSITION"].Value.Name += "-" + name + "-POSITION";
                offset += 3 * 4;

                if (mesh.normals.Length > 0 && !ExporterSettings.Export.unlit)
                {
                    attrsCount += 1;
                    target.Add("NORMAL", PackAttrToBuffer(bufferView, normals, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                    target["NORMAL"].Value.Name += "-" + name + "-NORMAL";
                    offset += 3 * 4;
                }

                if (mesh.tangents.Length > 0 && !ExporterSettings.Export.unlit)
                {
                    attrsCount += 1;
                    target.Add("TANGENT", PackAttrToBuffer(bufferView, tangents, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                    target["TANGENT"].Value.Name += "-" + name + "-TANGENT";
                    offset += 4 * 3;
                }
            }

            if (attrsCount > 8) {
                Debug.LogWarning("Mesh '" + mesh.name + "' has blendShapes, but all attributes' count is larger than 8, check here: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets");
            }

            _mesh2targets.Add(mesh, targets);

            return targets;
        }

        private void SaveIndices(UnityEngine.Mesh mesh, MeshPrimitive primitive, int i, ref EntryBufferView bufferView)
        {
            primitive.Mode = DrawMode.Triangles;

            if (_mesh2indices.ContainsKey(mesh) && _mesh2indices[mesh].ContainsKey(i))
            {
                primitive.Indices = _mesh2indices[mesh][i];
                return;
            }

            if (bufferView == null)
            {
                bufferView = CreateStreamBufferView(mesh.name + "-indices");
            }

            primitive.Indices = AccessorToId(
                ExporterUtils.PackToBuffer(bufferView.streamBuffer, mesh.GetTriangles(i), GLTFComponentType.UnsignedShort, (int[] data, int index) => {
                    var offset = index % 3;

                    // reverse vertex sort
                    return data[offset == 0 ? index : offset == 1 ? index + 1 : index - 1];
                }),
                bufferView
            );
            primitive.Indices.Value.Name += "-" + i;

            if (!_mesh2indices.ContainsKey(mesh))
            {
                _mesh2indices.Add(mesh, new Dictionary<int, AccessorId>());
            }

            _mesh2indices[mesh].Add(i, primitive.Indices);
        }

        private int GetBufferLength(UnityEngine.Mesh mesh)
        {
            int stride = 3 * 4; 

            if (mesh.normals.Length > 0 && !ExporterSettings.Export.unlit)
            {
                stride += 3 * 4;
            }

            if (!ExporterSettings.Export.noVertexColor && mesh.colors.Length > 0)
            {
                stride += 4 * 4;
            }

            if (mesh.uv.Length > 0)
            {
                stride += 2 * 4;
            }

            if (mesh.uv2.Length > 0)
            {
                stride += 2 * 4;
            }

            if (mesh.tangents.Length > 0 && !ExporterSettings.Export.unlit)
            {
                stride += 4 * 4;
            }

            if (mesh.boneWeights.Length > 0)
            {
                stride += 2 * 4;
                stride += 4 * 4;
            }

            return stride;
        }

        private AccessorId PackAttrToBuffer<DataType>(EntryBufferView bufferView, DataType[] data, int offset, Func<DataType[], int, DataType> getValueByIndex = null)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.Float, offset, bufferView.view.ByteStride, getValueByIndex);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId PackAttrToBufferShort<DataType>(EntryBufferView bufferView, DataType[] data, int offset, Func<DataType[], int, DataType> getValueByIndex = null)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.UnsignedShort, offset, bufferView.view.ByteStride, getValueByIndex);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId AccessorToId(Accessor accessor, EntryBufferView bufferView)
        {
            if (root.Accessors == null)
            {
                root.Accessors = new List<Accessor>();
            }

            accessor.BufferView = bufferView.id;
            accessor.Name = bufferView.view.Name;
            root.Accessors.Add(accessor);

            return new AccessorId { Id = root.Accessors.Count - 1, Root = root };
        }

        public MaterialId SaveNormalMaterial(UnityEngine.Material material)
        {
            var mid = material.GetInstanceID();
            if (_material2ID.ContainsKey(mid))
            {
                return _material2ID[mid];
            }

            if (root.Materials == null)
            {
                root.Materials = new List<GLTF.Schema.Material>();
            }

			var mat = ExporterUtils.ConvertMaterial(material, this);
			root.Materials.Add(mat);

			var id = new MaterialId { Id = root.Materials.Count - 1, Root = root };
            _material2ID.Add(mid, id);

			return id;
		}

		public MaterialId SaveComponentMaterial(SeinCustomMaterial material)
        {
            if (root.Materials == null)
            {
                root.Materials = new List<GLTF.Schema.Material>();
            }

            var mat = ExporterUtils.ConvertMaterial(material, this);
            root.Materials.Add(mat);

            var id = new MaterialId { Id = root.Materials.Count - 1, Root = root };
            return id;
        }

        public TextureId SaveTexture(Texture2D texture, bool hasTransparency = false, string path = null, int maxSize = -1, EHDRTextureType hdrType = EHDRTextureType.DEFAULT, bool flipY = true)
        {
            if (_texture2d2ID.ContainsKey(texture))
            {
                return _texture2d2ID[texture];
            }

            if (maxSize == -1)
            {
                maxSize = ExporterSettings.NormalTexture.maxSize;
            }

            var imageId = SaveImage(texture, hasTransparency, path, maxSize, hdrType, flipY);

            return GenerateTexture(texture, imageId);
        }

        public CubeTextureId SaveCubeTexture(Cubemap texture, bool hasTransparency = false, string path = null, int maxSize = -1, EHDRTextureType hdrType = EHDRTextureType.DEFAULT)
        {
            if (_cubemap2ID.ContainsKey(texture))
            {
                return _cubemap2ID[texture];
            }

            if (root.Textures == null)
            {
                root.Textures = new List<GLTF.Schema.Texture>();
            }

            if (maxSize == -1)
            {
                maxSize = ExporterSettings.CubeTexture.maxSize;
            }

            var samplerId = GenerateSampler(texture);

            var extName = ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory));
            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory)), this, root.Extensions, texture, new CubeTextureSaveOptions{
                maxSize = maxSize, sampler = samplerId, hasTransparency = hasTransparency, path = path, hdrType = hdrType
            });

            var id = new CubeTextureId { Id = ((Sein_cubeTextureExtension)root.Extensions[extName]).textures.Count - 1, Root = root };
            _cubemap2ID[texture] = id;

            return id;
        }

        public CubeTextureId SaveCubeTexture(Texture2D[] textures, bool hasTransparency = false, string path = null, int maxSize = -1, EHDRTextureType hdrType = EHDRTextureType.DEFAULT)
        {
            if (_cubemap2ID.ContainsKey(textures[0]))
            {
                return _cubemap2ID[textures[0]];
            }

            var samplerId = GenerateSampler(textures[0]);

            if (maxSize == -1)
            {
                maxSize = ExporterSettings.CubeTexture.maxSize;
            }

            var extName = ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory));
            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_cubeTextureExtensionFactory)), this, root.Extensions, null, new CubeTextureSaveOptions{
                maxSize = maxSize, textures = textures, sampler = samplerId, hasTransparency = hasTransparency, path = path, hdrType = hdrType
            });

             var id = new CubeTextureId { Id = ((Sein_cubeTextureExtension)root.Extensions[extName]).textures.Count - 1, Root = root };
            _cubemap2ID[textures[0]] = id;

            return id;
        }

        public ImageId SaveImage(Texture2D texture, bool hasTransparency = false, string path = null, int maxSize = -1, EHDRTextureType hdrType = EHDRTextureType.DEFAULT, bool flipY = true)
        {
            if (_texture2d2ImageID.ContainsKey(texture))
            {
                return _texture2d2ImageID[texture];
            }

            bool isHDR = texture.format == TextureFormat.RGBAHalf || texture.format == TextureFormat.RGBAFloat || texture.format == TextureFormat.BC6H || texture.format == TextureFormat.RGB9e5Float;
            string format = ".png";
            var newTex = texture;

            if (isHDR)
            {
                if (hdrType == EHDRTextureType.DEFAULT)
                {
                    hdrType = ExporterSettings.HDR.type;
                }

                if (hdrType != EHDRTextureType.RGBD)
                {
                    Utils.ThrowExcption("HDR Texture can only be exported as 'RGBD' now !");
                }

                newTex = GLTFTextureUtils.HDR2RGBD(texture, flipY);
                format = ".png";
            }
            else if (flipY)
            {
                newTex = TextureFlipY(texture);
            }

            if (!isHDR && !hasTransparency && ExporterSettings.NormalTexture.opaqueType == ENormalTextureType.JPG)
            {
                format = ".jpg";
            }

            string[] pathes;

            if (path == null)
            {
                pathes = GetTextureOutPath(texture, format);
            }
            else
            {
                pathes = ExporterUtils.GetAssetOutPath(path, format);
            }

            var exportPath = pathes[0];
            var pathInGlTF = pathes[1];

            byte[] content = { };
            Utils.DoActionForTexture(ref newTex, tex =>
            {
                if (tex.width > maxSize || tex.height > maxSize)
                {
                    if (tex.width > tex.height) {
                        TextureScale.Bilinear(tex, maxSize, maxSize * tex.height / tex.width);
                    } else {
                        TextureScale.Bilinear(tex, maxSize * tex.width / tex.height, maxSize);
                    }
                }

                if (format == ".png")
                {
                    content = GetPNGData(tex);
                }
                else
                {
                    content = tex.EncodeToJPG(ExporterSettings.NormalTexture.jpgQulity);
                }
            });

            var id = GenerateImage(content, exportPath, pathInGlTF);

            var extras = (id.Value.Extras as JProperty).Value as JObject;
            extras.Add("type", isHDR ? "HDR" : "LDR");

            if (isHDR && hdrType == EHDRTextureType.RGBD)
            {
                extras.Add("format", "RGBD");
            } else if (!hasTransparency && format == ".png")
            {
                extras.Add("format", "RGB");
            }

            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;

            if (im)
            {
                if (!im.mipmapEnabled)
                {
                    extras.Add("useMipmaps", false);
                }

                if (im.textureType == TextureImporterType.NormalMap)
                {
                    extras.Add("isNormalMap", true);
                }
            }

            return id;
        }

        private byte[] GetPNGData(Texture2D tex)
        {
            if (ExporterSettings.NormalTexture.pngFormat != EPNGTextureFormat.RGBA32)
            {
                EditorUtility.CompressTexture(tex, (TextureFormat)ExporterSettings.NormalTexture.pngFormat, UnityEditor.TextureCompressionQuality.Best);
            }

            var data = tex.EncodeToPNG();

            return data;
        }

        private ImageId GenerateImage(byte[] content, string exportPath, string pathInGltf)
        {
            File.WriteAllBytes(exportPath, content);

            if (root.Images == null)
            {
                root.Images = new List<GLTF.Schema.Image>();
            }

            root.Images.Add(new Image { Uri = pathInGltf, Extras = new JProperty("extras", new JObject()) });

            return new ImageId { Id = root.Images.Count - 1, Root = root };
        }

        private TextureId GenerateTexture(Texture2D texture, ImageId imageId)
        {
            if (root.Textures == null)
            {
                root.Textures = new List<GLTF.Schema.Texture>();
            }

            var samplerId = GenerateSampler(texture);

            var gltfTexture = new GLTF.Schema.Texture { Source = imageId, Sampler = samplerId, Extensions = new Dictionary<string, Extension>() };

            ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_textureImproveExtensionFactory)), this, gltfTexture.Extensions, texture);

            root.Textures.Add(gltfTexture);

            var id = new TextureId { Id = root.Textures.Count - 1, Root = root };
            _texture2d2ID[texture] = id;

            return id;
        }

        private SamplerId GenerateSampler(UnityEngine.Texture texture)
        {
            if (root.Samplers == null)
            {
                root.Samplers = new List<Sampler>();
            }

            var hasMipMap = true;
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
            if (im != null)
            {
                hasMipMap = im.mipmapEnabled;
            }

            MagFilterMode magFilter = MagFilterMode.None;
            MinFilterMode minFilter = MinFilterMode.None;
            GLTF.Schema.WrapMode wrap = GLTF.Schema.WrapMode.None;

            switch (texture.filterMode)
            {
                case FilterMode.Point:
                    magFilter = MagFilterMode.Nearest;
                    if (hasMipMap)
                    {
                        minFilter = MinFilterMode.NearestMipmapNearest;
                    }
                    else
                    {
                        minFilter = MinFilterMode.Nearest;
                    }
                    break;

                case FilterMode.Bilinear:
                    magFilter = MagFilterMode.Linear;
                    if (hasMipMap)
                    {
                        minFilter = MinFilterMode.LinearMipmapNearest;
                    }
                    else
                    {
                        minFilter = MinFilterMode.Linear;
                    }
                    break;

                case FilterMode.Trilinear:
                    magFilter = MagFilterMode.Linear;
                    if (hasMipMap)
                    {
                        minFilter = MinFilterMode.Linear;
                    }
                    else
                    {
                        minFilter = MinFilterMode.LinearMipmapLinear;
                    }
                    break;
            }

            switch (texture.wrapMode)
            {
                case TextureWrapMode.Clamp:
                    wrap = GLTF.Schema.WrapMode.ClampToEdge;
                    break;
                case TextureWrapMode.Repeat:
                    wrap = GLTF.Schema.WrapMode.Repeat;
                    break;
                case TextureWrapMode.Mirror:
                    wrap = GLTF.Schema.WrapMode.MirroredRepeat;
                    break;
            }

            var sampler = new Sampler
            {
                MagFilter = magFilter,
                MinFilter = minFilter,
                WrapS = wrap,
                WrapT = wrap
            };
            root.Samplers.Add(sampler);

            return new SamplerId { Id = root.Samplers.Count - 1, Root = root };
        }

        private Texture2D TextureFlipY(Texture2D texture, Func<Color, Color> convertColor = null, Action<Texture2D> processTexture = null)
        {
            Texture2D newTex;
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;

            if (convertColor == null && (im == null || im.textureType != TextureImporterType.NormalMap))
            {
                // use gpu to speed up
                newTex = GLTFTextureUtils.flipTexture(texture);
            }
            else
            {
                int height = texture.height;
                int width = texture.width;
                Color[] newTextureColors = new Color[height * width];

                ExporterUtils.DoActionForTexture(ref texture, tex =>
                {
                    Color[] textureColors = tex.GetPixels();
                    for (int i = 0; i < height; ++i)
                    {
                        for (int j = 0; j < width; ++j)
                        {
                            var c = textureColors[(height - i - 1) * width + j];

                            newTextureColors[i * width + j] = convertColor != null ? convertColor(c) : c;
                        }
                    }
                }
                );

                newTex = new Texture2D(width, height);
                newTex.SetPixels(newTextureColors);
                newTex.Apply();
            }

            if (processTexture != null)
            {
                processTexture(newTex);
            }

            return newTex;
        }

        private string[] GetTextureOutPath(Texture2D texture, string format)
        {
            return ExporterUtils.GetAssetOutPath(texture, format);
        }

        public CameraId SaveCamera(UnityEngine.Camera camera)
        {
            if (root.Cameras == null)
            {
                root.Cameras = new List<GLTF.Schema.Camera>();
            }

            if (_camera2ID.ContainsKey(camera))
            {
                return _camera2ID[camera];
            }

            var c = ProcessCamera(camera);
            root.Cameras.Add(c);

            var cameraId = new CameraId { Id = root.Cameras.Count - 1, Root = root };
            _camera2ID.Add(camera, cameraId);

            return cameraId;
        }

        private GLTF.Schema.Camera ProcessCamera(UnityEngine.Camera camera)
        {
            var cam = new GLTF.Schema.Camera();
            cam.Name = camera.name;

            if (camera.orthographic)
            {
                var matrix = camera.projectionMatrix;
                cam.Type = GLTF.Schema.CameraType.orthographic;
                cam.Orthographic = new CameraOrthographic
                {
                    ZFar = (matrix[2, 3] / matrix[2, 2]) - (1 / matrix[2, 2]),
                    XMag = 1 / matrix[0, 0],
                    YMag = 1 / matrix[1, 1]
                };
                cam.Orthographic.ZNear = cam.Orthographic.ZFar + (2 / matrix[2, 2]);
            }
            else
            {
                cam.Type = GLTF.Schema.CameraType.perspective;
                cam.Perspective = new CameraPerspective
                {
                    ZFar = camera.farClipPlane,
                    ZNear = camera.nearClipPlane,
                    AspectRatio = camera.aspect,
                    YFov = camera.fieldOfView / 180 * Math.PI
                };
            }

            if (ExporterSettings.Export.skybox) {
                cam.Extensions = new Dictionary<string, Extension>();
                ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_skyboxExtensionFactory)), this, cam.Extensions, camera);
            }

            return cam;
        }

        public SkinId SaveSkin(Transform tr)
        {
            if (root.Skins == null)
            {
                root.Skins = new List<GLTF.Schema.Skin>();
            }

            var skinMesh = tr.GetComponent<SkinnedMeshRenderer>();

            if (_skin2ID.ContainsKey(skinMesh))
            {
                return _skin2ID[skinMesh];
            }

            var node = tr2node[tr];
            var skin = new Skin();
            skin.Name = "skeleton-" + skinMesh.rootBone.name + "-" + tr.name;
            skin.Skeleton = new NodeId { Id = root.Nodes.IndexOf(tr2node[skinMesh.rootBone]), Root = root };
            skin.Joints = new List<NodeId>();

            foreach (var bone in skinMesh.bones)
            {
                if (!tr2node.ContainsKey(bone))
                {
                    Utils.ThrowExcption("You are expoting a skinned mesh '" + node.Name + "', but not select bones!");
                }

                skin.Joints.Add(new NodeId { Id = root.Nodes.IndexOf(tr2node[bone]) });
            }

            // Create invBindMatrices accessor
            var bufferView = CreateStreamBufferView("invBind-" + skinMesh.rootBone.name + "-" + tr.name);

            Matrix4x4[] invBindMatrices = new Matrix4x4[skin.Joints.Count];
            for (int i = 0; i < skinMesh.bones.Length; ++i)
            {
                // Generates inverseWorldMatrix in right-handed coordinate system
                Matrix4x4 invBind = skinMesh.sharedMesh.bindposes[i];
                invBindMatrices[i] = Utils.ConvertMat4LeftToRightHandedness(ref invBind);
            }

            skin.InverseBindMatrices = AccessorToId(
                ExporterUtils.PackToBuffer(bufferView.streamBuffer, invBindMatrices, GLTFComponentType.Float),
                bufferView
            );

            root.Skins.Add(skin);

            var id = new SkinId { Id = root.Skins.Count - 1, Root = root };
            _skin2ID.Add(skinMesh, id);

            return id;
        }

        public void SaveAnimations(Transform tr)
        {
            if (root.Animations == null)
            {
                root.Animations = new List<GLTF.Schema.Animation>();
            }

            AnimationClip[] clips = null;
            string defaultClip = null;
            var a = tr.GetComponent<Animator>();

            if (a != null && a.runtimeAnimatorController != null)
            {
                clips = AnimationUtility.GetAnimationClips(tr.gameObject);
                
                var current = a.GetCurrentAnimatorClipInfo(0);
                if (current.Length == 0)
                {
                    if (a.runtimeAnimatorController.animationClips.Length > 0)
                    {
                        defaultClip = a.runtimeAnimatorController.animationClips[0].name;
                    }
                }
                else
                {
                    defaultClip = current[0].clip.name;
                }
            }
            else if (tr.GetComponent<UnityEngine.Animation>())
            {
                Utils.ThrowExcption("Never support Unity.Animation component now, use Unity.Animator to instead of it !");
            }

            if (clips == null)
            {
                return;
            }

            SeinAnimator animator = tr.GetComponent<SeinAnimator>();
            if (animator == null)
            {
                animator = tr.gameObject.AddComponent<SeinAnimator>();
            }
            animator.modelAnimations = new string[clips.Length];
            animator.prefixes = new string[clips.Length];
            animator.name = tr.GetComponent<Animator>().runtimeAnimatorController.name;
            animator.defaultAnimation = defaultClip;

            for (int i = 0; i < clips.Length; i++)
            {
                var clip = clips[i];
                var prefix = clip.GetHashCode().ToString();
                var clipName = clip.name;

                if (clipName.Contains(tr.name + "@"))
                {
                    clipName = clipName.Replace(tr.name + "@", "");
                }

                SaveAnimationClip(tr, clip, prefix, clipName);

                animator.modelAnimations[i] = clipName;

                animator.prefixes[i] = prefix;
            }
        }

        private GLTF.Schema.Animation SaveAnimationClip(Transform tr, AnimationClip clip, string prefix, string clipName)
        {
            if (_animClip2anim.ContainsKey(clip))
            {
                return _animClip2anim[clip];
            }

            var anim = new GLTF.Schema.Animation { Name = prefix + "@" + clipName };
            var targets = BakeAnimationClip(anim, tr, clip);
            var accessors = _animClip2Accessors[clip];

            int targetId = 0;
            int accessorId = 0;
            foreach (var target in targets)
            {
                var targetTr = tr.Find(targets[targetId]);
                var targetNode = tr2node[targetTr];

                foreach (var accessor in accessors[targetId])
                {
                    var path = accessor.Key;
                    var value = accessor.Value;

                    anim.Channels.Add(
                        new AnimationChannel
                        {
                            Sampler = new AnimationSamplerId { Id = accessorId },
                            Target = new AnimationChannelTarget { Path = path, Node = new NodeId { Id = root.Nodes.IndexOf(targetNode) } }
                        }
                    );

                    anim.Samplers.Add(
                        new AnimationSampler {
                            Input = value.timeId,
                            Output = value.propertyId,
                            Interpolation = value.tangentMode == AnimationUtility.TangentMode.Linear ? InterpolationType.LINEAR : value.tangentMode == AnimationUtility.TangentMode.Constant ? InterpolationType.STEP : InterpolationType.CUBICSPLINE
                        }
                    );;

                    accessorId += 1;
                }

                targetId += 1;
            }

            root.Animations.Add(anim);
            _animClip2anim.Add(clip, anim);

            return anim;
        }

        private List<string> BakeAnimationClip(GLTF.Schema.Animation anim, Transform tr, AnimationClip clip)
        {
            var needGenerate = !_animClip2Accessors.ContainsKey(clip);
            var smr = tr.GetComponent<UnityEngine.SkinnedMeshRenderer>();
            Dictionary<string, Dictionary<GLTFAnimationChannelPath, AnimationCurve[]>> curves = null;

            if (needGenerate)
            {
                curves = new Dictionary<string, Dictionary<GLTFAnimationChannelPath, AnimationCurve[]>>();
            }

            List<string> targets = new List<string>();

            foreach (var binding in AnimationUtility.GetCurveBindings(clip))
            {
                var path = binding.path;
                var curve = AnimationUtility.GetEditorCurve(clip, binding);

                if (!curves.ContainsKey(path))
                {
                    targets.Add(path);
                    if (needGenerate)
                    {
                        curves.Add(path, new Dictionary<GLTFAnimationChannelPath, AnimationCurve[]>());
                    }
                }

                if (!needGenerate)
                {
                    continue;
                }

                var current = curves[path];
                if (binding.propertyName.Contains("m_LocalPosition"))
                {
                    if (!current.ContainsKey(GLTFAnimationChannelPath.translation))
                    {
                        current.Add(GLTFAnimationChannelPath.translation, new AnimationCurve[3]);
                    }
                    if (binding.propertyName.Contains(".x"))
                        current[GLTFAnimationChannelPath.translation][0] = curve;
                    else if (binding.propertyName.Contains(".y"))
                        current[GLTFAnimationChannelPath.translation][1] = curve;
                    else if (binding.propertyName.Contains(".z"))
                        current[GLTFAnimationChannelPath.translation][2] = curve;
                }
                else if (binding.propertyName.Contains("m_LocalScale"))
                {
                    if (!current.ContainsKey(GLTFAnimationChannelPath.scale))
                    {
                        current.Add(GLTFAnimationChannelPath.scale, new AnimationCurve[3]);
                    }
                    if (binding.propertyName.Contains(".x"))
                        current[GLTFAnimationChannelPath.scale][0] = curve;
                    else if (binding.propertyName.Contains(".y"))
                        current[GLTFAnimationChannelPath.scale][1] = curve;
                    else if (binding.propertyName.Contains(".z"))
                        current[GLTFAnimationChannelPath.scale][2] = curve;
                }
                else if (binding.propertyName.ToLower().Contains("localrotation"))
                {
                    if (!current.ContainsKey(GLTFAnimationChannelPath.rotation))
                    {
                        current.Add(GLTFAnimationChannelPath.rotation, new AnimationCurve[4]);
                    }
                    if (binding.propertyName.Contains(".x"))
                        current[GLTFAnimationChannelPath.rotation][0] = curve;
                    else if (binding.propertyName.Contains(".y"))
                        current[GLTFAnimationChannelPath.rotation][1] = curve;
                    else if (binding.propertyName.Contains(".z"))
                        current[GLTFAnimationChannelPath.rotation][2] = curve;
                    else if (binding.propertyName.Contains(".w"))
                        current[GLTFAnimationChannelPath.rotation][3] = curve;
                }
                else if (binding.propertyName.ToLower().Contains("localeuler"))
                {
                    Utils.ThrowExcption(new Exception(
                        "Only support rotation animation with interpolation mode 'Quaternion', please change the mode from 'Euler' to 'Euler(Quaternion)' in animation edtior !"
                    ));
                    return null;
                }
                else if (binding.propertyName.Contains("blendShape"))
                {
                    if (!current.ContainsKey(GLTFAnimationChannelPath.weights))
                    {
                        current.Add(GLTFAnimationChannelPath.weights, new AnimationCurve[smr.sharedMesh.blendShapeCount]);
                    }
                    var key = binding.propertyName.Replace("blendShape.", "");
                    current[GLTFAnimationChannelPath.weights][smr.sharedMesh.GetBlendShapeIndex(key)] = curve;
                } else
                {
                    continue;
                }
            }

            if (!needGenerate)
            {
                return targets;
            }

            
            var bufferView = CreateStreamBufferView("animation-" + anim.Name);
            var accessors = new List<Dictionary<GLTFAnimationChannelPath, GLTFAnimationInfo>>();
            _animClip2Accessors.Add(clip, accessors);
            var emptyKeyFrame = new Keyframe();

            foreach (var path in curves.Keys)
            {
                var accessor = new Dictionary<GLTFAnimationChannelPath, GLTFAnimationInfo>();
                accessors.Add(accessor);

                foreach (var curve in curves[path])
                {
                    HashSet<float> timesSet = new HashSet<float>();
                    AnimationUtility.TangentMode tangentMode = AnimationUtility.TangentMode.Constant;
                    foreach (var c in curve.Value)
                    {
                        int i = 0;
                        foreach (var key in c.keys)
                        {
                            var tmode = AnimationUtility.GetKeyLeftTangentMode(c, i);

                            if (tmode == AnimationUtility.TangentMode.Free || tmode == AnimationUtility.TangentMode.ClampedAuto || tmode == AnimationUtility.TangentMode.Auto)
                            {
                                tangentMode = AnimationUtility.TangentMode.Free;
                            } else if (tmode == AnimationUtility.TangentMode.Linear && tangentMode != AnimationUtility.TangentMode.Free)
                            {
                                tangentMode = AnimationUtility.TangentMode.Linear;
                            }
                            timesSet.Add(key.time);
                            i += 1;
                        }
                    }

                    if (tangentMode == AnimationUtility.TangentMode.Free && ExporterSettings.Animation.forceLinear)
                    {
                        tangentMode = AnimationUtility.TangentMode.Linear;
                    }

                    var times = new float[timesSet.Count];
                    timesSet.CopyTo(times);
                    Array.Sort(times);
                    Dictionary<int, Keyframe>[] keys = new Dictionary<int, Keyframe>[times.Length];

                    for (int i = 0; i < curve.Value.Length; i += 1)
                    {
                        var c = curve.Value[i];
                        foreach (var key in c.keys)
                        {
                            var time = key.time;
                            var index = Array.IndexOf(times, time);

                            if (keys[index] == null)
                            {
                                keys[index] = new Dictionary<int, Keyframe>();
                            }

                            keys[index][i] = key;
                        }
                    }

                    var eleCount = tangentMode == AnimationUtility.TangentMode.Free ? 3 : 1;
                    var curveCount = curve.Value.Length;
                    var count = times.Length * curveCount * eleCount;
                    float[] buf = new float[count];
                    var convertLeftToRight = curve.Key == GLTFAnimationChannelPath.translation || curve.Key == GLTFAnimationChannelPath.rotation;
                    for (int i = 0; i < times.Length; i += 1)
                    {
                        var time = times[i];
                        var ks = keys[i];

                        for (int j = 0; j < curveCount; j += 1)
                        {
                            // vec3 or quat
                            var sign = (convertLeftToRight && (j == 2 || j == 3)) ? -1 : 1;
                            var c = curve.Value[j];
                            if (tangentMode != AnimationUtility.TangentMode.Free)
                            {
                                buf[i * curve.Value.Length + j] = sign * c.Evaluate(time);
                                continue;
                            }

                            var key = ks.ContainsKey(j) ? ks[j] : i == 0 ? emptyKeyFrame : keys[i - 1][j];
                            if (!ks.ContainsKey(j))
                            {
                                ks[j] = key;
                            }
                            var start = i * curveCount * eleCount + j;
                            // in1, in2, in3, v1, v2, v3, o1, o2, o3
                            buf[start] = key.inTangent == Mathf.Infinity ? 0 : key.inTangent;
                            buf[start + curveCount] = sign * c.Evaluate(time);
                            buf[start + curveCount * 2] = key.outTangent == Mathf.Infinity ? 0 : key.outTangent;
                        }
                    }

                    GLTFAccessorAttributeType attributeType = curve.Key == GLTFAnimationChannelPath.rotation ? GLTFAccessorAttributeType.VEC4 : (curve.Key == GLTFAnimationChannelPath.translation || curve.Key == GLTFAnimationChannelPath.scale) ? GLTFAccessorAttributeType.VEC3 : GLTFAccessorAttributeType.SCALAR;
                    var timeId = AccessorToId(ExporterUtils.PackToBuffer(bufferView.streamBuffer, times, GLTFComponentType.Float), bufferView);
                    timeId.Value.Name += "-" + path + "-" + curve.Key + "-" + "time";
                    var id = AccessorToId(ExporterUtils.PackToBufferFloatArray(bufferView.streamBuffer, buf, attributeType, GLTFComponentType.Float), bufferView);
                    id.Value.Name += "-" + path + "-" + curve.Key;
                    accessor.Add(curve.Key, new GLTFAnimationInfo { propertyId = id, tangentMode = tangentMode, timeId = timeId});
                }
            }

            return targets;
        }

        public void Finish()
        {
            var prefixStr = Config.GeneratorName;
            for (var i = Config.GeneratorName.Length; i < 24; i += 1)
            {
                prefixStr += " ";
            }
            var prefix = Encoding.ASCII.GetBytes(prefixStr);
            var uri = name + ".bin";
            var fp = Path.Combine(ExporterSettings.Export.folder, uri);
            var bufferId = new BufferId { Id = 0, Root = root };
            var outputFile = new FileStream(fp, FileMode.Create);
            int offset = prefix.Length;

            using (var binWriter = new BinaryWriter(outputFile)) {
                binWriter.Write(prefix);

                foreach (var bufferView in _bufferViews)
                {
                    int length = 0;

                    if (bufferView.byteBuffer != null)
                    {
                        length = bufferView.byteBuffer.Length;
                        binWriter.Write(bufferView.byteBuffer);
                    } else if (bufferView.streamBuffer != null)
                    {
                        length = (int)bufferView.streamBuffer.Length;
                        binWriter.Write(bufferView.streamBuffer.ToArray());
                    }

                    bufferView.view.ByteLength = length;
                    bufferView.view.ByteOffset = offset;
                    bufferView.view.Buffer = bufferId;

                    offset += length;

                    var rem = offset % 4;
                    if (rem != 0)
                    {
                        binWriter.Write(new byte[4 - rem]);
                        offset += 4 - rem;
                    }
                }

                binWriter.Flush();
            }

            var buffer = new GLTF.Schema.Buffer();
            buffer.ByteLength = offset;
            buffer.Uri = uri;
            root.Buffers = new List<GLTF.Schema.Buffer> { buffer };

            using (var writer = File.CreateText(path))
            {
                root.Serialize(writer);
            }
        }
    }
}
