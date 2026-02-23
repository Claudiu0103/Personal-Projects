using UnityEngine;
using UnityEngine.InputSystem;

public class NodeClickHandler : MonoBehaviour
{
    [SerializeField] private Camera cam;
    [SerializeField] private QuestionUI questionUI; // 👈 ADĂUGAT

    void Awake()
    {
        if (cam == null) cam = Camera.main;
        Debug.Log("[NodeClickHandler] Ready");
    }

    void Update()
    {
        if (Mouse.current == null) return;
        if (!Mouse.current.leftButton.wasPressedThisFrame) return;

        Debug.Log("CLICK!");

        Ray ray = cam.ScreenPointToRay(Mouse.current.position.ReadValue());

        if (!Physics.Raycast(ray, out RaycastHit hit, 200f))
        {
            Debug.Log("Hit NOTHING");
            return;
        }

        Debug.Log($"Hit: {hit.collider.name}");

        // 🔹 1️⃣ PRIORITATE: CollectibleItem
        CollectibleItem collectible =
            hit.collider.GetComponentInParent<CollectibleItem>();

        if (collectible != null)
        {
            Debug.Log("Clicked CollectibleItem: " + collectible.name);

            collectible.AskQuestion(); // ✅ AICI apare panelul
            return; // ⛔ nu mai merge spre noduri
        }

        // 🔹 2️⃣ ElectricalNode (fire)
        ElectricalNode node =
            hit.collider.GetComponentInParent<ElectricalNode>() ??
            hit.collider.GetComponentInChildren<ElectricalNode>() ??
            hit.collider.transform.parent?.GetComponentInChildren<ElectricalNode>();

        if (node == null)
        {
            Debug.Log("Hit object but no CollectibleItem or ElectricalNode");
            return;
        }

        Debug.Log("Clicked node: " + node.name);
        WireManager.Instance.SelectNode(node);
    }
}
