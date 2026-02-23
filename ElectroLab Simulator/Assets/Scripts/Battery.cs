using UnityEngine;

public class Battery : ElectricalComponent
{
    public float voltage = 9f;

    public override float GetVoltage() => voltage;
    public override float GetResistance() => 0f;
    void Awake()
    {
        foreach (var n in nodes)
            n.parent = this;
    }

}
