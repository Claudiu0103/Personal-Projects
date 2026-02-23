using UnityEngine;

public class LightBulb : ElectricalComponent
{
    [Header("Electrical")]
    public float resistance = 50f;

    [Header("Visuals")]
    public Light bulbLight;
    public Renderer bulbRenderer;
    public Material offMaterial;
    public Material onMaterial;

    private bool isOn = false;

    public override float GetVoltage() => 0f;
    public override float GetResistance() => resistance;

    void Awake()
    {
        foreach (var n in nodes)
            n.parent = this;

        if (bulbRenderer == null)
            bulbRenderer = GetComponentInChildren<Renderer>();

        SetOff();
    }

    public void SetBrightness(float current)
    {
        bool shouldBeOn = current > 0.01f;

        if (shouldBeOn && !isOn)
            SetOn();
        else if (!shouldBeOn && isOn)
            SetOff();

        bulbLight.intensity = Mathf.Clamp(current * 2f, 0f, 5f);
    }

    void SetOn()
    {
        isOn = true;
        bulbRenderer.material = onMaterial;
    }

    void SetOff()
    {
        isOn = false;
        bulbRenderer.material = offMaterial;
        bulbLight.intensity = 0f;
    }
}
