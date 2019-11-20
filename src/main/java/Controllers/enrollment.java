package Controllers;
import       Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("enrollment/")
public class enrollment {

    @POST
    @Path("add")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String insertEnroll(@FormDataParam("studentID") Integer studentID, @FormDataParam("classID") Integer classID) {
            try {
                if (studentID == null || classID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("thing/new id=" + studentID);
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Enrollment (StudentID, ClassID) VALUES (?, ?)");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);

                ps.execute();
                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            }
        }

        // lists the students and which class they are enrolled in
        @GET
        @Path("list")
        @Produces(MediaType.APPLICATION_JSON)
        public String listEnrollment() {
            System.out.println("enroll/list");
            JSONArray list = new JSONArray();
            try {
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT Students.Name FROM Students INNER JOIN Enrollment ON Students.StudentID = Enrollment.StudentID");
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT Classes.ClassName FROM Classes INNER JOIN Enrollment ON Classes.ClassID = Enrollment.ClassID");
                ResultSet results1 = ps1.executeQuery();
                ResultSet results2 = ps2.executeQuery();

                while (results1.next() && results2.next()) {
                    JSONObject item = new JSONObject();
                    item.put("student", results1.getString(1));
                    item.put("className", results2.getString(1));
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
    public String updateEnrollment(@FormDataParam("studentID") Integer studentID, @FormDataParam("classID") Integer classID, @FormDataParam("enrollID") Integer enrollID) {
            try {
                if (studentID == null || classID == null || enrollID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("enroll/update id=" + enrollID);
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Enrollment SET StudentID = ?, ClassID = ? WHERE EnrollID = ?");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);
                ps.setInt(3, enrollID);
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
    public String deleteEnrollment(@FormDataParam("studentID") Integer studentID, @FormDataParam("classID") Integer classID) {
            try {
                if (studentID == null || classID == null) {
                    throw new Exception("One or more form data parameters are missing in the HTTP request.");
                }
                System.out.println("enroll/delete id=" + studentID);

                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Enrollment WHERE StudentID = ? AND ClassID = ?");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);
                ps.execute();
                return "{\"status\": \"OK\"}";
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
            }
        }



}
