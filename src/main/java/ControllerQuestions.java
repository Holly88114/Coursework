import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerQuestions {
    public static void insertQuestion(String Content, String subject) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Questions (Content, Subject) VALUES (?, ?)");
            ps.setString(1, Content);
            ps.setString(2, subject);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void listQuestions() {
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT QuestionId, Content, TimesCorrect, TimesIncorrect, SubjectID FROM Questions");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                int id = results.getInt(1);
                String Content = results.getString(2);
                int TimesCorrect = results.getInt(3);
                int TimesIncorrect = results.getInt(4);
                int SubjectID = results.getInt(5);
                System.out.print("Id: " + id + ", ");
                System.out.print("Content: " + Content + ", ");
                System.out.print("Times Correct: " + TimesCorrect + ", ");
                System.out.print("Times Incorrect: " + TimesIncorrect + ", ");
                System.out.print("Subject ID: " + SubjectID + ", ");
            }
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void updateQuestions(int id, String content, String answer) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Questions SET Content = ?, Answer = ?, WHERE QuestionId = ?");
            ps.setString(1, content);
            ps.setString(2, answer);
            ps.setInt(3, id);

            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void deleteQuestion(String content) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Questions WHERE Content = ?");
            ps.setString(1, content);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }
}
