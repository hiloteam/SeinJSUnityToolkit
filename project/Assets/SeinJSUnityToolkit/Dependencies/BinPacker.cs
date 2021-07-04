using System;
using System.IO;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace SeinJS
{
    public class BinPacker
    {
        internal class Node
        {
            public Node rightNode;
            public Node bottomNode;
            public int pos_x;
            public int pos_z;
            public int width;
            public int height;
            public bool isOccupied;
        }

        internal class Box
        {
            public int x;
            public int y;
            public int index;
            public int height;
            public int width;
            public int volume;
            public Node position;
        }

        public static Rect[] Pack(Texture2D[] texs, Texture2D atlas, int padding = 0)
        {
            var boxes = new List<Box>();
            for (int i = 0; i < texs.Length; i += 1)
            {
                var tex = texs[i];
                boxes.Add(new Box { width = tex.width + padding, height = tex.height + padding, index = i });
            }

            boxes.ForEach(x => x.volume = (x.height * x.width));
            boxes = boxes.OrderByDescending(x => x.volume).ToList();
            var rootNode = new Node { width = atlas.width, height = atlas.height };

            foreach (var box in boxes)
            {
                var node = FindNode(rootNode, box.width, box.height);
                if (node != null)
                {
                    box.x = node.pos_x;
                    box.y = node.pos_z;
                    // Split rectangles
                    box.position = SplitNode(node, box.width, box.height);
                }
                else
                {
                    return null;
                }
            }

            var rects = new Rect[texs.Length];
            foreach (var box in boxes)
            {
                var index = box.index;
                var tex = texs[index];
                var rect = rects[index] = new Rect(box.x, box.y, tex.width, tex.height);
                UnityEngine.Graphics.CopyTexture(texs[index], 0, 0, 0, 0, tex.width, tex.height, atlas, 0, 0, box.x, atlas.height - box.y - tex.height);
            }

            return rects;
        }

        private static Node FindNode(Node rootNode, int boxWidth, int boxheight)
        {
            if (rootNode.isOccupied)
            {
                var nextNode = FindNode(rootNode.bottomNode, boxWidth, boxheight);

                if (nextNode == null)
                {
                    nextNode = FindNode(rootNode.rightNode, boxWidth, boxheight);
                }

                return nextNode;
            }
            else if (boxWidth <= rootNode.width && boxheight <= rootNode.height)
            {
                return rootNode;
            }
            else
            {
                return null;
            }
        }

        private static Node SplitNode(Node node, int boxWidth, int boxheight)
        {
            node.isOccupied = true;
            node.bottomNode = new Node { pos_z = node.pos_z, pos_x = node.pos_x + boxWidth, height = node.height, width = node.width - boxWidth };
            node.rightNode = new Node { pos_z = node.pos_z + boxheight, pos_x = node.pos_x, height = node.height - boxheight, width = boxWidth };
            return node;
        }
    }
}
