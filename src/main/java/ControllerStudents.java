import java.sql.PreparedStatement;
import java.sql.ResultSet;
// importing the necessary libraries

// controller class for the Students table
public class ControllerStudents {

    // function to create a new student
    public static void insertStudent(String name, String email, String password) {
        try {
            // SQL statement to insert a new student in the 'Students' table
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Students (Name, Email, Password) VALUES(?, ?, ?)");
            // setting the variables for the prepared statement
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password);
            // executes the statement
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints an error message for the user to know why the program failed
        }
    }

    // function to list the students
    public static void listStudents() {
        try {
            // SQL statement to select the student records in the 'Students' table
            PreparedStatement ps = Main.db.prepareStatement("SELECT StudentId, Name, Email FROM Students");
            ResultSet results = ps.executeQuery();
            // while the next result exists, retrieve the data
            while (results.next()) {
                // assign the results into temporary variables
                int id = results.getInt(1);
                String name = results.getString(2);
                String email = results.getString(3);
                // prints results
                System.out.print("Id: " + id + ", ");
                System.out.print("Name: " + name + ", ");
                System.out.print("Email: " + email + ", ");
            }
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints an error message for the user to know why the program failed
        }
    }

    // function to update a student record
    public static void updateStudents(int id, String name, String email) {
        try {
            // SQL statement to update a student record
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Students SET Name = ?, Email = ? WHERE StudentId = ?");
            // setting the variables for the prepared statement
            ps.setString(1, name);
            ps.setString(2, email);
            ps.setInt(3, id);
            // executes the statement
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints an error message for the user to know why the program failed
        }
    }

    // function to delete a student
    public static void deleteStudent(String email) {
        try {
            // SQL to delete a student record
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Students WHERE Email = ?");
            // sets the variable
            ps.setString(1, email);
            // executes the statement
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            // prints an error message for the user to know why the program failed
        }
    }
}
