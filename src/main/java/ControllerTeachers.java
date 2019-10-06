import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerTeachers {

        public static void insertTeacher(String name, String email, String password) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Teachers (Name, Email, Password) VALUES (?, ?, ?)");
                // if statement to ensure the parameters have values
                if (name.equals("") || email.equals("") || password.equals("")) {
                    System.out.println("One or more of the parameters are empty. Please resend the request.");
                    // prints an error for the user so they know why the query failed
                } else {
                    // if none are missing the statement can continue as usual
                    ps.setString(1, name);
                    ps.setString(2, email);
                    ps.setString(3, password);
                    ps.execute();
                }
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void listTeachers() {
            try {
                PreparedStatement ps = Main.db.prepareStatement("SELECT TeacherId, Name, Email FROM Teachers");
                ResultSet results = ps.executeQuery();
                while (results.next()) {
                    int id = results.getInt(1);
                    String name = results.getString(2);
                    int email = results.getInt(3);
                    System.out.print("Id: " + id + ", ");
                    System.out.print("Name: " + name + ", ");
                    System.out.print("Email: " + email + ", ");
                }
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void updateTeachers(int id, String name, String email) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Teachers SET Name = ?, Email = ? WHERE TeacherID = ?");
                ps.setString(1, name);
                ps.setString(2, email);
                ps.setInt(3, id);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void deleteTeacher(String email) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Teachers WHERE Email = ?");
                ps.setString(1, email);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

    }
