package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query5 {
    private String nume;
    private int castig_net;
    public query5(ResultSet resultSet)throws SQLException{
        if(resultSet==null){
            System.out.println("result set invalid");
        }else{
            this.nume=resultSet.getString("nume");
            this.castig_net=resultSet.getInt("castig_net");
        }
    }
}
