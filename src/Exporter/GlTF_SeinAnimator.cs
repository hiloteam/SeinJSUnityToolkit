using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_SeinAnimator : GlTF_Writer
{
    public SeinAnimator animator;

    public override void Write()
    {
        var modelAnimations = RemoveDuplicates(animator.modelAnimations);

        jsonWriter.Write("\"" + SeinAnimator.extensionName + "\": {\n");
        IndentIn();
        if (animator.prefix != null && animator.prefix != "")
        {
            Indent();
            jsonWriter.Write("\"prefix\": \"" + animator.prefix + "\",\n");
        }
        Indent();
        jsonWriter.Write("\"defaultAnimation\": \"" + animator.defaultAnimation + "\",\n");
        Indent();
        jsonWriter.Write("\"modelAnimations\": [\n");
        IndentIn();

        var length = modelAnimations.Length;
        int index = 0;
        foreach (var clip in modelAnimations)
        {
            Indent();
            jsonWriter.Write("\"" + clip + (index == length - 1 ? "\"\n" : "\",\n"));
            index += 1;
        }
        IndentOut();
        Indent();
        jsonWriter.Write("]\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
    }

    private static string[] RemoveDuplicates(string[] s)
    {
        HashSet<string> set = new HashSet<string>(s);
        string[] result = new string[set.Count];
        set.CopyTo(result);
        return result;
    }
}