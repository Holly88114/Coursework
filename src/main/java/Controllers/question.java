package Controllers;
import Server.Main;
import jdk.nashorn.internal.objects.annotations.Getter;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Random;

@Path("question/")
public class question {

    @POST
    @Path("add")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertQuestion(@FormDataParam("content") String content, @FormDataParam("answer") String answer, @FormDataParam("subjectID") Integer subjectID) {
        try {
            if (content == null || answer == null || subjectID == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("question/new content=" + content);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Questions (Content, Answer, SubjectID) VALUES (?, ?, ?)");
            ps.setString(1, content);
            ps.setString(2, answer);
            ps.setInt(3, subjectID);
            ps.execute();
            return "{\"status\": \"OK\"}";

        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    @GET
    @Path("list")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String listQuestions(@FormDataParam("quiz") Boolean quiz) {
        System.out.println("question/list");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT QuestionId, Content, Answer, TimesCorrect, TimesIncorrect, SubjectID FROM Questions");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                //item.put("id", results.getInt(1));
                item.put("content", results.getString(2));
                item.put("answer", results.getString(3));
                //item.put("TimesCorrect", results.getInt(4));
                //item.put("TimesIncorrect", results.getInt(5));
                //item.put("SubjectID", results.getInt(6));
                list.add(item);
            }

            if (quiz) {
                return tenQuestions(list).toString();
            }
            return list.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }

    public JSONArray tenQuestions(JSONArray list) {
        Random random = new Random();
        JSONArray newList = new JSONArray();
        int[] array = new int[10];
        boolean match = false;
        int count = 0;
        while (count != 10) {
            int rand = random.nextInt(list.size());
            for (int y = 0; y < 10; y++) {
                if (rand == array[y]) {
                    match = true;
                }
            }
            if (match) {
                newList.add(list.get(rand));
                count += 1;
            }
        }
        return newList;
    }

    @POST
    @Path("update")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateQuestions(@FormDataParam("id") Integer id, @FormDataParam("content") String content, @FormDataParam("answer") String answer) {
        try {
            if (id == null || content == null || answer == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }

            System.out.println("question/update id=" + id);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Questions SET Content = ?, Answer = ? WHERE QuestionId = ?");
            ps.setString(1, content);
            ps.setString(2, answer);
            ps.setInt(3, id);

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
    public String deleteQuestion(@FormDataParam("id") Integer id) {
        try {
            if (id == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("question/delete id=" + id);
            PreparedStatement ps1 = Main.db.prepareStatement("UPDATE Questions SET SubjectID=null WHERE QuestionID = ?");
            PreparedStatement ps2 = Main.db.prepareStatement("DELETE FROM Questions WHERE QuestionID = ?");
            ps1.setInt(1, id);
            ps1.execute();
            ps2.setInt(1, id);
            ps2.execute();

            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}