package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query3{
     private String nume_studio;
     private int id_presedinte;
     private String nume_prod;

     public query3(ResultSet resultSet) throws SQLException {
         if(resultSet==null){
             System.out.println("result set invalid");
         }else{
             this.nume_studio = resultSet.getString("Nume Studio");
             this.id_presedinte = resultSet.getInt("Presedinte");
             this.nume_prod = resultSet.getString("Numele Producatorului");
         }
     }

    public String getNume_studio() {
        return nume_studio;
    }

    public int getId_presedinte() {
        return id_presedinte;
    }

    public String getNume_prod() {
        return nume_prod;
    }
}
