using UnityEngine;
using TMPro;

public class FoundItemsManager : MonoBehaviour
{
    public static FoundItemsManager Instance;

    [Header("UI")]
    public TextMeshProUGUI foundText;

    [Header("Objects on table")]
    public GameObject bulbOnTable;
    public GameObject batteryOnTable;
    public GameObject wireOnTable1;
    public GameObject wireOnTable2;

    private int foundCount = 0;
    private const int totalCount = 3;

    void Awake()
    {
        Instance = this;
        bulbOnTable.SetActive(false);
        batteryOnTable.SetActive(false);
        wireOnTable1.SetActive(false);
        wireOnTable2.SetActive(false);
        UpdateUI();
    }

    public void Collect(string itemId)
    {
        Debug.Log("FoundItemsManager Collect: " + itemId);

        foundCount++;
        UpdateUI();

        switch (itemId)
        {
            case "bulb":
                bulbOnTable.SetActive(true);
                break;
            case "battery":
                batteryOnTable.SetActive(true);
                break;
            case "wire":
                wireOnTable1.SetActive(true);
                wireOnTable2.SetActive(true);
                break;
            default:
                Debug.LogWarning("UNKNOWN ITEM ID: " + itemId);
                break;
        }
    }


    void UpdateUI()
    {
        foundText.text = $"OBIECTE GĂSITE {foundCount}/{totalCount}";
    }
}
