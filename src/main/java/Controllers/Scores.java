package Controllers;
import Server.Main;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
// importing all the libraries used

@Path("score/")
// the root path is score for all of the functions
public class Scores {

    @POST
    @Path("new")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // the new function creates a new score column
    public String insertScore(@FormDataParam("subjectID") Integer subjectID, @CookieParam("token") String token) {
        // the parameters required are the subject id and the user token
        try {
            if (!Student.validToken(token)) {
                // if the user doesn't have a valid token an error is returned
                return "{\"error\": \"You don't appear to be logged in.\"}";
            }
            if (subjectID == null) {
                // if the subject id is null an error is returned
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("scores/new subjectID=" + subjectID);
            // the prepared statement is inserting a new column into the scores table
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Scores (SubjectID, StudentID) VALUES (?, (SELECT StudentID FROM Students WHERE Token = ?))");
            ps.setInt(1, subjectID);
            ps.setString(2, token);
            // setting the unknowns with the parameters

            ps.execute();
            // executes the statement
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to create new item, please see server console for more info.\"}";
            // if an error is caught, it is returned to the user
        }
    }

    @POST
    @Path("get")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // a get function to return the score
    public String getScore(@CookieParam("token") String token) {
        // needs the subject id and a token to find the right entry
        System.out.println("class/getName");
        JSONArray list = new JSONArray();
        try {
            // the prepared statement selects the score from the scores table according to the correct subject and student id
            PreparedStatement ps = Main.db.prepareStatement("SELECT Scores, SubjectID FROM Scores WHERE StudentID = (SELECT StudentID FROM Students WHERE Token = ?)");
            ps.setString(1, token);
            // setting the unknowns with the parameters

            ResultSet results = ps.executeQuery();
            // executes the statement
            while (results.next()) {
                JSONObject item = new JSONObject();
                item.put("scores", results.getString(1));
                item.put("subjectID", results.getString(2));
                list.add(item);
            }
            return list.toString();
            // returns a list with the scores in it
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to list items, please see server console for more info.\"}";
            // if an error is caught, it is returned to the user
        }
    }


    @POST
    @Path("update")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // an update function to change the score
    public String updateScores(@CookieParam("token") String token, @FormDataParam("subjectID") Integer subjectID, @FormDataParam("scores") Integer scores) {
        // requires the user token, the subject id, and the new scores
        try {
            if (token == null || subjectID == null || scores == null) {
                // if any of the parameters are missing an error is thrown
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("score/update id=" + subjectID);
            // the prepared statement updates the score of the subject and the user that just completed a test
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Scores SET Scores = ? WHERE StudentID = (SELECT StudentID FROM Students WHERE Token = ?) AND SubjectID = ?");
            ps.setInt(1, scores);
            ps.setString(2, token);
            ps.setInt(3, subjectID);
            ps.execute();
            return "{\"status\": \"OK\"}";
            // if the update works an OK status is returned
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to update item, please see server console for more info.\"}";
            // if an error is caught the error is returned to the user
        }
    }

    @POST
    @Path("delete")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    // a delete function to remove the scores from the database
    public String deleteScore(@FormDataParam("subjectID") Integer subjectID, @CookieParam("token") String token) {
        try {
            if (token == null || subjectID == null) {
                // if any of the parameters are null an error is thrown
                throw new Exception("One or more form data parameters are missing in the HTTP request.");
            }
            System.out.println("score/delete id=" + subjectID);
            // the prepared statement deletes the column from scores where the student and subject id's match the entered ones
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Scores WHERE SubjectID = ? AND StudentID = (SELECT StudentID FROM Students WHERE Token = ?)");
            ps.setInt(1, subjectID);
            ps.setString(2, token);
            // the unknowns are filled with the parameters4
            ps.execute();
            // statement is executed
            return "{\"status\": \"OK\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"error\": \"Unable to delete item, please see server console for more info.\"}";
            // if an error is caught, it is returned to the user
        }
    }
}
