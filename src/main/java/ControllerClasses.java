import java.sql.PreparedStatement;
import java.sql.ResultSet;


public class ControllerClasses {
        public static void insertClass(String name, int teacherId) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Classes (ClassName, TeacherID) VALUES (?, ?)");
                ps.setString(1, name);
                ps.setInt(2, teacherId);

                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void listClasses() {
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT ClassID, ClassName, TeacherID FROM Classes");
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    int id = results.getInt(1);
                    String name = results.getString(2);
                    int teacherID = results.getInt(3);
                    System.out.print("Id: " + id + ", ");
                    System.out.print("Name: " + name + ", ");
                    System.out.print("Teacher Id: " + teacherID + ", ");
                }
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void updateClasses(int id, String name, int teacherID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Classes SET ClassName = ?, TeacherID = ? WHERE ClassID = ?");
                ps.setString(1, name);
                ps.setInt(2, teacherID);
                ps.setInt(3, id);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void deleteClass(int classID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Classes WHERE ClassID = ?");
                ps.setInt(1, classID);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

    }
