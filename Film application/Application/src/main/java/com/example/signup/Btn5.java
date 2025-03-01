package com.example.signup;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;

import java.net.URL;
import java.sql.*;
import java.util.ResourceBundle;

public class Btn5 implements Initializable {
    @FXML
    private Label rezultat;
    @FXML
    private Button back;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        back.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent actionEvent) {
                DBUtils.changeScene(actionEvent, "Menu.fxml", "Menu");
            }
        });
    }
    public void setrez5(String nume,int castig) {
        rezultat.setText("Numele actritei: "+ nume + "\n" + "Castig net: " + castig);
    }

}
