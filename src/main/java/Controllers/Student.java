package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;
// importing the libraries

@Path("student/")
public class Student {

    @POST
    // the type of request (get or post)
    @Path("add")
    // specific path for the function
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    // intake data
    @Produces(MediaType.APPLICATION_JSON)
    // output data
    public String insertStudent(@FormDataParam("name") String name, @FormDataParam("email") String email, @FormDataParam("password") String password) {
        try {
            if (name == null || email == null || password == null) {
                // ensures all the variables needed are present
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("student/add name=" + name);
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Students (Name, Email, Password) VALUES (?, ?, ?)");
            // prepared statement to communicate with the database
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password);
            // inserting the correct variables into the prepared statement
            ps.execute();

            return "{\"status\": \"OK\"}";
            // when no errors are caught send the OK
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @GET
    @Path("list")
    @Produces(MediaType.APPLICATION_JSON)
    // doesn't need an input
    public String listStudents() {
        System.out.println("students/list");
        JSONArray list = new JSONArray();
        // creates the array for the data
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT Name, Score FROM Students");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("name", results.getString(1));
                item.put("score", results.getString(2));
                list.add(item);
                // adds the content from the database into the JSON object
            }
            return list.toString();
            // returns the list in a String format
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("select")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String selectStudent(@CookieParam("token") String token) {
        System.out.println("students/select");
        JSONArray list = new JSONArray();
        // creates the array for the data
        if (!Student.validToken(token)) {
            return "{\"error\": \"Invalid token.\"}";
        } else {
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT StudentID, Name, Email, Score FROM Students WHERE Token = ?");
                ps.setString(1, token);
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    JSONObject item = new JSONObject();
                    item.put("id", results.getInt(1));
                    item.put("name", results.getString(2));
                    item.put("email", results.getString(3));
                    item.put("score", results.getString(4));
                    list.add(item);
                    // adds the content from the database into the JSON object
                }
                return list.toString();
                // returns the list in a String format
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                // prints the database error to the console
                return "{\"error\": \"Unable to show user details, please see server console for more info.\"}";
                // returns this statement to the user
            }
        }
    }

    @POST
    @Path("search")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String searchStudents(@FormDataParam("email") String email) {
        System.out.println("students/search");
        JSONArray list = new JSONArray();
        // creates the array for the data

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT StudentID FROM Students WHERE Email = ?");
            ps.setString(1, email);
            ResultSet results = ps.executeQuery();
            if (results.next()) {
                JSONObject item = new JSONObject();
                item.put("id", results.getInt(1));
                list.add(item);
                // adds the content from the database into the JSON object
            } else {
                JSONObject item = new JSONObject();
                item.put("id", -1);
                list.add(item);
            }
            return list.toString();
            // returns the list in a String format
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to show user details, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("update")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateStudents(@FormDataParam("score") Integer score, @CookieParam("token") String token) {
        try {
            if (score == null || token == null) {
                // checks all the data is present
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("student/update");

            PreparedStatement ps = Main.db.prepareStatement("UPDATE Students SET Score = ? WHERE Token = ?");
            ps.setInt(1, score);
            ps.setString(2, token);
            // adds the variables to the prepared statement to make a complete SQL query
            ps.execute();
            return "{\"status\": \"OK\"}";
            // no errors returns an OK

        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to update item, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("delete")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteThing(@FormDataParam("email") String email) {
        try {
            if (email == null) {
                // checks the email is present
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Students WHERE Email = ?");
            ps.setString(1, email);
            ps.execute();
            return "{\"status\": \"OK\"}";
            // no errors returns the OK
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("login")
    // path name
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // takes in formData and produces a JSON response
    public String loginStudent(@FormDataParam("email") String email, @FormDataParam("password") String password) {
        try {
            System.out.println("student/login");
            if (email == null || password == null) {
                // checks the email and password are present
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
                // if either the email or password aren't present this error is returned
            }
            PreparedStatement ps = Main.db.prepareStatement("SELECT StudentID, Email, Password FROM Students");
            // a prepared statement to select the students from the Students table
            ResultSet results = ps.executeQuery();
            while (results.next())  {
                // while the next result isn't null
                if (results.getString(2).equals(email) && results.getString(3).equals(password)) {
                    String token = UUID.randomUUID().toString();
                    // if the email and the password match then a token is generated

                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Students SET Token = ? WHERE Email = ?");
                    // a prepared statement to update the user's token
                    ps2.setString(1, token);
                    ps2.setString(2, email);
                    ps2.executeUpdate();

                    JSONObject userDetails = new JSONObject();
                    userDetails.put("email", email);
                    userDetails.put("token", token);
                    return userDetails.toString();
                    // returns the email and the token of the student
                }
            }
            return "{\"error\": \"Incorrect information entered.\"}";
            // if the username and password don't match any in the system an error is returned
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
            System.out.println("user/logout");
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT StudentID FROM Students WHERE Token = ?");
            // gets the student that wants to logout
            ps1.setString(1, token);
            ResultSet logoutResults = ps1.executeQuery();
            if (logoutResults.next()) {
                int id = logoutResults.getInt(1);
                PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Students SET Token = NULL WHERE StudentID = ?");
                // sets the token to null as the user is no longer logged in
                ps2.setInt(1, id);
                ps2.executeUpdate();
                return "{\"status\":\"OK\"}";
            } else {
                return "{\"error\": \"Invalid token!\"}";
                // if the token doesn't match any in the database an error is returned
            }

        } catch (Exception exception) {
            System.out.println("Database error during /user/logout: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Server side error\"}";
            // returns this statement to the user
        }
    }

    @POST
    @Path("checkUser")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String checkUser(@CookieParam("token") String token) {
        System.out.println("students/check");
        JSONArray list = new JSONArray();
        // creates the array for the data
        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT StudentID FROM Students WHERE Token = ?");
            ps1.setString(1, token);
            ResultSet results1 = ps1.executeQuery();
            if (results1.next()) {
                return "{\"user\": \"student\"}";
            } else {
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT TeacherID FROM Teachers WHERE Token = ?");
                ps2.setString(1, token);
                ResultSet results2 = ps2.executeQuery();
                return "{\"user\": \"teacher\"}";
            }

            // returns the list in a String format
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints the database error to the console
            return "{\"error\": \"Unable to show user details, please see server console for more info.\"}";
            // returns this statement to the user
        }
    }

    public static boolean validToken(String token) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT StudentID FROM Students WHERE Token = ?");
            // selects the id of the student that is logged in
            ps.setString(1, token);
            ResultSet logoutResults = ps.executeQuery();
            return logoutResults.next();
            // returns the result of the query - the studentID
        } catch (Exception exception) {
            System.out.println("Database error during /user/logout: " + exception.getMessage());
            return false;
        }
    }

}

