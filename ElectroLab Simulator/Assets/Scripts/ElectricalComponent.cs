using UnityEngine;

public abstract class ElectricalComponent : MonoBehaviour
{
    public ElectricalNode[] nodes;  // conectare electrica

    public abstract float GetVoltage();
    public abstract float GetResistance();
}
