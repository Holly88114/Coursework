package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("subject/")
public class subject {
    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertSubject(@FormDataParam("name") String name, @FormDataParam("accessType") Boolean accessType, @FormDataParam("studentID") Integer studentID) {
        try {
            if (name == null || accessType == null || studentID == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("subject/new name=" + name);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Subjects (SubjectName, AccessType, StudentID) VALUES (?, ?, ?)");
            ps.setString(1, name);
            ps.setBoolean(2, accessType);
            ps.setInt(3, studentID);

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
    public String listSubjects() {
        System.out.println("subject/list");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT SubjectID, SubjectName, AccessType FROM Subjects");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("id", results.getInt(1));
                item.put("name", results.getString(2));
                item.put("quantity", results.getBoolean(3));
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
    public String updateSubjects(@FormDataParam("id") Integer id, @FormDataParam("name") String name, @FormDataParam("accessType") Boolean accessType) {
        try {
            if (id == null || name == null || accessType == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("subject/update id=" + id);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Subjects SET SubjectName = ?, AccessType = ? WHERE SubjectId = ?");

            ps.setString(1, name);
            ps.setBoolean(2, accessType);
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
    public String deleteSubject(@FormDataParam("id") Integer id) {
        try {
            if (id == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("subject/delete id=" + id);
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Subjects WHERE SubjectID = ?");
            ps.setInt(1, id);
            ps.execute();
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
}
