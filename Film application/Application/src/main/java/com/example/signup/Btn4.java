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

public class Btn4 implements Initializable {
    @FXML
    private TableView<query4> tableView;
    @FXML
    private TableColumn<query4,Integer> id_actor1;
    @FXML
    private TableColumn<query4,String> nume_actor1;
    @FXML
    private TableColumn<query4,Integer> id_actor2;
    @FXML
    private TableColumn<query4,String> nume_actor2;
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
                List<query4> act4=DBUtils.action4();
                tableView.getItems().addAll(act4);
                id_actor1.setCellValueFactory(new PropertyValueFactory<>("primul_actor"));
                nume_actor1.setCellValueFactory(new PropertyValueFactory<>("nume_actor_1"));
                id_actor2.setCellValueFactory(new PropertyValueFactory<>("al_doilea_actor"));
                nume_actor2.setCellValueFactory(new PropertyValueFactory<>("nume_actor_2"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }
    }
}
