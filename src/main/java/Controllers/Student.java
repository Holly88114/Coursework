package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("student/")
public class Student {
// importing the libraries
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
                PreparedStatement ps = Main.db.prepareStatement("SELECT StudentId, Name, Email FROM Students");
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    JSONObject item = new JSONObject();
                    item.put("id", results.getInt(1));
                    item.put("name", results.getString(2));
                    item.put("email", results.getString(3));
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
        @Path("update")
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        @Produces(MediaType.APPLICATION_JSON)
        public String updateStudents(@FormDataParam("name") String name, @FormDataParam("password") String password, @FormDataParam("email") String email) {
            try {
                if (name == null || email == null || password == null) {
                    // checks all the data is present
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("student/update name=" + name);

                PreparedStatement ps = Main.db.prepareStatement("UPDATE Students SET Name = ?, Password = ? WHERE Email = ?");
                ps.setString(1, name);
                ps.setString(2, password);
                ps.setString(3, email);
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
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        @Produces(MediaType.APPLICATION_JSON)
        public String loginStudent(@FormDataParam("email") String email, @FormDataParam("password") String password) {
            try {
                if (email == null || password == null) {
                    // checks the email and password are present
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                PreparedStatement ps = Main.db.prepareStatement("SELECT StudentID, Email, Password FROM Students");
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

    }

