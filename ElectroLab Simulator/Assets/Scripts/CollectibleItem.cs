using UnityEngine;

public class CollectibleItem : MonoBehaviour
{
    public string itemId;
    public QuestionUI questionUI;

    private int currentQuestionIndex = 0;

    void OnMouseDown()
    {
        AskQuestion();
    }

    public void AskQuestion()
    {
        switch (itemId)
        {
            case "battery":
                AskFromSet(batteryQuestions);
                break;

            case "bulb":
                AskFromSet(bulbQuestions);
                break;

            case "wire":
                AskFromSet(wireQuestions);
                break;
        }
    }

    // -------------------------
    // LOGICĂ GENERALĂ
    // -------------------------
    void AskFromSet(QuestionData[] questions)
    {
        if (currentQuestionIndex >= questions.Length)
        {
            // ✅ TOATE întrebările corecte
            questionUI.ShowFinalMessage(
                "Felicitări!\nAi răspuns corect la toate întrebările și ai găsit obiectul!",
                3f,
                Collect
            );
            return;
        }

        QuestionData q = questions[currentQuestionIndex];

        questionUI.ShowQuestion(
            q.question,
            q.answers,
            q.correctIndex,
            () =>
            {
                currentQuestionIndex++;
                AskFromSet(questions);
            }
        );
    }

    public void Collect()
    {
        FoundItemsManager.Instance.Collect(itemId);
        gameObject.SetActive(false);
    }

    // -------------------------
    // DATE – ÎNTREBĂRI
    // -------------------------

    QuestionData[] batteryQuestions =
    {
        new QuestionData(
            "Care este rolul bateriei într-un circuit electric?",
            new[] { "Produce lumină", "Furnizează energie electrică", "Consumă curent", "Stochează rezistență" },
            1
        ),
        new QuestionData(
            "Ce mărime fizică oferă o baterie?",
            new[] { "Curent", "Rezistență", "Tensiune", "Putere" },
            2
        ),
        new QuestionData(
            "Ce se întâmplă dacă bateria este descărcată?",
            new[] { "Becul luminează mai tare", "Circuitul nu mai funcționează", "Crește tensiunea", "Apare scurtcircuit" },
            1
        )
    };

    QuestionData[] bulbQuestions =
    {
        new QuestionData(
            "Ce rol are becul într-un circuit?",
            new[] { "Produce energie", "Consumă energie", "Mărește tensiunea", "Stochează curent" },
            1
        ),
        new QuestionData(
            "Ce transformă becul?",
            new[] { "Lumină în curent", "Curent în lumină", "Curent în tensiune", "Tensiune în rezistență" },
            1
        ),
        new QuestionData(
            "Ce se întâmplă cu becul într-un circuit deschis?",
            new[] { "Se arde", "Nu luminează", "Luminează mai tare", "Pulsează" },
            1
        )
    };

    QuestionData[] wireQuestions =
    {
        new QuestionData(
            "Care este rolul firului electric?",
            new[] { "Produce energie", "Conectează componentele", "Consumă curent", "Stochează tensiune" },
            1
        ),
        new QuestionData(
            "De ce se folosește cuprul pentru fire?",
            new[] { "Este greu", "Conduce bine electricitatea", "Este ieftin", "Nu se încălzește" },
            1
        ),
        new QuestionData(
            "Ce se întâmplă dacă firul este întrerupt?",
            new[] { "Crește tensiunea", "Circuitul nu funcționează", "Apare scurtcircuit", "Becul se arde" },
            1
        )
    };
}
