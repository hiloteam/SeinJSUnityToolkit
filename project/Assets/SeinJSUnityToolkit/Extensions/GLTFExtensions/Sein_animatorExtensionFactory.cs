/**
 * @File   : Sein_animatorExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;
using UnityEditor.Animations;
using System.IO;
using UnityEditor;

namespace SeinJS
{
    public class Sein_animatorExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_animator"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinAnimator) }; }

        public static Dictionary<string, AnimationClip> IMPORTED_CLIPS = new Dictionary<string, AnimationClip>();
        public static Dictionary<string, AnimatorController> IMPORTED_CONTROLLERS = new Dictionary<string, AnimatorController>();

        public override void BeforeImport()
        {
            IMPORTED_CLIPS.Clear();
            IMPORTED_CONTROLLERS.Clear();
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var animator = component as SeinAnimator;
            var extension = new Sein_animatorExtension();

            extension.name = animator.name;
            extension.prefixes = animator.prefixes;
            extension.defaultAnimation = animator.defaultAnimation;
            extension.modelAnimations = animator.modelAnimations;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_animatorExtension();

            if (extensionToken != null)
            {
                extension.defaultAnimation = (string)extensionToken.Value["defaultAnimation"];
                extension.modelAnimations = extensionToken.Value["modelAnimations"].ToObject<string[]>();
                if (extensionToken.Value["prefix"] != null)
                {
                    extension.prefix = (string)extensionToken.Value["prefix"];
                }
                if (extensionToken.Value["prefixes"] != null)
                {
                    extension.prefixes = extensionToken.Value["prefixes"].ToObject<string[]>();
                }
                if (extensionToken.Value["name"] != null)
                {
                    extension.name = (string)extensionToken.Value["name"];
                }
            }

            var list = new List<string>(extension.modelAnimations);
            var hasDefault = extension.defaultAnimation != null && extension.defaultAnimation != "" && list.Contains(extension.defaultAnimation);
            
            if (hasDefault)
            {
                list.Remove(extension.defaultAnimation);
            }

            Array.Sort(extension.modelAnimations);

            if (hasDefault)
            {
                list.Insert(0, extension.defaultAnimation);
            }

            return extension;
        }

        public override void Import(EditorImporter importer, GameObject gameObject, Node gltfNode, Extension extension)
        {
            var seinAnimator = (Sein_animatorExtension)extension;
            var id = "";

            for (var i = 0; i < seinAnimator.modelAnimations.Length; i += 1)
            {
                var prefix = (seinAnimator.prefixes != null && seinAnimator.prefixes.Length > i) ? seinAnimator.prefixes[i] : seinAnimator.prefix;
                var name = seinAnimator.modelAnimations[i];

                if (prefix != null && prefix.Length > 0)
                {
                    id += prefix + "@" + name;
                } else
                {
                    id += name;
                }
            }

            AnimatorController controller;
            if (IMPORTED_CONTROLLERS.ContainsKey(id))
            {
                controller = IMPORTED_CONTROLLERS[id];
            } else
            {
                var controllerName = seinAnimator.name != null && seinAnimator.name != "" ? seinAnimator.name : gameObject.name;
                var controllerPath = Path.Combine(new string[] { importer.importDirectoryPath, "animations", controllerName + ".controller" });
                if (File.Exists(controllerPath))
                {
                    int index = 1;
                    while (true)
                    {
                        controllerPath = Path.Combine(new string[] { importer.importDirectoryPath, "animations", controllerName + "-" + index +".controller" });

                        if (!File.Exists(controllerPath))
                        {
                            break;
                        }
                    }
                }

                controller = AnimatorController.CreateAnimatorControllerAtPath(GLTFUtils.getPathProjectFromAbsolute(controllerPath));

                for (var i = 0; i < seinAnimator.modelAnimations.Length; i += 1)
                {
                    var prefix = (seinAnimator.prefixes != null && seinAnimator.prefixes.Length > i) ? seinAnimator.prefixes[i] : seinAnimator.prefix;
                    var name = seinAnimator.modelAnimations[i];

                    if (prefix != null && prefix.Length > 0)
                    {
                        name = prefix + "@" + name;
                    }

                    if (!IMPORTED_CLIPS.ContainsKey(name))
                    {
                        continue;
                    }

                    var clip = IMPORTED_CLIPS[name];
                    controller.AddMotion((Motion)clip);

                    var nodePath = AnimationUtility.CalculateTransformPath(gameObject.transform, importer.sceneObject.transform);
                    var temp = new List<Temp>();
                    foreach (var binding in AnimationUtility.GetCurveBindings(clip))
                    {
                        var path = binding.path;
                        var realPath = path.Substring(nodePath.Length);
                        var propertyName = binding.propertyName;
                        var type = binding.type;
                        var curve = AnimationUtility.GetEditorCurve(clip, binding);

                        temp.Add(new Temp { path = realPath, propertyName = propertyName, type = type, curve = curve });
                    }

                    clip.ClearCurves();

                    foreach (var binding in temp)
                    {
                        clip.SetCurve(binding.path, binding.type, binding.propertyName, binding.curve);
                    }
                }
            }

            var animator = gameObject.AddComponent<Animator>();
            animator.runtimeAnimatorController = controller;
        }

        struct Temp
        {
            public string path;
            public string propertyName;
            public Type type;
            public AnimationCurve curve;
        }
    }
}
