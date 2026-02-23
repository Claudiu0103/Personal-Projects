using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Collections;

public class QuestionUI : MonoBehaviour
{
    public GameObject panel;
    public TextMeshProUGUI questionText;
    public Button[] answerButtons;
    public Button startButton;

    private System.Action onCorrect;

    void Start()
    {
        //panel.SetActive(false);
    }

    public void ShowQuestion(string question, string[] answers, int correctIndex, System.Action onCorrectCallback)
    {
        panel.SetActive(true);
        questionText.text = question;
        onCorrect = onCorrectCallback;

        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
        Time.timeScale = 0f;

        // 🔴 FIX IMPORTANT: reactivează butoanele
        foreach (var btn in answerButtons)
            btn.gameObject.SetActive(true);

        correctIndex = Mathf.Clamp(correctIndex, 0, answers.Length - 1);

        int count = Mathf.Min(answerButtons.Length, answers.Length);

        for (int i = 0; i < count; i++)
        {
            int index = i;

            answerButtons[i]
                .GetComponentInChildren<TextMeshProUGUI>()
                .text = answers[i];

            answerButtons[i].onClick.RemoveAllListeners();
            answerButtons[i].onClick.AddListener(() =>
            {
                if (index == correctIndex)
                    CorrectAnswer();
                else
                    WrongAnswer();
            });
        }

        // dezactivează doar butoanele în plus (dacă există)
        for (int i = count; i < answerButtons.Length; i++)
            answerButtons[i].gameObject.SetActive(false);
    }


    void CorrectAnswer()
    {
        panel.SetActive(false);
        Time.timeScale = 1f;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;

        onCorrect?.Invoke();
    }

    void WrongAnswer()
    {
        questionText.text = "Răspuns greșit. Mai încearcă!";
    }

    public void ShowFinalMessage(string message, float duration, System.Action onFinish)
    {
        panel.SetActive(true);
        questionText.text = message;

        // ascunde toate butoanele
        foreach (var btn in answerButtons)
            btn.gameObject.SetActive(false);

        StartCoroutine(FinalMessageCoroutine(duration, onFinish));
    }

    IEnumerator FinalMessageCoroutine(float duration, System.Action onFinish)
    {
        yield return new WaitForSecondsRealtime(duration);

        panel.SetActive(false);
        Time.timeScale = 1f;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;

        onFinish?.Invoke();
    }

    public void ShowIntro()
    {
        panel.SetActive(true);

        questionText.text =
            "Bine ai venit!\n\n" +
            "În acest joc vei învăța noțiuni de bază despre circuite electrice.\n\n" +
            "Găsește obiectele ascunse (baterii, becuri, fire).\n" +
            "Răspunde corect la toate întrebările pentru fiecare obiect.\n" +
            "Conectează componentele pentru a aprinde becul.\n\n" +
            "ESC - blocheaza camera + cursor\n" +
            "Click dreapta - activeaza camera + ascunde cursorul\n\n" +
            "Succes!";

        // ascunde butoanele de răspuns
        foreach (var btn in answerButtons)
            btn.gameObject.SetActive(false);

        // afișează butonul de start
        startButton.gameObject.SetActive(true);

        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
        Time.timeScale = 0f;
    }

    public void StartGame()
    {
        panel.SetActive(false);
        startButton.gameObject.SetActive(false);

        Time.timeScale = 1f;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }


}
