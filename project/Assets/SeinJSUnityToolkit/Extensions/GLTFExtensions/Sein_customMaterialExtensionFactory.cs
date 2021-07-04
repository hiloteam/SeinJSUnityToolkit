/**
 * @File   : KHR_materials_unlit.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/08 0:00:00AM
 */
using System;
using System.Collections.Generic;
using System.IO;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEditor;
using UnityEngine;

namespace SeinJS
{
    public class Sein_customMaterialExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_customMaterial"; }
        public override List<Type> GetBindedComponents() { return new List<Type>(); }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Material, EExtensionType.Node }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var material = component as SeinCustomMaterial;
            var extension = new Sein_customMaterialExtension();

            if (material.matScriptPath != null)
            {
                if (entry.root.Extensions == null)
                {
                    entry.root.Extensions = new Dictionary<string, Extension>();
                }

                Sein_customMaterialExtension globalExtension;
                if (!entry.root.Extensions.ContainsKey(ExtensionName))
                {
                    globalExtension = new Sein_customMaterialExtension { matScripts = new List<string>() };
                    AddExtension(entry.root.Extensions, globalExtension);
                }
                else
                {
                    globalExtension = (Sein_customMaterialExtension)entry.root.Extensions[ExtensionName];
                }

                var pathes = ExporterUtils.GetAssetOutPath(material.matScriptPath);
                var exportPath = pathes[0];
                var pathInGlTF = pathes[1];

                if (!File.Exists(exportPath))
                {
                    FileUtil.CopyFileOrDirectory(material.matScriptPath, exportPath);
                }

                globalExtension.matScripts.Add(pathInGlTF);
            }

            extension.className = material.className;
            extension.cloneForInst = material.cloneForInst;
            extension.renderOrder = material.renderOrder;
            extension.transparent = material.transparent;
            extension.customOptions = material.customOptions;
            extension.uniformsColor = material.uniformsColor;
            extension.uniformsTexture = material.uniformsTexture;
            extension.uniformsCubeTexture = material.uniformsCubeTexture;
            extension.uniformsFloat = material.uniformsFloat;
            extension.uniformsFloatVec2 = material.uniformsFloatVec2;
            extension.uniformsFloatVec3 = material.uniformsFloatVec3;
            extension.uniformsFloatVec4 = material.uniformsFloatVec4;
            extension.uniformsFloatMat2 = material.uniformsFloatMat2;
            extension.uniformsFloatMat3 = material.uniformsFloatMat3;
            extension.uniformsFloatMat4 = material.uniformsFloatMat4;
            extension.uniformsInt = material.uniformsInt;
            extension.uniformsIntVec2 = material.uniformsIntVec2;
            extension.uniformsIntVec3 = material.uniformsIntVec3;
            extension.uniformsIntVec4 = material.uniformsIntVec4;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_customMaterialExtension();

            if (extensionToken != null)
            {
                extension.className = (string)extensionToken.Value["className"];
                if (extensionToken.Value["renderOrder"] != null)
                {
                    extension.renderOrder = (int)extensionToken.Value["renderOrder"];
                }
                if (extensionToken.Value["cloneForInst"] != null)
                {
                    extension.cloneForInst = (bool)extensionToken.Value["cloneForInst"];
                }
                if (extensionToken.Value["options"] != null)
                {
                    var opts = (JObject)extensionToken.Value["options"];
                    var customOptions = new List<SeinMaterialCustomOption>();

                    foreach (var pair in opts) {
                        customOptions.Add(new SeinMaterialCustomOption { name = pair.Key, value = (string)pair.Value });
                    }

                    extension.customOptions = customOptions.ToArray();
                }

                if (extensionToken.Value["uniforms"] != null)
                {
                    var uniforms = (JObject)extensionToken.Value["uniforms"];
                    var uniformsTexture = new List<SeinMaterialUniformTexture>();
                    var uniformsCubeTexture = new List<SeinMaterialUniformCubeTexture>();
                    var uniformsFloat = new List<SeinMaterialUniformFloat>();
                    var uniformsFloatVec2 = new List<SeinMaterialUniformFloatVec2>();
                    var uniformsFloatVec3 = new List<SeinMaterialUniformFloatVec3>();
                    var uniformsFloatVec4 = new List<SeinMaterialUniformFloatVec4>();
                    var uniformsColor = new List<SeinMaterialUniformColor>();
                    var uniformsFloatMat2 = new List<SeinMaterialUniformFloatMat2>();
                    var uniformsFloatMat3 = new List<SeinMaterialUniformFloatMat3>();
                    var uniformsFloatMat4 = new List<SeinMaterialUniformFloatMat4>();
                    var uniformsInt = new List<SeinMaterialUniformInt>();
                    var uniformsIntVec2 = new List<SeinMaterialUniformIntVec2>();
                    var uniformsIntVec3 = new List<SeinMaterialUniformIntVec3>();
                    var uniformsIntVec4 = new List<SeinMaterialUniformIntVec4>();

                    foreach (var pair in uniforms)
                    {
                        var name = pair.Key;
                        var uniform = pair.Value;
                        var typex = uniform.Value<int>("type");
                        var type = (ESeinMaterialUniformType)typex;

                        switch (type)
                        {
                            case (ESeinMaterialUniformType.FLOAT):
                                uniformsFloat.Add(new SeinMaterialUniformFloat { name = name, value = uniform.Value<float>("value") });
                                break;
                            case (ESeinMaterialUniformType.INT):
                                uniformsInt.Add(new SeinMaterialUniformInt { name = name, value = uniform.Value<int>("value") });
                                break;
                            case (ESeinMaterialUniformType.SAMPLER_2D):
                                var tex = (int)uniform.Value<JObject>("value")["index"];
                                uniformsTexture.Add(new SeinMaterialUniformTexture { name = name, id = new TextureId { Id = tex, Root = root } });
                                break;
                            // todo: support cubemap
                            case (ESeinMaterialUniformType.SAMPLER_CUBE):
                                break;
                            case (ESeinMaterialUniformType.INT_VEC2):
                                var iv2 = uniform.Value<JArray>("value");
                                uniformsIntVec2.Add(new SeinMaterialUniformIntVec2 { name = name, value = new Vector2Int((int)iv2[0], (int)iv2[1]) });
                                break;
                            case (ESeinMaterialUniformType.INT_VEC3):
                                var iv3 = uniform.Value<JArray>("value");
                                uniformsIntVec3.Add(new SeinMaterialUniformIntVec3 { name = name, value = new Vector3Int((int)iv3[0], (int)iv3[1], (int)iv3[2]) });
                                break;
                            case (ESeinMaterialUniformType.INT_VEC4):
                                var iv4 = uniform.Value<JArray>("value");
                                uniformsIntVec4.Add(new SeinMaterialUniformIntVec4 { name = name, value = new Vector4((int)iv4[0], (int)iv4[1], (int)iv4[2], (int)iv4[3]) });
                                break;
                            case (ESeinMaterialUniformType.FLOAT_VEC2):
                                var fv2 = uniform.Value<JArray>("value");
                                uniformsFloatVec2.Add(new SeinMaterialUniformFloatVec2 { name = name, value = new Vector2((float)fv2[0], (float)fv2[1]) });
                                break;
                            case (ESeinMaterialUniformType.FLOAT_VEC3):
                                var fv3 = uniform.Value<JArray>("value");
                                uniformsFloatVec3.Add(new SeinMaterialUniformFloatVec3 { name = name, value = new Vector3((float)fv3[0], (float)fv3[1], (float)fv3[2]) });
                                break;
                            case (ESeinMaterialUniformType.FLOAT_VEC4):
                                var fv4 = uniform.Value<JArray>("value");
                                if (uniform.Value<bool>("isColor"))
                                {
                                    var value = Utils.ImportColor(new Color((float)fv4[0], (float)fv4[1], (float)fv4[2], (float)fv4[3]));
                                    uniformsColor.Add(new SeinMaterialUniformColor { name = name, value = value });
                                } else
                                {
                                    uniformsFloatVec4.Add(new SeinMaterialUniformFloatVec4 { name = name, value = new Vector4((float)fv4[0], (float)fv4[1], (float)fv4[2], (float)fv4[3]) });
                                }
                                
                                break;
                            case (ESeinMaterialUniformType.FLOAT_MAT2):
                                var fm2 = uniform.Value<JArray>("value");
                                var vm2 = new Matrix4x4();
                                vm2.m00 = (float)fm2[0];
                                vm2.m01 = (float)fm2[1];
                                vm2.m10 = (float)fm2[2];
                                vm2.m11 = (float)fm2[3];
                                uniformsFloatMat2.Add(new SeinMaterialUniformFloatMat2 { name = name, value = vm2 });
                                break;
                            case (ESeinMaterialUniformType.FLOAT_MAT3):
                                var fm3 = uniform.Value<JArray>("value");
                                var vm3 = new Matrix4x4();
                                vm3.m00 = (float)fm3[0];
                                vm3.m01 = (float)fm3[1];
                                vm3.m02 = (float)fm3[2];
                                vm3.m10 = (float)fm3[3];
                                vm3.m11 = (float)fm3[4];
                                vm3.m12 = (float)fm3[5];
                                vm3.m20 = (float)fm3[6];
                                vm3.m21 = (float)fm3[7];
                                vm3.m22 = (float)fm3[8];
                                uniformsFloatMat3.Add(new SeinMaterialUniformFloatMat3 { name = name, value = vm3 });
                                break;
                            case (ESeinMaterialUniformType.FLOAT_MAT4):
                                var fm4 = uniform.Value<JArray>("value");
                                uniformsFloatMat4.Add(new SeinMaterialUniformFloatMat4
                                {
                                    name = name,
                                    value = new Matrix4x4(
                                        new Vector4((float)fm4[0], (float)fm4[4], (float)fm4[8], (float)fm4[12]),
                                        new Vector4((float)fm4[1], (float)fm4[5], (float)fm4[9], (float)fm4[13]),
                                        new Vector4((float)fm4[2], (float)fm4[6], (float)fm4[10], (float)fm4[14]),
                                        new Vector4((float)fm4[3], (float)fm4[7], (float)fm4[11], (float)fm4[15])
                                    )
                                });
                                break;
                            default:
                                break;
                        }
                    }

                    extension.uniformsColor = uniformsColor.ToArray();
                    extension.uniformsTexture = uniformsTexture.ToArray();
                    extension.uniformsCubeTexture = uniformsCubeTexture.ToArray();
                    extension.uniformsFloat = uniformsFloat.ToArray();
                    extension.uniformsFloatVec2 = uniformsFloatVec2.ToArray();
                    extension.uniformsFloatVec3 = uniformsFloatVec3.ToArray();
                    extension.uniformsFloatVec4 = uniformsFloatVec4.ToArray();
                    extension.uniformsFloatMat2 = uniformsFloatMat2.ToArray();
                    extension.uniformsFloatMat3 = uniformsFloatMat3.ToArray();
                    extension.uniformsFloatMat4 = uniformsFloatMat4.ToArray();
                    extension.uniformsInt = uniformsInt.ToArray();
                    extension.uniformsIntVec2 = uniformsIntVec2.ToArray();
                    extension.uniformsIntVec3 = uniformsIntVec3.ToArray();
                    extension.uniformsIntVec4 = uniformsIntVec4.ToArray();
                }
            }

            return extension;
        }

        public override void Import(EditorImporter importer, UnityEngine.Material material, GLTF.Schema.Material gltfMat, Extension extension)
        {
            var mat = (Sein_customMaterialExtension)extension;
            var className = "Sein/" + mat.className;
            var shader = Shader.Find(className);

            var alphaMode = gltfMat.AlphaMode;
            if (alphaMode == AlphaMode.BLEND)
            {
                mat.transparent = true;
            }
            else if (alphaMode == AlphaMode.MASK)
            {
                mat.transparent = true;
            }

            if (shader == null)
            {
                shader = Shader.Find(className.Replace("Material", ""));
            }

            if (shader == null)
            {
                mat.material = material;
                mat.isComponent = true;
                return;
            }

            material.shader = shader;
            if (material.HasProperty("cloneForInst"))
            {
                material.SetInt("cloneForInst", 1);
            }
            
            material.SetInt("_Mode", (int)alphaMode);
            material.SetFloat("_Cutoff", (float)gltfMat.AlphaCutoff);

            WriteUiforms(importer, material, mat.uniformsTexture);
            WriteUiforms(importer, material, mat.uniformsCubeTexture);
            WriteUiforms(importer, material, mat.uniformsFloat);
            WriteUiforms(importer, material, mat.uniformsFloatVec2);
            WriteUiforms(importer, material, mat.uniformsFloatVec3);
            WriteUiforms(importer, material, mat.uniformsFloatVec4);
            WriteUiforms(importer, material, mat.uniformsColor);
            WriteUiforms(importer, material, mat.uniformsFloatMat2);
            WriteUiforms(importer, material, mat.uniformsFloatMat3);
            WriteUiforms(importer, material, mat.uniformsFloatMat4);
            WriteUiforms(importer, material, mat.uniformsInt);
            WriteUiforms(importer, material, mat.uniformsIntVec2);
            WriteUiforms(importer, material, mat.uniformsIntVec3);
            WriteUiforms(importer, material, mat.uniformsIntVec4);
        }

        private void WriteUiforms<TValue>(EditorImporter importer, UnityEngine.Material material, SeinMaterialUniform<TValue>[] uniforms) {
            foreach (SeinMaterialUniform<TValue> uniform in uniforms)
            {
                var name = uniform.name;
                switch (uniform.type)
                {
                    case (ESeinMaterialUniformType.FLOAT):
                        material.SetFloat(name, (uniform as SeinMaterialUniformFloat).value);
                        break;
                    case (ESeinMaterialUniformType.INT):
                        material.SetInt(name, (uniform as SeinMaterialUniformInt).value);
                        break;
                    case (ESeinMaterialUniformType.SAMPLER_2D):
                        var tex = importer.GetTexture((uniform as SeinMaterialUniformTexture).id.Id);
                        material.SetTexture(name, tex);
                        break;
                    // todo: support cubemap
                    case (ESeinMaterialUniformType.SAMPLER_CUBE):
                        break;
                    case (ESeinMaterialUniformType.FLOAT_VEC2):
                        var fv2 = (uniform as SeinMaterialUniformFloatVec2).value;
                        material.SetFloatArray(name, new List<float> { fv2.x, fv2.y });
                        break;
                    case (ESeinMaterialUniformType.FLOAT_VEC3):
                        var fv3 = (uniform as SeinMaterialUniformFloatVec3).value;
                        material.SetFloatArray(name, new List<float> { fv3.x, fv3.y, fv3.z });
                        break;
                    case (ESeinMaterialUniformType.FLOAT_VEC4):
                        if (uniform.GetType() == typeof(SeinMaterialUniformColor))
                        {
                            material.SetColor(name, (uniform as SeinMaterialUniformColor).value);
                        }
                        material.SetVector(name, (uniform as SeinMaterialUniformFloatVec4).value);
                        break;
                    case (ESeinMaterialUniformType.FLOAT_MAT2):
                        material.SetMatrix(name, (uniform as SeinMaterialUniformFloatMat2).value);
                        break;
                    case (ESeinMaterialUniformType.FLOAT_MAT3):
                        material.SetMatrix(name, (uniform as SeinMaterialUniformFloatMat3).value);
                        break;
                    case (ESeinMaterialUniformType.FLOAT_MAT4):
                        material.SetMatrix(name, (uniform as SeinMaterialUniformFloatMat4).value);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
