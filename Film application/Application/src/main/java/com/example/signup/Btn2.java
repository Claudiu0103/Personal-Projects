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

public class Btn2 implements Initializable {
    @FXML
    private TableView<query2> tableView;

    @FXML
    private TableColumn<query2, Integer> idColumn;

    @FXML
    private TableColumn<query2, String> nameColumn;

    @FXML
    private TableColumn<query2, String> addressColumn;

    @FXML
    private TableColumn<query2, String> sexColumn;

    @FXML
    private TableColumn<query2, String> birthDateColumn;

    @FXML
    private TableColumn<query2, Double> netIncomeColumn;

    @FXML
    private TableColumn<query2, String> currencyColumn;
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
                List<query2> act2=DBUtils.action2();
                tableView.getItems().addAll(act2);
                idColumn.setCellValueFactory(new PropertyValueFactory<>("id_pers"));
                nameColumn.setCellValueFactory(new PropertyValueFactory<>("nume"));
                addressColumn.setCellValueFactory(new PropertyValueFactory<>("adresa"));
                sexColumn.setCellValueFactory(new PropertyValueFactory<>("sex"));
                birthDateColumn.setCellValueFactory(new PropertyValueFactory<>("data_nasterii"));
                netIncomeColumn.setCellValueFactory(new PropertyValueFactory<>("castig_net"));
                currencyColumn.setCellValueFactory(new PropertyValueFactory<>("moneda"));
            }catch (SQLException e){
                throw new RuntimeException(e);
            }
        }
    }
}
