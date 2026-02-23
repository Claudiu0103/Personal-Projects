using UnityEngine;

public class Resistor : ElectricalComponent
{
    public float resistance = 100f;

    public override float GetVoltage() => 0f;
    public override float GetResistance() => resistance;
}
