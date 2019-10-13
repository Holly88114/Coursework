package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("teacher/")
public class teacher {

    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertTeacher(@FormDataParam("name") String name, @FormDataParam("email") String email, @FormDataParam("password") String password) {
        try {
            if (name == null || email == null || password == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("teacher/new name=" + name);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Teachers (Name, Email, Password) VALUES (?, ?, ?)");
            if (name.equals("") || email.equals("") || password.equals("")) {
                System.out.println("One or more of the parameters are empty. Please resend the request.");
            } else {
                ps.setString(1, name);
                ps.setString(2, email);
                ps.setString(3, password);
                ps.execute();

            }
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    @GET
    @Path("list")
    @Produces(MediaType.APPLICATION_JSON)
    public String listTeachers() {
        System.out.println("teacher/list");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeacherId, Name, Email FROM Teachers");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("id", results.getInt(1));
                item.put("name", results.getString(2));
                item.put("email", results.getString(3));
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
    public String updateTeachers(@FormDataParam("id") Integer id, @FormDataParam("name") String name, @FormDataParam("email") String email) {
        try {
            if (id == null || name == null || email == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("teacher/update id=" + id);

            PreparedStatement ps = Main.db.prepareStatement("UPDATE Teachers SET Name = ?, Email = ? WHERE TeacherID = ?");
            ps.setString(1, name);
            ps.setString(2, email);
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
    public String deleteTeacher(@FormDataParam("email") String email) {
        try {
            if (email == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("teacher/delete email=" + email);
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Teachers WHERE Email = ?");
            ps.setString(1, email);
            ps.execute();
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }

}
