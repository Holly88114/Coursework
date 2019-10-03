package Controllers;
import Server.Main;

import javax.ws.rs.Path;
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
                PreparedStatement ps = Main.db.prepareStatement("SELECT StudentId, Name, Email FROM Students");
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

        public static void updateClasses(int id, String name, int teacherID) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("UPDATE Classes SET Name = ?, Email = ?, WHERE StudentId = ?");
                ps.setString(1, name);
                ps.setInt(2, teacherID);
                ps.setInt(3, id);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

        public static void deleteStudent(String email) {
            try {
                PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Students WHERE Email = ?");
                ps.setString(1, email);
                ps.execute();
            } catch (Exception exception) {
                System.out.println("Database error: " + exception.getMessage());
            }
        }

    }
