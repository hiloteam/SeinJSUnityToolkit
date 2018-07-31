# UnityGLTFExporter
Export unity scene to gltf, forked by sketchfab/Unity-glTF-Exporter.

## Usage

Double click bin/GLTFExporter.unitypackage and import all to your project, then check the 'Topbar -> Tools -> Export to GlTF'.

## Features

1. Remove steps like logging, uploading......
2. Use original animations' name(ani1, ani2...) and meshes' name(mesh_m1, mesh_m2...) like in unity instead of hash.
3. For nodes, exported name will keep it's hierarchy(root->left1->name => node_root-left1-name) to aviod parsing error.
4. Support export lights(point, directional, spot).
