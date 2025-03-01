package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query7 {
    private int id_prod;
    private String nume_prod;
    private int nr_filme;
    public query7(ResultSet resultSet)throws SQLException{
        if(resultSet==null){
            System.out.println("result set invalid");
        }else {
            this.id_prod = resultSet.getInt("id_producator");
            this.nume_prod = resultSet.getString("Nume Producator");
            this.nr_filme = resultSet.getInt("Numar Filme SF");
        }
    }

    public int getId_prod() {
        return id_prod;
    }

    public String getNume_prod() {
        return nume_prod;
    }

    public int getNr_filme() {
        return nr_filme;
    }
}
