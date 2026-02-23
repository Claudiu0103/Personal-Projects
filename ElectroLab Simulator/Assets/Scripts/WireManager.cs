using UnityEngine;
using System.Collections.Generic;

public class WireManager : MonoBehaviour
{
    public static WireManager Instance;

    public GameObject wirePrefab;
    public GameObject wireOnTable1;
    public GameObject wireOnTable2;
    private int wiresOnTable = 0;
    private ElectricalNode firstNode;

    // 🔌 ținem evidența firelor existente
    private Dictionary<(ElectricalNode, ElectricalNode), Wire> wires =
        new Dictionary<(ElectricalNode, ElectricalNode), Wire>();

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
    }

    public void SelectNode(ElectricalNode node)
    {
        // 1️⃣ primul click
        if (firstNode == null)
        {
            firstNode = node;
            Debug.Log("First node selected: " + node.name);
            return;
        }

        // 2️⃣ dacă dai click din nou pe același nod → anulare
        if (node == firstNode)
        {
            firstNode = null;
            Debug.Log("Selection cancelled");
            return;
        }

        // 3️⃣ verificăm dacă firul există deja → îl ștergem
        if (HasWire(firstNode, node))
        {
            RemoveWire(firstNode, node);
            firstNode = null;
            return;
        }

        // 4️⃣ altfel → creăm fir nou
        CreateWire(firstNode, node);
        firstNode = null;
    }

    void CreateWire(ElectricalNode a, ElectricalNode b)
    {
        GameObject go = Instantiate(wirePrefab);
        Wire wire = go.GetComponent<Wire>();
        wire.Init(a, b);

        wires[(a, b)] = wire;
        wires[(b, a)] = wire; // bidirecțional

        if(wiresOnTable == 0)
        {
            wiresOnTable++;
            wireOnTable1.SetActive(false);
        }
        else if(wiresOnTable == 1)
        {
            wiresOnTable++;
            wireOnTable2.SetActive(false);
        }
        Debug.Log($"Wire created between {a.name} and {b.name}");
    }

    void RemoveWire(ElectricalNode a, ElectricalNode b)
    {
        if (!wires.TryGetValue((a, b), out Wire wire))
            return;

        Destroy(wire.gameObject);

        wires.Remove((a, b));
        wires.Remove((b, a));

        a.connectedNodes.Remove(b);
        b.connectedNodes.Remove(a);

        Debug.Log($"Wire removed between {a.name} and {b.name}");
    }

    bool HasWire(ElectricalNode a, ElectricalNode b)
    {
        return wires.ContainsKey((a, b));
    }
}
