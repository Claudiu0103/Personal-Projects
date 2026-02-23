using UnityEngine;

public class CameraCollision : MonoBehaviour
{
    public Transform target;
    public float distance = 4f;
    public float minDistance = 1.2f;
    public float smooth = 10f;

    Vector3 direction;

    void Start()
    {
        direction = transform.localPosition.normalized;
    }

    void LateUpdate()
    {
        RaycastHit hit;

        if (Physics.Raycast(
            target.position,
            target.TransformDirection(direction),
            out hit,
            distance))
        {
            float newDist = Mathf.Clamp(hit.distance, minDistance, distance);
            transform.localPosition = Vector3.Lerp(
                transform.localPosition,
                direction * newDist,
                Time.deltaTime * smooth);
        }
        else
        {
            transform.localPosition = Vector3.Lerp(
                transform.localPosition,
                direction * distance,
                Time.deltaTime * smooth);
        }
    }
}
