public class QuestionData
{
    public string question;
    public string[] answers;
    public int correctIndex;

    public QuestionData(string q, string[] a, int c)
    {
        question = q;
        answers = a;
        correctIndex = c;
    }
}
