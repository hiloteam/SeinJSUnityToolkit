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

namespace SeinJS
{
    public class ExportorEntry
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
        public List<Transform> bones = new List<Transform>();
        public Dictionary<Transform, Node> tr2node = new Dictionary<Transform, Node>();

        private List<EntryBufferView> _bufferViews = new List<EntryBufferView>();
		// for each mesh
		private Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>> _mesh2attrs= new Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>>();
        private Dictionary<UnityEngine.Mesh, List<Dictionary<string, AccessorId>>> _mesh2targets = new Dictionary<UnityEngine.Mesh, List<Dictionary<string, AccessorId>>>();
        private Dictionary<UnityEngine.Mesh, Dictionary<int, AccessorId>> _mesh2indices = new Dictionary<UnityEngine.Mesh, Dictionary<int, AccessorId>>();
        private Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>> _mesh2Id = new Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>>();
        // key: SeinCustomMaterial componenet or UnityMateiral InistanceID
        private Dictionary<int, MaterialId> _material2ID = new Dictionary<int, MaterialId>();
        private Dictionary<Texture2D, TextureId> _texture2d2ID = new Dictionary<Texture2D, TextureId>();

        // key: instanceId
        public static Dictionary<string, Texture2D> composedTextures = new Dictionary<string, Texture2D>();
        public static Dictionary<Texture2D, GLTF.Schema.Texture> texture2d2tex =  new Dictionary<Texture2D, GLTF.Schema.Texture>();

        public static void Init()
		{
            composedTextures.Clear();
            texture2d2tex.Clear();
		}

        public EntryBufferView CreateByteBufferView(string name, int size, int stride)
        {
            var bufferView = new EntryBufferView();
            bufferView.byteBuffer = new byte[size];
            bufferView.view.Name = name;
            bufferView.view.ByteStride = stride;
            _bufferViews.Add(bufferView);
            root.BufferViews.Add(bufferView.view);
            bufferView.id = new BufferViewId { Id = root.BufferViews.Count - 1 };

            return bufferView;
        }

        public EntryBufferView CreateStreamBufferView(string name)
        {
            var bufferView = new EntryBufferView();
            bufferView.streamBuffer = new MemoryStream();
            bufferView.view.Name = name;
            _bufferViews.Add(bufferView);
            root.BufferViews.Add(bufferView.view);
            bufferView.id = new BufferViewId { Id = root.BufferViews.Count - 1 };

            return bufferView;
        }

        public void AddExtension(string extension)
        {
            if (!root.ExtensionsUsed.Contains(extension))
            {
                root.ExtensionsUsed.Add(extension);
                root.ExtensionsRequired.Add(extension);
            }
        }

        public NodeId SaveNode(Transform tr)
        {
            var node = new Node
            {
                Name = tr.name,
                UseTRS = true,
                Translation = Utils.convertVector3LeftToRightHandedness(tr.localPosition),
                Rotation = Utils.convertQuatLeftToRightHandedness(tr.localRotation),
                Scale = Utils.convertVector3LeftToRightHandedness(tr.localScale)
            };
            root.Nodes.Add(node);
            tr2node.Add(tr, node);

            return new NodeId { Id = root.Nodes.Count - 1 };
        }

        public Pair<MeshId, bool> SaveMesh(UnityEngine.Mesh mesh, Renderer renderer)
        {
            string materialsId = "";
            foreach (var mat in renderer.sharedMaterials)
            {
                materialsId += mat.GetInstanceID();
            }

            var id = _mesh2Id[mesh][materialsId];
            if (id != null)
            {
                return new Pair<MeshId, bool>(id, false);
            }

            var m = new GLTF.Schema.Mesh();
            var attributes = GenerateAttributes(mesh);
            var targets = GenerateMorphTargets(mesh, m);
            m.Name = mesh.name;
            m.Primitives = new List<MeshPrimitive>();

            EntryBufferView indices = null;

            for (int i = 0; i < mesh.subMeshCount; i += 1)
            {
                var primitive = m.Primitives[i];
                primitive.Attributes = attributes;
                primitive.Mode = DrawMode.Triangles;
                if (targets.Count > 0)
                {
                    primitive.Targets = targets;
                }
                SavePrimitive(mesh, primitive, i, ref indices);
            }

            root.Meshes.Add(m);
            id = new MeshId { Id = root.Meshes.Count - 1 };

            return new Pair<MeshId, bool>(id, true);
        }

        private Dictionary<string, AccessorId> GenerateAttributes(UnityEngine.Mesh mesh)
        {
            if (_mesh2attrs[mesh] != null)
            {
                return _mesh2attrs[mesh];
            }

            var attrs= new Dictionary<string, AccessorId>();

            int stride = GetBufferLength(mesh);
            var bufferView = CreateByteBufferView(mesh.name, stride * mesh.vertexCount, stride);

            int offset = 0;
            attrs.Add("POSITION", PackAttrToBuffer(bufferView, mesh.vertices, offset));
            offset += 3 * 4;

            if (mesh.normals.Length > 0)
            {
                attrs.Add("NORMAL", PackAttrToBuffer(bufferView, mesh.normals, offset));
                offset += 3 * 4;
            }

            if (mesh.colors.Length > 0)
            {
                attrs.Add("COLOR", PackAttrToBuffer(bufferView, mesh.colors, offset));
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
                attrs.Add("TANGENT", PackAttrToBuffer(bufferView, mesh.tangents, offset));
                offset += 4 * 4;
            }

            if (mesh.boneWeights.Length > 0)
            {
                attrs.Add("JOINT", PackAttrToBufferShort(bufferView, ExporterUtils.BoneWeightToBoneVec4(mesh.boneWeights), offset));
                offset += 1 * 4;
                attrs.Add("WEIGHT", PackAttrToBuffer(bufferView, ExporterUtils.BoneWeightToWeightVec4(mesh.boneWeights), offset));
                offset += 4 * 4;
            }

            return attrs;
        }

        private List<Dictionary<string, AccessorId>> GenerateMorphTargets(UnityEngine.Mesh mesh, GLTF.Schema.Mesh m)
        {
            if (mesh.blendShapeCount > 0)
            {
                return new List<Dictionary<string, AccessorId>>();
            }

            if (_mesh2targets[mesh] != null)
            {
                return _mesh2targets[mesh];
            }

            var targets = new List<Dictionary<string, AccessorId>>();
            var extras = m.Extras as JObject;
            extras.Add("targetNames", new JArray());

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

            for (int i = 0; i < mesh.blendShapeCount; i += 1)
            {
                var name = mesh.GetBlendShapeName(i);
                var target = new Dictionary<string, AccessorId>();
                targets.Add(target);

                (extras["targetNames"] as JArray).Add(name);
                m.Weights.Add(mesh.GetBlendShapeFrameWeight(i, 0));

                mesh.GetBlendShapeFrameVertices(i, 0, vertices, normals, tangents);

                target.Add("POSITION", PackAttrToBuffer(bufferView, vertices, offset));
                offset += 3 * 4;

                if (mesh.normals.Length > 0)
                {
                    target.Add("NORMAL", PackAttrToBuffer(bufferView, normals, offset));
                    offset += 3 * 4;
                }

                if (mesh.tangents.Length > 0)
                {
                    target.Add("TANGENTS", PackAttrToBuffer(bufferView, tangents, offset));
                    offset += 4 * 4;
                }
            }

            return targets;
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
                stride += 1 * 4;
                stride += 4 * 4;
            }

            return stride;
        }

        private AccessorId PackAttrToBuffer<DataType>(EntryBufferView bufferView, DataType[] data, int offset)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.Float, offset, bufferView.view.ByteStride);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId PackAttrToBufferShort<DataType>(EntryBufferView bufferView, DataType[] data, int offset)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.Short, offset, bufferView.view.ByteStride);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId AccessorToId(Accessor accessor, EntryBufferView bufferView)
        {
            accessor.BufferView = bufferView.id;
            root.Accessors.Add(accessor);

            return new AccessorId { Id = root.Accessors.Count - 1 };
        }

        private void SavePrimitive(UnityEngine.Mesh mesh, MeshPrimitive primitive, int i, ref EntryBufferView bufferView)
        {
            primitive.Mode = DrawMode.Triangles;

            if (_mesh2indices[mesh][i] != null)
            {
                primitive.Indices = _mesh2indices[mesh][i];
                return;
            }

            if (bufferView == null)
            {
                bufferView = CreateStreamBufferView(mesh.name + "-primitives");
            }

            var buffer = bufferView.streamBuffer;
            primitive.Indices = AccessorToId(
                ExporterUtils.PackToBuffer(bufferView.streamBuffer, mesh.GetTriangles(i), GLTFComponentType.UnsignedShort),
                bufferView
            );
        }

        public MaterialId SaveNormalMaterial(UnityEngine.Material material)
        {
			var mat = ExporterUtils.ConvertMaterial(material, this);
			root.Materials.Add(mat);

			var id = new MaterialId { Id = root.Materials.Count - 1 };
			return id;
		}

		public MaterialId SaveComponentMaterial(SeinCustomMaterial material)
        {
            var id = new MaterialId();

            return id;
        }

        public TextureId SaveTexture(Texture2D texture, bool hasTransparency)
        {
            if (_texture2d2ID[texture] != null)
            {
                return _texture2d2ID[texture];
            }

            var id = new TextureId();

            if (texture2d2tex[texture] != null)
            {
                root.Textures.Add(texture2d2tex[texture]);
                id.Id = root.Textures.Count - 1;
                _texture2d2ID.Add(texture, id);

                return id;
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

            string format = ".png";
            if (!hasTransparency && ExporterSettings.NormalTexture.opaqueType == ENormalTextureType.JPG)
            {
                format = ".jpg";
            }

            var pathes = GetTextureOutPath(texture, format);
            var exportPath = pathes[0];
            var pathInGlTF = pathes[1];

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

            root.Images.Add(new Image { Uri = pathInGlTF });
            var imageId = new ImageId { Id = root.Images.Count - 1 };

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
            var samplerId = new SamplerId { Id = root.Samplers.Count - 1 };

            var gltfTexture = new GLTF.Schema.Texture { Source = imageId, Sampler = samplerId };
            root.Textures.Add(gltfTexture);

            id.Id = root.Textures.Count - 1;

            return id;
        }

        public TextureId SaveTextureHDR(Texture2D texture)
        {
            var id = new TextureId();

            return id;
        }

        private Texture2D TextureFlipY(Texture2D texture, Func<Color, Color> convertColor = null, Action<Texture2D> processTexture = null)
        {
            int height = texture.height;
            int width = texture.width;
            Color[] textureColors = texture.GetPixels();
            Color[] newTextureColors = new Color[height * width];

            ExporterUtils.DoActionForTexture(ref texture, tex =>
                {
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
            string assetPath = AssetDatabase.GetAssetPath(texture);
            string pathInArchive = ExporterUtils.cleanPath(Path.GetDirectoryName(assetPath).Replace("Assets/Resources/", "").Replace("Assets/", ""));
            string exportDir = ExporterSettings.Export.GetExportPath(pathInArchive);

            if (!Directory.Exists(exportDir))
            {
                Directory.CreateDirectory(exportDir);
            }

            string outputFilename = Path.GetFileNameWithoutExtension(assetPath) + format;
            outputFilename = ExporterUtils.cleanPath(outputFilename);

            string exportPath = exportDir + "/" + outputFilename;
            string pathInGltfFile = pathInArchive + "/" + outputFilename;

            return new string[] { exportPath, pathInGltfFile };
        }

        //public string SaveAudio()
        //{

        //}
    }
}
