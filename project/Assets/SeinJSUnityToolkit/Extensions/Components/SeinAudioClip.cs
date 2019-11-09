using UnityEngine;

public enum ESeinAudioClipMode
{
    Stream,
    Buffer
}

[CreateAssetMenu(fileName = "SeinAudioClip", menuName = "Sein/AudioClip")]
public class SeinAudioClip : ScriptableObject
{
    public ESeinAudioClipMode mode = ESeinAudioClipMode.Stream;
    public AudioClip clip;
    public bool isLazy = true;
}
