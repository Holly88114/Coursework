import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerSubjects {
    public static void insertSubject(String name, Boolean accessType) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Subjects (SubjectName, AccessType) VALUES (?, ?)");
            ps.setString(1, name);
            ps.setBoolean(2, accessType);

            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void listStudents() {
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT SubjectID, SubjectName, AccessType FROM Subjects");
            ResultSet results = ps.executeQuery();
            while (results.next()) {
                int id = results.getInt(1);
                String name = results.getString(2);
                Boolean accessType = results.getBoolean(3);
                System.out.print("Id: " + id + ", ");
                System.out.print("Subject Name: " + name + ", ");
                System.out.print("Access Type: " + accessType + ", ");
            }
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void updateSubjects(int id, String name, boolean accessType) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Subjects SET SubjectName = ?, AccessType = ?, WHERE SubjectId = ?");
            ps.setString(1, name);
            ps.setBoolean(2, accessType);
            ps.setInt(3, id);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }

    public static void deleteSubject(int id) {
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Subjects WHERE SubjectID = ?");
            ps.setInt(1, id);
            ps.execute();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
        }
    }
}
