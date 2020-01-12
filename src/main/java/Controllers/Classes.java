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
    public String insertClass(@FormDataParam("name") String name, @CookieParam("token") String token) {
        try {
            if (!Teacher.validToken(token)) {
                return "{\"error\": \"You don't appear to be logged in.\"}";
            }
            if (name == null || token == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("class/new name=" + name);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Classes (ClassName, TeacherID) VALUES (?, (SELECT TeacherID FROM Teachers WHERE Token = ?))");
            ps.setString(1, name);
            ps.setString(2, token);

            ps.execute();
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    /*@GET
    @Path("listAll")
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
    }*/

    @GET
    @Path("listSpecific")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String listSpecificClasses(@CookieParam("token") String token, @FormDataParam("userType") String userType) {
        System.out.println("class/listSpecific user= " + userType);
        JSONArray list = new JSONArray();
        try {
            if (userType.equals("student")) {
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT StudentID FROM Students WHERE Token = ?");
                ps1.setString(1, token);
                ResultSet results1 = ps1.executeQuery();
                int id = results1.getInt(1);
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT Classes.ClassID, Classes.ClassName FROM Classes INNER JOIN Enrollment on Classes.ClassID = Enrollment.ClassID WHERE Enrollment.StudentID = ?");
                ps2.setInt(1, id);
                ResultSet results2 = ps2.executeQuery();

                while (results2.next()) {
                    JSONObject item = new JSONObject();
                    item.put("id", results2.getInt(1));
                    item.put("name", results2.getString(2));
                    list.add(item);
                }
                return list.toString();
            } else if (userType.equals("teacher")) {
                PreparedStatement ps3 = Main.db.prepareStatement("SELECT TeacherID FROM Teachers WHERE Token = ?");
                ps3.setString(1, token);
                ResultSet results3 = ps3.executeQuery();
                int id = results3.getInt(1);
                PreparedStatement ps4 = Main.db.prepareStatement("SELECT ClassID, ClassName FROM Classes WHERE TeacherID = ?");
                ps4.setInt(1, id);
                ResultSet results4 = ps4.executeQuery();
                while (results4.next()) {
                    JSONObject item = new JSONObject();
                    item.put("id", results4.getInt(1));
                    item.put("name", results4.getString(2));
                    list.add(item);
                }
                return list.toString();
            } else {
                return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            }
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("get")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String getName(@FormDataParam("classID") Integer id) {
        System.out.println("class/getName");
        JSONArray list = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ClassName FROM Classes WHERE ClassID = ?");
            ps.setInt(1, id);
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("name", results.getString(1));
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


    


