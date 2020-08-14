/**
 * @File   : Sein_cubeTextureExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/11/19 0:00:00AM
 */
using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections;

namespace SeinJS
{
    public class Sein_cubeTextureExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_cubeTexture"; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Global }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            Sein_cubeTextureExtension extension;

            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
            }

            if (!extensions.ContainsKey(ExtensionName))
            {
                extension = new Sein_cubeTextureExtension();
                AddExtension(extensions, extension);
            }
            else
            {
                extension = (Sein_cubeTextureExtension)extensions[ExtensionName];
            }

            var cubemap = component as Cubemap;
            var opts = options as CubeTextureSaveOptions;

            Texture2D[] faces;
            string[] origAssetPathes = new string[6];

            if (opts.textures != null)
            {
                faces = opts.textures;
                for (int j = 0; j < 6; j += 1)
                {
                    origAssetPathes[j] = AssetDatabase.GetAssetPath(faces[j]);
                    var ext = Path.GetExtension(origAssetPathes[j]);
                    origAssetPathes[j] = origAssetPathes[j].Replace(ext, "");
                }
            }
            else
            {
                if (cubemap == null)
                {
                    Utils.ThrowExcption("It seems that cubemap is not set to material!");
                }

                faces = GetCubeMapFaces(cubemap, origAssetPathes);
            }

            int i = 0;
            var images = new ImageId[6];
            foreach (var face in faces)
            {
                if (face.width != face.height)
                {
                    Utils.ThrowExcption("Cube texture face must have same width and height:" + origAssetPathes[i]);
                }

                ImageId id;
                id = entry.SaveImage(face, opts.hasTransparency, origAssetPathes[i], opts.maxSize, opts.hdrType, true);

                images[i] = id;
                i += 1;
            }

            // isImageCanRelease always be true
            extension.textures.Add(new CubeTexture { images = images, sampler = opts.sampler, isImageCanRelease = true });
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return null;
        }

        public override void Import(EditorImporter importer, Extension extension)
        {

        }

        //https://forum.unity.com/threads/specular-convolution-when-calculating-mip-maps-for-cubemap-render-texture.617680/
        private Texture2D[] GetCubeMapFaces(Cubemap srcCubemap, string[] origAssetPathes)
        {
            var result = new Texture2D[6];
            for (int i = 0; i < 6; i += 1)
            {
                result[i] = new Texture2D(srcCubemap.width, srcCubemap.height, TextureFormat.RGBAHalf, false);
            }

            var origAssetPath = AssetDatabase.GetAssetPath(srcCubemap);
            var ext = Path.GetExtension(origAssetPath);
            origAssetPath = origAssetPath.Replace(ext, "");
            var convolutionMaterial = new UnityEngine.Material(Shader.Find("Hidden/CubeCopy"));
            GL.PushMatrix();
            GL.LoadOrtho();
            var dstCubemap = new RenderTexture(srcCubemap.width, srcCubemap.height, 0, RenderTextureFormat.ARGBHalf);
            dstCubemap.dimension = UnityEngine.Rendering.TextureDimension.Cube;
            dstCubemap.volumeDepth = 6;
            dstCubemap.wrapMode = TextureWrapMode.Clamp;
            dstCubemap.filterMode = FilterMode.Trilinear;
            dstCubemap.isPowerOfTwo = true;
            dstCubemap.Create();
            // not support texture lod now
            var mip = -1;
            var dstMip = 0;
            var mipRes = srcCubemap.width;

            convolutionMaterial.SetTexture("_MainTex", srcCubemap);
            convolutionMaterial.SetFloat("_Level", mip);

            convolutionMaterial.SetPass(0);

            // Positive X
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveX);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(0, 0, 1);
            GL.End();
            result[0].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[0] = origAssetPath + "-0";

            // Negative X
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeX);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(0, 0, 1);
            GL.End();
            result[1].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[1] = origAssetPath + "-1";

            // Positive Y
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveY);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(1, 1, 1);
            GL.End();
            result[2].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[2] = origAssetPath + "-2";

            // Negative Y
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeY);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(1, 1, 1);
            GL.End();
            result[3].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[3] = origAssetPath + "-3";

            // Positive Z
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveZ);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(0, 0, 1);
            GL.End();
            result[4].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[4] = origAssetPath + "-4";

            // Negative Z
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeZ);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(1, 0, 1);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(0, 0, 1);
            GL.End();
            result[5].ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), 0, 0);
            origAssetPathes[5] = origAssetPath + "-5";

            GL.PopMatrix();

            for (int i = 0; i < 6; i += 1)
            {
                result[i].Apply();
            }

            Graphics.SetRenderTarget(null);
            UnityEngine.Object.DestroyImmediate(dstCubemap);

            return result;
        }
    }
}