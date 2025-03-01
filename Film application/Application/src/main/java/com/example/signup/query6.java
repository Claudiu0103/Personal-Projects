package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query6 {
    private String titlu;
    private int an;
    private int durata;
    public query6(ResultSet resultSet)throws SQLException{
        if(resultSet==null){
            System.out.println("result set invalid");
        }else{
            this.titlu=resultSet.getString("titlu");
            this.an=resultSet.getInt("an");
            this.durata=resultSet.getInt("durata");
        }
    }

    public String getTitlu() {
        return titlu;
    }

    public int getAn() {
        return an;
    }

    public int getDurata() {
        return durata;
    }
}
