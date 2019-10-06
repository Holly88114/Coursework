import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerEnrollment {


        public static void insertEnroll(int studentID, int classID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Enrollment (StudentID, ClassID) VALUES (?, ?)");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);

                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        // lists the students and which class they are enrolled in
        public static void listEnrollment() {
            try {
                // two inner joins, first gets the student name, the second gets the class name
                PreparedStatement ps1 = Main.db.prepareStatement("SELECT Name FROM Students INNER JOIN Enrollment ON Students.StudentID = Enrollment.StudentID");
                PreparedStatement ps2 = Main.db.prepareStatement("SELECT ClassName FROM Classes INNER JOIN Enrollment ON Classes.ClassID = Enrollment.ClassID");
                // executing the queries prepared above
                ResultSet results1 = ps1.executeQuery();
                ResultSet results2 = ps2.executeQuery();
                // while there is information in the next result, retrieve it
                while (results1.next() && results2.next()) {
                    String student = results1.getString(1);
                    String className = results2.getString(1);
                    // putting the next entry into a variable
                    System.out.print("Student: " + student + ", ");
                    System.out.print("Class: " + className + ", ");
                    // prints the student and their class name
                }
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
                // error message to explain to the user why it didn't work
            }
        }

        public static void updateEnrollment(int studentID, int classID, int enrollID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Enrollment SET StudentID = ?, ClassID = ? WHERE EnrollID = ?");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);
                ps.setInt(3, enrollID);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void deleteEnrollment(int studentID, int classID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Enrollment WHERE StudentID = ? AND ClassID = ?");
                ps.setInt(1, studentID);
                ps.setInt(2, classID);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

    }

