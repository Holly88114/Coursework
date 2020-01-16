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
public class Subject {
    @POST
    @Path("add")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertSubject(@FormDataParam("name") String name, @FormDataParam("accessType") Boolean accessType, @CookieParam("token") String token) {
        try {
            if (name == null || accessType == null || token == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }

            System.out.println("subject/new name=" + name);
            PreparedStatement ps1 = Main.db.prepareStatement("INSERT INTO Subjects (SubjectName, AccessType, StudentID) VALUES (?, ?, (SELECT StudentID FROM Students WHERE Token = ?))");
            ps1.setString(1, name);
            ps1.setBoolean(2, accessType);
            ps1.setString(3, token);

            ps1.execute();

            PreparedStatement ps2 = Main.db.prepareStatement("SELECT last_insert_rowid()");
            ResultSet results1 = ps2.executeQuery();
            int subjectID = results1.getInt(1);

            PreparedStatement ps3 = Main.db.prepareStatement("INSERT INTO Scores (SubjectID, StudentID) VALUES (?, (SELECT StudentID FROM Students WHERE Token = ?))");
            ps3.setInt(1, subjectID);
            ps3.setString(2, token);

            ps3.execute();

            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    @GET
    @Path("listAll")
    @Produces(MediaType.APPLICATION_JSON)
    public String listSubjects() {
        System.out.println("subject/list");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT SubjectID, SubjectName FROM Subjects WHERE AccessType = TRUE");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("id", results.getInt(1));
                item.put("name", results.getString(2));
                item.put("access type", results.getBoolean(3));
                list.add(item);
            }
            return list.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("listSpecific")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String listStudentSubjects(@CookieParam("token") String token) {
        try {
            if (!Student.validToken(token)) {
                return "{\"error\": \"You don't appear to be logged in.\"}";
            }
            System.out.println("subject/listSpecific token= " + token);
            JSONArray list = new JSONArray();
            PreparedStatement ps = Main.db.prepareStatement("SELECT * FROM Subjects WHERE StudentID = (SELECT StudentID FROM Students WHERE Token = ?)");
            ps.setString(1, token);
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("id", results.getInt(1));
                item.put("name", results.getString(2));
                item.put("access type", results.getBoolean(3));
                list.add(item);
            }
            return list.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("get")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String listStudentSubjects(@FormDataParam("subjectID") Integer subjectID) {
        try {
            if (subjectID == null) {
                return "{\"error\": \"One or more data parameters are missing.\"}";
            }
            System.out.println("subject/get subjectID= " + subjectID);
            JSONArray list = new JSONArray();
            PreparedStatement ps = Main.db.prepareStatement("SELECT SubjectName FROM Subjects WHERE SubjectID = ?");
            ps.setInt(1, subjectID);
            ResultSet results = ps.executeQuery();

            JSONObject item = new JSONObject();
            item.put("name", results.getString(1));

            return item.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to update item, please see server console for more info.\"}";
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
            if (id == null || id < 0) {
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
