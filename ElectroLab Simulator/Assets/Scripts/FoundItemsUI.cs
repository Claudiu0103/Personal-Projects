using TMPro;
using UnityEngine;

public class FoundItemsUI : MonoBehaviour
{
    public TextMeshProUGUI text;

    public void UpdateText(int current, int total)
    {
        text.text = $"OBIECTE GĂSITE {current}/{total}";
    }
}
