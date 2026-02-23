using UnityEngine;

public class GameIntro : MonoBehaviour
{
    public QuestionUI questionUI;

    void Start()
    {
        questionUI.ShowIntro();
    }
}
