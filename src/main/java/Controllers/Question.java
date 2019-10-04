package Controllers;
import Server.Main;
import com.sun.jersey.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("student/")
public class Question {
    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertQuestion(@FormDataParam("content") String content, @FormDataParam("answer") String answer, @FormDataParam("subjectID") Integer subjectID) {
            try {
                if (content == null || answer == null || subjectID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Questions (Content, Subject) VALUES (?, ?)");
                ps.setString(1, content);
                ps.setString(2, answer);
                ps.execute();

                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
                // returns this statement to the user
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

