package com.example.signup;

import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DBUtils {
    public static void changeScene(ActionEvent event, String fxmlFile, String title) {
        Parent root = null;
        try {
            FXMLLoader loader = new FXMLLoader(DBUtils.class.getResource(fxmlFile));
            root = loader.load();

        } catch (IOException e) {
            e.printStackTrace();
        }
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setTitle(title);
        stage.setScene(new Scene(root, 600, 400));
        stage.show();
    }

    public static void changeScene2(ActionEvent event, String fxmlFile, String title, String nume, int castig) {
        Parent root = null;
        try {
            FXMLLoader loader = new FXMLLoader(DBUtils.class.getResource(fxmlFile));
            root = loader.load();
            Btn5 btn5 = loader.getController();
            btn5.setrez5(nume, castig);


        } catch (IOException e) {
            e.printStackTrace();
        }
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setTitle(title);
        stage.setScene(new Scene(root, 600, 400));
        stage.show();
    }

    public static void changeScene3(ActionEvent event, String fxmlFile, String title, int min, int max) {
        Parent root = null;
        try {
            FXMLLoader loader = new FXMLLoader(DBUtils.class.getResource(fxmlFile));
            root = loader.load();
            Btn8 btn8 = loader.getController();
            btn8.setrez81(min);
            btn8.setrez82(max);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setTitle(title);
        stage.setScene(new Scene(root, 600, 400));
        stage.show();
    }

    public static List<query1> action1() throws SQLException {
        List<query1> rez1 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM Film WHERE gen = 'copii' ORDER BY an ASC, titlu ASC;");
            while (resultSet.next()) {
                query1 aux = new query1(resultSet);
                rez1.add(aux);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez1;
    }

    public static List<query2> action2() throws SQLException {
        List<query2> rez2 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select * from persoana where castig_net > 100000 and moneda='USD';");
            while (resultSet.next()) {
                query2 aux2 = new query2(resultSet);
                rez2.add(aux2);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez2;
    }

    public static List<query3> action3() throws SQLException {
        List<query3> rez3 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT Studio.nume AS \"Nume Studio\", Studio.id_presedinte AS \"Presedinte\", Persoana.nume AS \"Numele Producatorului\" FROM Film JOIN Studio ON Film.studio = Studio.nume JOIN Persoana ON Film.id_producator = Persoana.id_persoana WHERE Film.titlu = 'Barry' AND Film.an = 2018;");
            while (resultSet.next()) {
                query3 aux3 = new query3(resultSet);
                rez3.add(aux3);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez3;
    }

    public static List<query4> action4() throws SQLException {
        List<query4> rez4 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT dis1.id_actor \"Primul actor\",pers1.nume \"Nume actor 1\", dis2.id_actor \"Al doilea actor\",pers2.nume \"Nume actor 2\"\n" +
                    "FROM Distributie dis1 JOIN Distributie dis2 ON dis1.titlu_film = dis2.titlu_film AND dis1.an_film = dis2.an_film AND dis1.id_actor < dis2.id_actor -- aceasta conditie se foloseste pentru a fi unica perechea\n" +
                    "JOIN Persoana pers1 ON dis1.id_actor = pers1.id_persoana JOIN Persoana pers2 ON dis2.id_actor = pers2.id_persoana\n" +
                    "WHERE pers1.sex != pers2.sex;    ");
            while (resultSet.next()) {
                query4 aux4 = new query4(resultSet);
                rez4.add(aux4);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez4;
    }

    public static void action5(ActionEvent event) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT nume, castig_net\n" +
                    "FROM Persoana\n" +
                    "WHERE sex= 'F' and castig_net = (\n" +
                    "  SELECT MIN(castig_net)\n" +
                    "  FROM Persoana\n" +
                    ");");
            if (resultSet.isBeforeFirst()) {
                while (resultSet.next()) {
                    changeScene2(event, "Btn5.fxml", "Query 5.1", resultSet.getString("nume"), resultSet.getInt("castig_net"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static List<query6> action6() throws SQLException {
        List<query6> rez6 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT titlu, an, durata\n" +
                    "FROM Film\n" +
                    "WHERE durata > ALL (\n" +
                    "  SELECT durata\n" +
                    "  FROM Film\n" +
                    "  WHERE titlu = 'Bohemian Rhapsody' AND an = 2018\n" +
                    ");");
            while (resultSet.next()) {
                query6 aux6 = new query6(resultSet);
                rez6.add(aux6);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez6;
    }

    public static List<query7> action7() throws SQLException {
        List<query7> rez7 = new ArrayList<>();
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT f.id_producator, p.nume AS \"Nume Producator\", COUNT(f.id_producator) AS \"Numar Filme SF\"\n" +
                    "FROM Film f JOIN Persoana p ON f.id_producator = p.id_persoana\n" +
                    "WHERE f.gen = 'SF'\n" +
                    "GROUP BY f.id_producator, p.nume;");
            while (resultSet.next()) {
                query7 aux7 = new query7(resultSet);
                rez7.add(aux7);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rez7;
    }

    public static void action8(ActionEvent event) throws SQLException {
        try {
            Connection connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/film", "root", "Cl@u01032003");
            CallableStatement statement = connection.prepareCall("CALL MinMaxCastigNet");
            statement.execute();
            ResultSet resultSet = null;
            resultSet = statement.getResultSet();
            if (resultSet.isBeforeFirst()) {
                while (resultSet.next()) {
                    changeScene3(event, "Btn8.fxml", "Query 6.2", resultSet.getInt("Castig Minim"), resultSet.getInt("Castig Maxim"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
