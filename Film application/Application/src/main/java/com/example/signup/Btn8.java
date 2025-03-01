package com.example.signup;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Label;

import java.net.URL;
import java.util.ResourceBundle;

public class Btn8 implements Initializable {
    @FXML
    private Label rezultat1;
    @FXML
    private Label rezultat2;
    @FXML
    private Button back;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        back.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent actionEvent) {
                DBUtils.changeScene(actionEvent,"Menu.fxml","Menu");
            }
        });
    }
    public void setrez81(int castig) {
        rezultat1.setText("Castig minim: " + castig);
    }
    public void setrez82(int castig) {
        rezultat2.setText("Castig maxim: " + castig);
    }
}
