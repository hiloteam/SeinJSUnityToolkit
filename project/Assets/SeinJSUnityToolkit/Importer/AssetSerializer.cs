using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.IO;
using UnityGLTF.Cache;
using UnityEditor.Animations;

namespace SeinJS
{
    public class AssetManager
    {
        // Files/Directories
        protected string _importDirectory;
        protected string _importMeshesDirectory;
        protected string _importMaterialsDirectory;
        protected string _importTexturesDirectory;
        protected string _importAnimationDirectory;
        public List<string> _generatedFiles;

        // Import data
        public List<GameObject> _createdGameObjects;
        public List<KeyValuePair<Mesh, List<Material>>> _parsedMeshData;
        public List<Material> _parsedMaterials;
        public List<Texture2D> _parsedImages;
        public List<Texture2D> _parsedTextures;
        public List<int> _usedSources;
        public AnimatorController _animatorController;
        public bool hasAnimatorExtension = false;

        private string _prefabName;

        public AssetManager(string projectDirectoryPath, string modelName = "Imported")
        {
            // Prepare hierarchy un project
            _importDirectory = projectDirectoryPath;
            Directory.CreateDirectory(_importDirectory);

            _importTexturesDirectory = Path.Combine(_importDirectory, "textures");
            Directory.CreateDirectory(_importTexturesDirectory);

            _importMeshesDirectory = Path.Combine(_importDirectory, "meshes");
            Directory.CreateDirectory(_importMeshesDirectory);

            _importMaterialsDirectory = Path.Combine(_importDirectory, "materials");
            Directory.CreateDirectory(_importMaterialsDirectory);

            _createdGameObjects = new List<GameObject>();
            _parsedMeshData = new List<KeyValuePair<Mesh, List<Material>>>();
            _parsedMaterials = new List<Material>();
            _parsedImages = new List<Texture2D>();
            _parsedTextures = new List<Texture2D>();
            _usedSources = new List<int>();
            _generatedFiles = new List<string>();

            _prefabName = modelName;
        }

        private void createAnimationDirectory()
        {
            _importAnimationDirectory = Path.Combine(_importDirectory, "animations");
            Directory.CreateDirectory(_importAnimationDirectory);
        }

        public void softClean()
        {
            _parsedMeshData.Clear();
            _parsedImages.Clear();
            _parsedTextures.Clear();
            _parsedMaterials.Clear();
            _usedSources.Clear();

            for (int i = 0; i < _createdGameObjects.Count; ++i)
            {
                Object.DestroyImmediate(_createdGameObjects[i]);
            }
            _createdGameObjects.Clear();
            AssetDatabase.Refresh(); // also triggers Resources.UnloadUnusedAssets()
        }

        public void hardClean()
        {
            softClean();

            for (int i = 0; i < _createdGameObjects.Count; ++i)
            {
                Object.DestroyImmediate(_createdGameObjects[i]);
            }

            GLTFUtils.removeFileList(_generatedFiles.ToArray());
            AssetDatabase.Refresh(); // also triggers Resources.UnloadUnusedAssets()

            // Remove directories if empty
            GLTFUtils.removeEmptyDirectory(_importMeshesDirectory);
            GLTFUtils.removeEmptyDirectory(_importTexturesDirectory);
            GLTFUtils.removeEmptyDirectory(_importMaterialsDirectory);
            GLTFUtils.removeEmptyDirectory(_importAnimationDirectory);
            _createdGameObjects.Clear();

            AssetDatabase.Refresh(); // also triggers Resources.UnloadUnusedAssets()
            GLTFUtils.removeEmptyDirectory(_importDirectory);
            AssetDatabase.Refresh(); // also triggers Resources.UnloadUnusedAssets()
        }

        public GameObject createGameObject(string name)
        {
            GameObject go = new GameObject(name);
            _createdGameObjects.Add(go);
            return go;
        }

        public void addPrimitiveMeshData(int meshIndex, UnityEngine.Mesh mesh, List<UnityEngine.Material> materiasl)
        {
            if (meshIndex >= _parsedMeshData.Count)
            {
                _parsedMeshData.Add(new KeyValuePair<Mesh, List<Material>>(mesh, materiasl));
            }
        }

        public Mesh getMesh(int nodeIndex)
        {
            return _parsedMeshData[nodeIndex].Key;
        }

        public Material[] getMaterials(int meshIndex)
        {
            return _parsedMeshData[meshIndex].Value.ToArray();
        }

        public Material getMaterial(int meshIndex, int primitiveIndex)
        {
            return _parsedMeshData[meshIndex].Value[primitiveIndex];
        }

        public UnityEngine.Material getMaterial(int index)
        {
            return _parsedMaterials[index];
        }

        public string getImportTextureDir()
        {
            return _importTexturesDirectory;
        }

        public UnityEngine.Texture2D getTexture(int index)
        {
            return _parsedTextures[index];
        }

        public void setTextureNormalMap(int index)
        {
            Texture2D texture = _parsedTextures[index];
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
            im.textureType = TextureImporterType.NormalMap;
            im.SaveAndReimport();
        }

        public void updateTexture(Texture2D texture, int imageIndex, int textureIndex)
        {
            _parsedTextures[imageIndex] = texture;
        }

        public Texture2D getOrCreateTexture(int imageIndex, int textureIndex)
        {
            if (_usedSources.Contains(imageIndex))
            {
                // Duplicate image
                string origin = AssetDatabase.GetAssetPath(_parsedImages[imageIndex]);
                string dest = Path.Combine(Path.GetDirectoryName(origin), Path.GetFileNameWithoutExtension(origin) + "_" + textureIndex + Path.GetExtension(origin));
                AssetDatabase.CopyAsset(origin, dest);
                Texture2D duplicate = AssetDatabase.LoadAssetAtPath<Texture2D>(dest);
                return duplicate;
            }
            else
            {
                _usedSources.Add(imageIndex);
                return _parsedImages[imageIndex];
            }
        }

        public void registerTexture(Texture2D texture)
        {
            _parsedTextures.Add(texture);
        }

        public string generateName(string name, int index)
        {
            return GLTFUtils.cleanName(name + "_" + index).Replace(":", "_");
        }

        public void registerImageFromData(byte[] imageData, int imageID, string imageName = "")
        {
            Texture2D texture = new Texture2D(4, 4);
            texture.name = imageName;
            texture.LoadImage(imageData);
            GL.sRGBWrite = true;
            saveTexture(GLTFTextureUtils.flipTexture(texture), imageID);
        }

        public void copyAndRegisterImageInProject(string inputImage, int imageID)
        {
            string imageName = Path.GetFileNameWithoutExtension(inputImage);
            byte[] imageData = File.ReadAllBytes(inputImage);
            bool srgb = GL.sRGBWrite;
            GL.sRGBWrite = true;
            registerImageFromData(imageData, imageID, imageName);
            GL.sRGBWrite = srgb;
        }

        // File serialization
        public Mesh saveMesh(Mesh mesh, string objectName = "Scene")
        {
            string baseName = GLTFUtils.cleanName(objectName + ".asset");
            string fullPath = Path.Combine(_importMeshesDirectory, baseName);
            string meshProjectPath = GLTFUtils.getPathProjectFromAbsolute(fullPath);

            serializeAsset(mesh, meshProjectPath, fullPath, true);
            return AssetDatabase.LoadAssetAtPath(meshProjectPath, typeof(Mesh)) as Mesh;
        }

        public Texture2D saveTexture(Texture2D texture, int index = -1, string imageName = "")
        {
            string basename = GLTFUtils.cleanName(texture.name + (index >= 0 ? "_" + index.ToString() : "") + ".png"); // Extension will be overridden
            string fullPath = Path.Combine(_importTexturesDirectory, basename);

            // Write texture
            string newAssetPath = GLTFTextureUtils.writeTextureOnDisk(texture, fullPath, true);

            // Reload as asset
            string projectPath = GLTFUtils.getPathProjectFromAbsolute(newAssetPath);
            Texture2D tex = (Texture2D)AssetDatabase.LoadAssetAtPath(projectPath, typeof(Texture2D));
            _parsedImages.Add(tex);
            return tex;
        }

        public void serializeAsset(Object asset, string projectPath, string fullPath, bool overrideFile = true)
        {
            if (overrideFile == true && File.Exists(fullPath))
            {
                File.Delete(fullPath);
                File.Delete(fullPath + ".meta");
                AssetDatabase.Refresh();
            }

            AssetDatabase.CreateAsset(asset, projectPath);
            _generatedFiles.Add(fullPath);
            AssetDatabase.Refresh();
        }

        public Material saveMaterial(Material material, int index)
        {
            string baseName = generateName(material.name.Length > 0 ? material.name.Trim() : "material", index) + ".mat";
            string materialAssetPath = Path.Combine(_importMaterialsDirectory, baseName);
            string materialProjectPath = GLTFUtils.getPathProjectFromAbsolute(materialAssetPath);

            serializeAsset(material, materialProjectPath, materialAssetPath, true);

            // Reload as asset
            return (Material)AssetDatabase.LoadAssetAtPath(materialProjectPath, typeof(Material));
        }

        public void saveAnimationClip(AnimationClip clip)
        {
            if (_importAnimationDirectory == null)
            {
                createAnimationDirectory();
            }

            var directory = GLTFUtils.getPathProjectFromAbsolute(_importAnimationDirectory);
            var path = directory + "/" + clip.name + ".anim";

            if (File.Exists(path))
            {
                int i = 1;
                while (true)
                {
                    var newDir = directory + "/" + i;
                    path = newDir + "/" + clip.name + ".anim";

                    if (!Directory.Exists(newDir))
                    {
                        Directory.CreateDirectory(newDir);
                        break;
                    }

                    if (!File.Exists(path))
                    {
                        break;
                    }
                }
            }

            AssetDatabase.CreateAsset(clip, path);
            AssetDatabase.Refresh();

            // Add animation to animator
            AnimationClip loadedClip = AssetDatabase.LoadAssetAtPath<AnimationClip>(path);
            loadedClip.wrapMode = WrapMode.Loop;
        }

        // https://docs.unity3d.com/ScriptReference/Animations.AnimatorController.html
        public void createAnimatorAsset(List<AnimationClip> clips)
        {
            string animatorname = getPrefabName(_prefabName);
            string animatorPath = GLTFUtils.getPathProjectFromAbsolute(_importAnimationDirectory + "/" + animatorname + ".controller");
            var controller = AnimatorController.CreateAnimatorControllerAtPath(animatorPath);

            foreach (var clip in clips)
            {
                Motion motion = (Motion)clip;
                controller.AddMotion(motion);
            }

            if (_animatorController == null)
            {
                _animatorController = controller;
            }
        }

        public string getPrefabName(string sceneObjectName)
        {
            return GLTFUtils.cleanName(sceneObjectName.Length > 0 ? sceneObjectName : "GlTF");
        }

        struct GameObjectAndPath
        {
            public List<string> path;
            public GameObject obj;
        }
        public GameObject savePrefab(GameObject sceneObject, string _importDirectory, bool instanciateInScene = false)
        {
            string baseName = getPrefabName(sceneObject.name) + ".prefab";
            string fullPath = Path.Combine(_importDirectory, baseName);
            string prefabPathInProject = GLTFUtils.getPathProjectFromAbsolute(fullPath);

            if (File.Exists(fullPath))
            {
                var list = new List<GameObjectAndPath>();
                var temp = new List<GameObjectAndPath> {
                    new GameObjectAndPath {
                        path = new List<string>(),
                        obj = sceneObject
                    }
                };

                var children = new List<GameObjectAndPath>();

                var prefabResPath = prefabPathInProject.Replace("Assets/Resources/", "").Replace(".prefab", "");
                GameObject originPrefab = Resources.Load(prefabResPath) as GameObject;
                // Get all children and path
                while (true)
                {
                    children.Clear();
                    temp.ForEach(item => children.Add(item));
                    temp.Clear();

                    if (children.Count == 0)
                    {
                        break;
                    }

                    foreach (GameObjectAndPath child in children)
                    {
                        list.Add(child);

                        foreach (Transform tr in child.obj.transform)
                        {
                            var obj = tr.gameObject;
                            var path = new List<string>(child.path);
                            path.Add(obj.name);
                            temp.Add(new GameObjectAndPath { path = path, obj = obj });
                        }
                    }
                }

                // 遍历并更新新prefab中物体的transform和组件
                // 最终保存新的的prefab
                // 之后重新绑定prefab
                copyComponets(originPrefab, sceneObject);
                list.RemoveAt(0);
                foreach (GameObjectAndPath child in list)
                {
                    var tr = originPrefab.transform.Find(string.Join("/", child.path.ToArray()));

                    if (tr == null)
                    {
                        continue;
                    }

                    var origObj = tr.gameObject;
                    var obj = child.obj;

                    copyComponets(origObj, obj);
                }

                File.Delete(fullPath);
                File.Delete(fullPath + ".meta");
                AssetDatabase.Refresh();
            }

            if (_animatorController != null)
            {
                var animator = sceneObject.GetComponent<Animator>();

                if (animator == null && !hasAnimatorExtension)
                {
                    animator = sceneObject.AddComponent<Animator>();
                    animator.runtimeAnimatorController = _animatorController;
                }
            }

            _generatedFiles.Add(fullPath);
            return PrefabUtility.CreatePrefab(prefabPathInProject, sceneObject);
        }

        private void copyComponets(GameObject origObj, GameObject obj)
        {
            var allComponents = new List<Component>(origObj.GetComponents<Component>());
            foreach (Component comp in allComponents)
            {
                var t = comp.GetType();

                if (obj.GetComponent(t) != null)
                {
                    continue;
                }

                try
                {
                    UnityEditorInternal.ComponentUtility.CopyComponent(comp);
                    UnityEditorInternal.ComponentUtility.PasteComponentAsNew(obj);
                }
                catch (System.Exception error)
                {
                    Debug.Log(error);
                    continue;
                }
            }
        }
    }
}
