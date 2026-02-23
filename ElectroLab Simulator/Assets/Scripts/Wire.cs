using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class Wire : MonoBehaviour
{
    public LineRenderer lineRenderer;

    private ElectricalNode nodeA;
    private ElectricalNode nodeB;

    [Header("Wire Visuals")]
    public float wireWidth = 0.05f;

    void Awake()
    {
        lineRenderer = GetComponent<LineRenderer>();
        lineRenderer.positionCount = 2;
        lineRenderer.useWorldSpace = true;
        lineRenderer.startWidth = wireWidth;
        lineRenderer.endWidth = wireWidth;
    }

    public void Init(ElectricalNode a, ElectricalNode b)
    {
        nodeA = a;
        nodeB = b;

        // conexiune electrică
        a.Connect(b);

        UpdateWirePositions();
    }

    void Update()
    {
        if (nodeA != null && nodeB != null)
            UpdateWirePositions();
    }

    void UpdateWirePositions()
    {
        lineRenderer.SetPosition(0, nodeA.transform.position);
        lineRenderer.SetPosition(1, nodeB.transform.position);
    }
}
