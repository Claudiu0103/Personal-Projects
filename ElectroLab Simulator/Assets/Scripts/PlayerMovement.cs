using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class PlayerMovement : MonoBehaviour
{
    [Header("Movement")]
    public float speed = 5f;
    public float gravity = -9.81f;

    [Header("Mouse Look")]
    public Transform cameraPivot;
    public float mouseSensitivity = 2.5f;
    public float minY = -40f;
    public float maxY = 70f;
    private bool mouseLookEnabled = false;

    private float xRotation = 0f;
    private CharacterController controller;
    private Vector3 velocity;

    private Animator animator;

    void Start()
    {
        controller = GetComponent<CharacterController>();
        animator = GetComponentInChildren<Animator>();

        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }


    void Update()
    {
        // ESC → eliberează mouse-ul (pentru click)
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            mouseLookEnabled = false;
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }

        // CLICK DREAPTA → control cameră (FPS)
        if (Input.GetMouseButtonDown(1))
        {
            mouseLookEnabled = true;
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        if (mouseLookEnabled)
            HandleMouseLook();

        HandleMovement();
    }


    // 🖱️ ROTIRE CAMERĂ + PLAYER
    void HandleMouseLook()
    {
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * 100f * Time.deltaTime;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * 100f * Time.deltaTime;

        // rotire verticală (sus/jos)
        xRotation -= mouseY;
        xRotation = Mathf.Clamp(xRotation, minY, maxY);

        cameraPivot.localRotation = Quaternion.Euler(xRotation, 0f, 0f);

        // rotire orizontală (stânga/dreapta)
        transform.Rotate(Vector3.up * mouseX);
    }

    void HandleMovement()
    {
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");

        Vector3 move = transform.right * x + transform.forward * z;
        controller.Move(move * speed * Time.deltaTime);

        // 🎬 animator
        if (animator != null)
            animator.SetFloat("Speed", move.magnitude);

        // gravitație
        if (controller.isGrounded && velocity.y < 0)
            velocity.y = -2f;

        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}
