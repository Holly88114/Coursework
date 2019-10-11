package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("incorrect/")
public class incorrect {

    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String  insertInQu(@FormDataParam("questionID") Integer questionID, @FormDataParam("studentID") Integer studentID) {
            try {
                if (questionID == null || studentID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("incorrectQus/new id=" + questionID);
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO IncorrectQuestions (questionID, studentID) VALUES (?, ?)");
                ps.setInt(1, questionID);
                ps.setInt(2, studentID);

                ps.execute();
                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            }
        }

    @GET
    @Path("list")
    @Produces(MediaType.APPLICATION_JSON)
    public String listInQus() {
        System.out.println("incorrectQus/list");
        JSONArray list = new JSONArray();
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT IncorrectID, Score FROM IncorrectQuestions");
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT Name FROM Students INNER JOIN IncorrectQuestions ON Students.StudentID = IncorrectQuestions.StudentID");
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT Content FROM Questions INNER JOIN IncorrectQuestions ON Questions.QuestionID = IncorrectQuestions.QuestionID");

                ResultSet results = ps.executeQuery();
                ResultSet results1 = ps1.executeQuery();
                ResultSet results2 = ps2.executeQuery();

                while (results.next() && results1.next() && results2.next()) {
                    JSONObject item = new JSONObject();
                    item.put("id", results.getInt(1));
                    item.put("score", results.getInt(2));
                    item.put("student", results1.getString(1));
                    item.put("question", results2.getString(1));
                    list.add(item);
                }
                return list.toString();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            }
        }

    @POST
    @Path("update")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateInQu(@FormDataParam("score") Integer score, @FormDataParam("id") Integer id) {
            try {
                if (score == null || id == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("incorrectQus/update id=" + id);
                PreparedStatement ps = Main.db.prepareStatement("UPDATE IncorrectQuestions SET Score = ? WHERE IncorrectID = ?");
                ps.setInt(1, score);
                ps.setInt(2, id);
                ps.execute();
                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to update item, please see server console for more info.\"}";
            }
        }

    @POST
    @Path("delete")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteInQu(@FormDataParam("id") Integer id) {
            try {
                if (id == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("incorrectQu/delete id=" + id);
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM IncorrectQuestions WHERE IncorrectID = ?");
                ps.setInt(1, id);
                ps.execute();

                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
            }
        }


}
