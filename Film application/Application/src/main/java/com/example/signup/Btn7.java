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

public class Btn7 implements Initializable  {
    @FXML
    private TableView<query7> tableView;
    @FXML
    private TableColumn<query7,Integer> id_prod;
    @FXML
    private TableColumn<query7,String> nume_prod;
    @FXML
    private TableColumn<query7,Integer> nr_filme;
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
                List<query7> act7=DBUtils.action7();
                tableView.getItems().addAll(act7);
                id_prod.setCellValueFactory(new PropertyValueFactory<>("id_prod"));
                nume_prod.setCellValueFactory(new PropertyValueFactory<>("nume_prod"));
                nr_filme.setCellValueFactory(new PropertyValueFactory<>("nr_filme"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }
    }
}
