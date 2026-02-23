using System.Collections.Generic;
using UnityEngine;

public class ElectricalNode : MonoBehaviour
{
    public ElectricalComponent parent;
    public List<ElectricalNode> connectedNodes = new List<ElectricalNode>();

    public void Connect(ElectricalNode other)
    {
        if (!connectedNodes.Contains(other))
            connectedNodes.Add(other);

        if (!other.connectedNodes.Contains(this))
            other.connectedNodes.Add(this);
        Debug.Log($"{name} connected to {other.name}");

    }

    /*void OnMouseDown()
    {
        WireManager.Instance.SelectNode(this);
    }*/

}
