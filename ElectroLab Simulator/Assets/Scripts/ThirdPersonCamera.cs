using UnityEngine;

public class ThirdPersonCamera : MonoBehaviour
{
    public Transform target;
    public float mouseSensitivity = 3f;

    float yaw;
    float pitch = 10f;

    void Update()
    {
        yaw += Input.GetAxis("Mouse X") * mouseSensitivity;
        pitch -= Input.GetAxis("Mouse Y") * mouseSensitivity;
        pitch = Mathf.Clamp(pitch, -30f, 60f);

        transform.localRotation = Quaternion.Euler(pitch, yaw, 0);
    }

    void LateUpdate()
    {
        transform.position = target.position;
    }
}
