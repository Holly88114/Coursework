import java.sql.PreparedStatement;
import java.sql.*;
import org.sqlite.SQLiteConfig;
import java.sql.Connection;
import java.sql.DriverManager;

public class Main {
    public static void main(String[] args) {
        openDatabase("Database.db");
    }



    public static Connection db = null;
    private static void openDatabase(String dbFile) {
        try {
            Class.forName("org.sqlite.JDBC");
            SQLiteConfig config = new SQLiteConfig();
            config.enforceForeignKeys(true);
            db = DriverManager.getConnection("jdbc:sqlite:resources/" + dbFile, config.toProperties());
        } catch (Exception exception) {
            System.out.println("Database connection error: " + exception.getMessage());
        }
    }
    private static void closeDatabase() {
        try {
            db.close();
        } catch (Exception exception) {
            System.out.println("Database connection error: " + exception.getMessage());
        }
    }
}