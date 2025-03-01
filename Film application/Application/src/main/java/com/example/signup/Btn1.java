package com.example.signup;

import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

import java.io.IOException;
import java.net.URL;
import java.sql.SQLException;
import java.util.List;
import java.util.ResourceBundle;

public class Btn1 implements Initializable {
    @FXML
    private TableView<query1> tableView;
    @FXML
    private TableColumn<query1,String> titlu;
    @FXML
    private TableColumn<query1,Integer> an;
    @FXML
    private TableColumn<query1,Integer> durata;
    @FXML
    private TableColumn<query1,String> gen;
    @FXML
    private TableColumn<query1,String> studio;
    @FXML
    private TableColumn<query1,Integer> id_producator;
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
                List<query1> act1=DBUtils.action1();
                tableView.getItems().addAll(act1);
                titlu.setCellValueFactory(new PropertyValueFactory<>("titlu"));
                an.setCellValueFactory(new PropertyValueFactory<>("an"));
                durata.setCellValueFactory(new PropertyValueFactory<>("durata"));
                gen.setCellValueFactory(new PropertyValueFactory<>("gen"));
                studio.setCellValueFactory(new PropertyValueFactory<>("studio"));
                id_producator.setCellValueFactory(new PropertyValueFactory<>("id_prod"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }

    }
}
