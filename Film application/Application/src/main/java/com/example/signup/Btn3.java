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

public class Btn3 implements Initializable {
    @FXML
    private TableView<query3> tableView;
    @FXML
    private TableColumn<query3,String> nume_studio;
    @FXML
    private TableColumn<query3,Integer> id_presedinte;
    @FXML
    private TableColumn<query3,String> nume_presedinte;
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
                List<query3> act3=DBUtils.action3();
                tableView.getItems().addAll(act3);
                nume_studio.setCellValueFactory(new PropertyValueFactory<>("nume_studio"));
                id_presedinte.setCellValueFactory(new PropertyValueFactory<>("id_presedinte"));
                nume_presedinte.setCellValueFactory(new PropertyValueFactory<>("nume_prod"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }
    }
}
