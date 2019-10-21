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
            // 记得最后算ByteLength
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
        private Dictionary<SkinnedMeshRenderer, SkinId> _skin2ID = new Dictionary<SkinnedMeshRenderer, SkinId>();
        private Dictionary<AnimationClip, AccessorId> _animClip2TimeAccessor = new Dictionary<AnimationClip, AccessorId>();
        private Dictionary<AnimationClip, GLTF.Schema.Animation> _animClip2anim = new Dictionary<AnimationClip, GLTF.Schema.Animation>();
        private Dictionary<AnimationClip, List<Dictionary<GLTFAnimationChannelPath, AccessorId>>> _animClip2Accessors = new Dictionary<AnimationClip, List<Dictionary<GLTFAnimationChannelPath, AccessorId>>>();
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
                node.Matrix = Utils.ConvertMat4LeftToRightHandedness(tr.localToWorldMatrix);
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

            string materialsId = "";
            foreach (var mat in renderer.sharedMaterials)
            {
                materialsId += mat.GetInstanceID();
            }

            if (_mesh2Id.ContainsKey(mesh) && _mesh2Id[mesh].ContainsKey(materialsId))
            {
                return new Pair<MeshId, bool>(_mesh2Id[mesh][materialsId], false);
            }

            var m = new GLTF.Schema.Mesh();
            var attributes = GenerateAttributes(mesh);
            var targets = GenerateMorphTargets(mesh, m);
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
            _mesh2Id[mesh].Add(materialsId, id);

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

            if (mesh.normals.Length > 0)
            {
                attrs.Add("NORMAL", PackAttrToBuffer(bufferView, mesh.normals, offset, (Vector3[] data, int i) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[i]); }));
                offset += 3 * 4;
            }

            if (mesh.colors.Length > 0)
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

            if (mesh.tangents.Length > 0)
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

        private List<Dictionary<string, AccessorId>> GenerateMorphTargets(UnityEngine.Mesh mesh, GLTF.Schema.Mesh m)
        {
            if (mesh.blendShapeCount <= 0)
            {
                return new List<Dictionary<string, AccessorId>>();
            }

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
                if (mesh.normals.Length > 0)
                {
                    stride += 3 * 4;
                }
                if (mesh.tangents.Length > 0)
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

            for (int i = 0; i < mesh.blendShapeCount; i += 1)
            {
                var name = mesh.GetBlendShapeName(i);
                var target = new Dictionary<string, AccessorId>();
                targets.Add(target);

                targetNames.Add(name);
                m.Weights.Add(mesh.GetBlendShapeFrameWeight(i, 0));

                mesh.GetBlendShapeFrameVertices(i, 0, vertices, normals, tangents);

                target.Add("POSITION", PackAttrToBuffer(bufferView, vertices, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                target["POSITION"].Value.Name += "-" + name + "-POSITION";
                offset += 3 * 4;

                if (mesh.normals.Length > 0)
                {
                    target.Add("NORMAL", PackAttrToBuffer(bufferView, normals, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                    target["NORMAL"].Value.Name += "-" + name + "-NORMAL";
                    offset += 3 * 4;
                }

                if (mesh.tangents.Length > 0)
                {
                    target.Add("TANGENT", PackAttrToBuffer(bufferView, tangents, offset, (Vector3[] data, int index) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[index]); }));
                    target["TANGENT"].Value.Name += "-" + name + "-TANGENT";
                    offset += 4 * 3;
                }
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

            if (mesh.normals.Length > 0)
            {
                stride += 3 * 4;
            }

            if (mesh.colors.Length > 0)
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

            if (mesh.tangents.Length > 0)
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
            if (root.Materials == null)
            {
                root.Materials = new List<GLTF.Schema.Material>();
            }

            var mid = material.GetInstanceID();
            if (_material2ID.ContainsKey(mid))
            {
                return _material2ID[mid];
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

        public TextureId SaveTexture(Texture2D texture, bool hasTransparency, string path = null)
        {
            if (_texture2d2ID.ContainsKey(texture))
            {
                return _texture2d2ID[texture];
            }

            string format = ".png";
            if (!hasTransparency && ExporterSettings.NormalTexture.opaqueType == ENormalTextureType.JPG)
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

            if (File.Exists(exportPath)) {
                return GenerateTexture(texture, pathInGlTF);
            }

            var tex = TextureFlipY(
                texture,
                color => {
                    if (!hasTransparency)
                    {
                        color.a = 1;
                    }

                    return color;
                },
                newtex => {
                    var maxSize = ExporterSettings.NormalTexture.maxSize;
                    if (newtex.width > maxSize || newtex.height > maxSize)
                    {
                        TextureScale.Bilinear(newtex, maxSize, maxSize);
                    }
                }
            );

            byte[] content = { };

            if (format == ".png")
            {
                content = tex.EncodeToPNG();
            }
            else
            {
                content = tex.EncodeToJPG(ExporterSettings.NormalTexture.jpgQulity);
            }

            File.WriteAllBytes(exportPath, content);

            return GenerateTexture(texture, pathInGlTF);
        }

        public TextureId SaveTextureHDR(Texture2D texture, EHDRTextureType type, int maxSize = -1, string path = null)
        {
            if (type != EHDRTextureType.RGBD)
            {
                throw new Exception("HDR Texture can only be exported as 'RGBD' now !");
            }

            var isGammaSpace = PlayerSettings.colorSpace == ColorSpace.Gamma;
            if (isGammaSpace)
            {
                // we need linear space lightmap in Sein
                Debug.LogWarning("You are using lightmap in `Gamma ColorSpace`, it may have wrong result in Sein ! Please checkout 'http://seinjs.com/guide/baking' for details !");
            }

            if (_texture2d2ID.ContainsKey(texture))
            {
                return _texture2d2ID[texture];
            }

            string format = ".png";
            string[] pathes;
            if (path == null)
            {
                pathes = GetTextureOutPath(texture, format);
            } else
            {
                pathes = ExporterUtils.GetAssetOutPath(path, format);
            }
            var exportPath = pathes[0];
            var pathInGlTF = pathes[1];

            if (File.Exists(exportPath)) {
                return GenerateTexture(texture, pathInGlTF);
            }

            var tex = TextureFlipY(
                texture,
                origColor => {
                    var color = new Color(0, 0, 0, 1);

                    if (Math.Abs(origColor.a) > 0.001)
                    {
                        origColor = DecodeRGBM(origColor);
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

                    return color;
                },
                newtex => {
                    if (maxSize > 0 && (newtex.width > maxSize || newtex.height > maxSize))
                    {
                        TextureScale.Bilinear(newtex, maxSize, maxSize);
                    }
                }
            );

            byte[] content = tex.EncodeToPNG();

            File.WriteAllBytes(exportPath, content);

            return GenerateTexture(texture, pathInGlTF);
        }

        private TextureId GenerateTexture(Texture2D texture, string pathInGltf)
        {
            if (root.Textures == null)
            {
                root.Textures = new List<GLTF.Schema.Texture>();
            }

            if (root.Images == null)
            {
                root.Images = new List<GLTF.Schema.Image>();
            }

            if (root.Samplers == null)
            {
                root.Samplers = new List<GLTF.Schema.Sampler>();
            }

            root.Images.Add(new Image { Uri = pathInGltf });
            var imageId = new ImageId { Id = root.Images.Count - 1, Root = root };

            var hasMipMap = texture.mipmapCount > 0;
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
            }

            var sampler = new Sampler
            {
                MagFilter = magFilter,
                MinFilter = minFilter,
                WrapS = wrap,
                WrapT = wrap
            };
            root.Samplers.Add(sampler);
            var samplerId = new SamplerId { Id = root.Samplers.Count - 1, Root = root };

            var gltfTexture = new GLTF.Schema.Texture { Source = imageId, Sampler = samplerId };
            root.Textures.Add(gltfTexture);

            var id = new TextureId { Id = root.Textures.Count - 1, Root = root };
            _texture2d2ID[texture] = id;

            return id;
        }

        // http://dphgame.com/doku.php?id=shader%E5%9F%BA%E7%A1%80:unity%E5%86%85%E7%BD%AEshader:%E5%85%AC%E5%85%B1%E5%87%BD%E6%95%B0#decodelightmap
        private Color DecodeRGBM(Color color)
        {
            var realColor = color;
            var dFactor = realColor.a;

            return new Color(
                dFactor * realColor.r,
                dFactor * realColor.g,
                dFactor * realColor.b,
                1
            );
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
                    YFov = camera.fieldOfView
                };
            }

            return cam;
        }

        private Texture2D TextureFlipY(Texture2D texture, Func<Color, Color> convertColor = null, Action<Texture2D> processTexture = null)
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

            var newtex = new Texture2D(width, height);
            newtex.SetPixels(newTextureColors);
            newtex.Apply();

            if (processTexture != null)
            {
                processTexture(newtex);
            }

            return newtex;
        }

        private string[] GetTextureOutPath(Texture2D texture, string format)
        {
            return ExporterUtils.GetAssetOutPath(texture, format);
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
            skin.Skeleton = new NodeId { Id = root.Nodes.IndexOf(node), Root = root };
            skin.Joints = new List<NodeId>();

            foreach (var bone in skinMesh.bones)
            {
                if (!tr2node.ContainsKey(bone))
                {
                    throw new Exception("You are expoting a skinned mesh '" + node.Name + "', but not select bones!");
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

            if (tr.GetComponent<Animator>())
            {
                clips = AnimationUtility.GetAnimationClips(tr.gameObject);
                defaultClip = tr.GetComponent<Animator>().GetCurrentAnimatorClipInfo(0)[0].clip.name;
            }
            else if (tr.GetComponent<UnityEngine.Animation>())
            {
                throw new Exception("Never support Unity.Animation component now, use Unity.Animator to instead of it !");
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

                SaveAnimationClip(tr, clip, prefix);

                animator.modelAnimations[i] = clip.name;
                animator.prefixes[i] = prefix;
            }
        }

        private GLTF.Schema.Animation SaveAnimationClip(Transform tr, AnimationClip clip, string prefix)
        {
            if (_animClip2anim.ContainsKey(clip))
            {
                return _animClip2anim[clip];
            }

            var anim = new GLTF.Schema.Animation { Name = prefix + "@" + clip.name };
            var targets = BakeAnimationClip(anim, tr, clip);
            var accessors = _animClip2Accessors[clip];
            var timeAccessorId = _animClip2TimeAccessor[clip];

            int targetId = 0;
            int accessorId = 0;
            foreach (var target in targets)
            {
                var targetTr = tr.Find(targets[targetId]);
                var targetNode = tr2node[targetTr];

                foreach (var accessor in accessors[targetId])
                {
                    var path = accessor.Key;

                    anim.Channels.Add(
                        new AnimationChannel
                        {
                            Sampler = new AnimationSamplerId { Id = accessorId },
                            Target = new AnimationChannelTarget { Path = path, Node = new NodeId { Id = root.Nodes.IndexOf(targetNode) } }
                        }
                    );

                    anim.Samplers.Add(
                        new AnimationSampler {
                            Input = timeAccessorId,
                            Output = accessor.Value,
                            Interpolation = InterpolationType.LINEAR
                        }
                    );

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
            Dictionary<string, Dictionary<GLTFAnimationChannelPath, AnimationCurve[]>> curves = null;
            Dictionary<string, bool> rotationIsEuler = null;

            if (needGenerate)
            {
                curves = new Dictionary<string, Dictionary<GLTFAnimationChannelPath, AnimationCurve[]>>();
                rotationIsEuler = new Dictionary<string, bool>();
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
                        rotationIsEuler.Add(path, false);
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
                // Takes into account 'localEuler', 'localEulerAnglesBaked' and 'localEulerAnglesRaw'
                else if (binding.propertyName.ToLower().Contains("localeuler"))
                {
                    if (!current.ContainsKey(GLTFAnimationChannelPath.rotation))
                    {
                        current.Add(GLTFAnimationChannelPath.rotation, new AnimationCurve[3]);
                        rotationIsEuler[path] = true;
                    }
                    if (binding.propertyName.Contains(".x"))
                        current[GLTFAnimationChannelPath.rotation][0] = curve;
                    else if (binding.propertyName.Contains(".y"))
                        current[GLTFAnimationChannelPath.rotation][1] = curve;
                    else if (binding.propertyName.Contains(".z"))
                        current[GLTFAnimationChannelPath.rotation][2] = curve;
                }
                //todo: weights
            }

            if (!needGenerate)
            {
                return targets;
            }

            
            var bufferView = CreateStreamBufferView("animation-" + anim.Name);
            int nbSamples = (int)(clip.length * 30);
            float deltaTime = clip.length / nbSamples;
            var accessors = new List<Dictionary<GLTFAnimationChannelPath, AccessorId>>();
            _animClip2Accessors.Add(clip, accessors);

            foreach (var path in curves.Keys)
            {
                var accessor = new Dictionary<GLTFAnimationChannelPath, AccessorId>();
                accessors.Add(accessor);
                float[] times = new float[nbSamples];
                Vector3[] translations = null;
                Vector3[] scales = null;
                Vector4[] rotations = null;
                foreach (var curve in curves[path])
                {
                    if (curve.Key == GLTFAnimationChannelPath.translation)
                    {
                        translations = new Vector3[nbSamples];
                    }
                    else if (curve.Key == GLTFAnimationChannelPath.scale)
                    {
                        scales = new Vector3[nbSamples];
                    }
                    else if (curve.Key == GLTFAnimationChannelPath.rotation)
                    {
                        rotations = new Vector4[nbSamples];
                    }
                }

                for (int i = 0; i < nbSamples; i += 1)
                {
                    var currentTime = i * deltaTime;
                    times[i] = currentTime;

                    if (translations != null)
                    {
                        var curve = curves[path][GLTFAnimationChannelPath.translation];
                        translations[i] = new Vector3(curve[0].Evaluate(currentTime), curve[1].Evaluate(currentTime), curve[2].Evaluate(currentTime));
                    }

                    if (scales != null)
                    {
                        var curve = curves[path][GLTFAnimationChannelPath.scale];
                        scales[i] = new Vector3(curve[0].Evaluate(currentTime), curve[1].Evaluate(currentTime), curve[2].Evaluate(currentTime));
                    }

                    if (rotations != null)
                    {
                        var curve = curves[path][GLTFAnimationChannelPath.rotation];
                        if (rotationIsEuler[path])
                        {
                            var q = Quaternion.Euler(curve[0].Evaluate(currentTime), curve[1].Evaluate(currentTime), curve[2].Evaluate(currentTime));
                            rotations[i] = new Vector4(q.x, q.y, q.z, q.w);
                        } else
                        {
                            rotations[i] = new Vector4(curve[0].Evaluate(currentTime), curve[1].Evaluate(currentTime), curve[2].Evaluate(currentTime), curve[3].Evaluate(currentTime));
                        }
                    }
                }

                if (!_animClip2TimeAccessor.ContainsKey(clip))
                {
                    var timeView = ExporterUtils.PackToBuffer(bufferView.streamBuffer, times, GLTFComponentType.Float);
                    _animClip2TimeAccessor.Add(clip, AccessorToId(timeView, bufferView));
                    timeView.Name += "-times";
                }

                AccessorId id = null;
                if (translations != null)
                {
                    id = AccessorToId(ExporterUtils.PackToBuffer(bufferView.streamBuffer, translations, GLTFComponentType.Float, (Vector3[] data, int i) => { return Utils.ConvertVector3LeftToRightHandedness(ref data[i]); }), bufferView);
                    accessor.Add(GLTFAnimationChannelPath.translation, id);
                    id.Value.Name += "-" + path + "-" + "translation";
                }

                if (scales != null)
                {
                    id = AccessorToId(ExporterUtils.PackToBuffer(bufferView.streamBuffer, scales, GLTFComponentType.Float), bufferView);
                    accessor.Add(GLTFAnimationChannelPath.scale, id);
                    id.Value.Name += "-" + path + "-" + "scales";
                }

                if (rotations != null)
                {
                    id = AccessorToId(ExporterUtils.PackToBuffer(bufferView.streamBuffer, rotations, GLTFComponentType.Float, (Vector4[] data, int i) => { return Utils.ConvertVector4LeftToRightHandedness(ref data[i]); }), bufferView);
                    accessor.Add(GLTFAnimationChannelPath.rotation, id);
                    id.Value.Name += "-" + path + "-" + "rotations";
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
