import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerIncorrectQus {

    public static void insertInQu(int questionID, int studentID) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO IncorrectQuestions (questionID, studentID) VALUES (?, ?)");
            ps.setInt(1, questionID);
            ps.setInt(2, studentID);

            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void listInQus() {
        try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT IncorrectID, Score FROM IncorrectQuestions");
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT Name FROM Students INNER JOIN IncorrectQuestions ON Students.StudentID = IncorrectQuestions.StudentID");
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT Content FROM Questions INNER JOIN IncorrectQuestions ON Questions.QuestionID = IncorrectQuestions.QuestionID");

                ResultSet results = ps.executeQuery();
                ResultSet results1 = ps1.executeQuery();
                ResultSet results2 = ps2.executeQuery();

            while (results.next() && results1.next() && results2.next()) {
                int incorrectID = results.getInt(1);
                int score = results.getInt(2);
                String student = results1.getString(1);
                String question = results2.getString(1);

                System.out.print("Incorrect Question Id: " + incorrectID + ", ");
                System.out.print("Student: " + student + ", ");
                System.out.print("Question: " + question + ", ");
                System.out.print("Score: " + score + ", ");
            }
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void updateInQu(int score, int id) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("UPDATE IncorrectQuestions SET Score = ? WHERE IncorrectID = ?");
            ps.setInt(1, score);
            ps.setInt(2, id);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void deleteInQu(int id) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM IncorrectQuestions WHERE IncorrectID = ?");
            ps.setInt(1, id);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

}

