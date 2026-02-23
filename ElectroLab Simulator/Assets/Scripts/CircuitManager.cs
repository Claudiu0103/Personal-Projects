using System.Collections.Generic;
using UnityEngine;

public class CircuitManager : MonoBehaviour
{
    public List<Battery> batteries;
    public List<LightBulb> bulbs;
    public QuestionUI questionUI;
    private bool gameFinished = false;

    void Awake()
    {
        // găsește AUTOMAT tot
        batteries = new List<Battery>(
            FindObjectsByType<Battery>(FindObjectsSortMode.None));

        bulbs = new List<LightBulb>(
            FindObjectsByType<LightBulb>(FindObjectsSortMode.None));


        Debug.Log($"[CircuitManager] Found {batteries.Count} batteries, {bulbs.Count} bulbs");
    }

    void Update()
    {
        foreach (var bulb in bulbs)
        {
            bool powered = false;
            Battery poweringBattery = null;

            // verificăm fiecare baterie
            foreach (var battery in batteries)
            {
                if (IsBulbPowered(battery, bulb))
                {
                    powered = true;
                    poweringBattery = battery;
                    break;
                }
            }

            if (powered && poweringBattery != null)
            {
                float current = poweringBattery.GetVoltage() / bulb.GetResistance();
                bulb.SetBrightness(current);
                if (!gameFinished)
                {
                    gameFinished = true;
                    EndGame();
                }

            }
            else
            {
                bulb.SetBrightness(0f);
            }
        }
    }

    bool IsBulbPowered(Battery battery, LightBulb bulb)
    {
        if (battery.nodes.Length < 2 || bulb.nodes.Length < 2)
            return false;

        return
            (IsConnected(battery.nodes[0], bulb.nodes[0], new HashSet<ElectricalNode>()) &&
             IsConnected(battery.nodes[1], bulb.nodes[1], new HashSet<ElectricalNode>()))
         ||
            (IsConnected(battery.nodes[0], bulb.nodes[1], new HashSet<ElectricalNode>()) &&
             IsConnected(battery.nodes[1], bulb.nodes[0], new HashSet<ElectricalNode>()));
    }

    bool IsConnected(ElectricalNode start, ElectricalNode target, HashSet<ElectricalNode> visited)
    {
        if (start == target)
            return true;

        visited.Add(start);

        foreach (var next in start.connectedNodes)
        {
            if (!visited.Contains(next))
            {
                if (IsConnected(next, target, visited))
                    return true;
            }
        }

        return false;
    }

    void EndGame()
    {
        questionUI.ShowFinalMessage(
            "  Felicitări!\n\n" +
            "Ai reușit să construiești corect circuitul electric.\n\n" +
            "  Bateria furnizează energie\n" +
            "  Firele transportă curentul\n" +
            "  Becul se aprinde\n\n" +
            "Ai terminat jocul!",
            4f,
            null
        );
    }

}
