package com.example.signup;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

import java.net.URL;
import java.sql.SQLException;
import java.util.List;
import java.util.ResourceBundle;

public class Btn6 implements Initializable {
    @FXML
    private TableView<query6> tableView;
    @FXML
    private TableColumn<query6,String> titlu;
    @FXML
    private TableColumn<query6,Integer> an;
    @FXML
    private TableColumn<query6,Integer> durata;
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
        if(tableView!=null){
            try{
                List<query6> act6=DBUtils.action6();
                tableView.getItems().addAll(act6);
                titlu.setCellValueFactory(new PropertyValueFactory<>("titlu"));
                an.setCellValueFactory(new PropertyValueFactory<>("an"));
                durata.setCellValueFactory(new PropertyValueFactory<>("durata"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }
    }
}
