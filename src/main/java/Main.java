import org.sqlite.SQLiteConfig;
import java.sql.Connection;
import java.sql.DriverManager;
// importing the necessary libraries

public class Main {
    // main function
    public static void main(String[] args) {
        openDatabase("Database.db");

        ControllerEnrollment.deleteEnrollment(2, 1);

        // database manipulation code goes here...

        closeDatabase();
    }

    // global variable 'db' as the connection
    public static Connection db = null;
    // function to open the database
    private static void openDatabase(String dbFile) {
        try {
            Class.forName("org.sqlite.JDBC");
            SQLiteConfig config = new SQLiteConfig();
            config.enforceForeignKeys(true);
            // assigns the database path to the variable 'db'
            db = DriverManager.getConnection("jdbc:sqlite:resources/" + dbFile, config.toProperties());
            // prints a success message to the console
            System.out.println("Successfully connected to the Database");
        } catch (Exception exception) {
            // prints an error message to the console
            System.out.println("Database connection error: " + exception.getMessage());
        }
    }

    // function to close the database
    private static void closeDatabase() {
        try {
            // closes the connection
            db.close();
            // prints a success message to the console
            System.out.println("Successfully disconnected from the Database");
        } catch (Exception exception) {
            // prints an error message to the console
            System.out.println("Database connection error: " + exception.getMessage());
        }
    }
}
