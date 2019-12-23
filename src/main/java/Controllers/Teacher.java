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
public class Teacher {

    @POST
    @Path("add")
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
    public String updateTeachers(@FormDataParam("name") String name, @FormDataParam("email") String email, @FormDataParam("password") String password) {
        try {
            if (password == null || name == null || email == null) {
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("teacher/update id=" + name);

            PreparedStatement ps = Main.db.prepareStatement("UPDATE Teachers SET Name = ?, Password = ? WHERE Email = ?");
            ps.setString(1, name);
            ps.setString(2, password);
            ps.setString(3, email);
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

    @POST
    @Path("login")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String loginStudent(@FormDataParam("email") String email, @FormDataParam("password") String password) {
        try {
            if (email == null || password == null) {
                // checks the email and password are present
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeacherID, Email, Password FROM Teachers");
            ResultSet results = ps.executeQuery();
            while (results.next())  {
                if (results.getString(2).equals(email) && results.getString(3).equals(password)) {
                    Main.UserID = results.getInt(1);
                    System.out.println(Main.UserID);
                    return"{\"status\": \"OK\"}";
                }
            }
            return "{\"error\": \"Incorrect information entered.\"}";
            // no errors returns the OK
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to login, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("logout")
    // path name
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // takes in formData and produces a JSON response
    public String logout(@CookieParam("token") String token) {
        // only needs to take in the cookie parameter of the token
        try {
            System.out.println("teacher/logout");
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT TeacherID FROM Teachers WHERE Token = ?");
            // gets the student that wants to logout
            ps1.setString(1, token);
            ResultSet logoutResults = ps1.executeQuery();
            if (logoutResults.next()) {
                int id = logoutResults.getInt(1);
                PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Teachers SET Token = NULL WHERE TeacherID = ?");
                // sets the token to null as the user is no longer logged in
                ps2.setInt(1, id);
                ps2.executeUpdate();
                return "{\"status\":\"OK\"}";
            } else {
                return "{\"error\": \"Invalid token!\"}";
                // if the token doesn't match any in the database an error is returned
            }

        } catch (Exception exception) {
            System.out.println("Database error during /teacher/logout: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Server side error\"}";
            // returns this statement to the user
        }
    }

    public static boolean validToken(String token) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeacherID FROM Teachers WHERE Token = ?");
            ps.setString(1, token);
            ResultSet logoutResults = ps.executeQuery();
            return logoutResults.next();
        } catch (Exception exception) {
            System.out.println("Database error during /teacher/logout: " + exception.getMessage());
            return false;
        }
    }


}
