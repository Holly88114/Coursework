package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("class/")
public class Classes {

    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertClass(@FormDataParam("name") String name, @FormDataParam("teacherID") Integer teacherId) {
            try {
                if (name == null || teacherId == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("class/new name=" + name);
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Classes (ClassName, TeacherID) VALUES (?, ?)");
                ps.setString(1, name);
                ps.setInt(2, teacherId);

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
    public String listClasses() {
        System.out.println("class/list");
        JSONArray list = new JSONArray();
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT ClassID, ClassName, TeacherID FROM Classes");
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    JSONObject item = new JSONObject();
                    item.put("classID", results.getInt(1));
                    item.put("className", results.getString(2));
                    item.put("teacherID", results.getInt(3));
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
    public String updateClasses(@FormDataParam("id") Integer id, @FormDataParam("name") String name, @FormDataParam("teacherID") Integer teacherID) {
            try {
                if (id == null || name == null || teacherID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("class/update id=" + id);
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Classes SET ClassName = ?, TeacherID = ? WHERE ClassID = ?");
                ps.setString(1, name);
                ps.setInt(2, teacherID);
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
    public String  deleteClass(@FormDataParam("classID") Integer classID) {
            try {
                if (classID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("class/delete id=" + classID);
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Classes WHERE ClassID = ?");
                ps.setInt(1, classID);
                ps.execute();
                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
            }
        }


}
