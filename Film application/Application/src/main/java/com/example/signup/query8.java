package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query8 {
    private int castig_minim;
    private int castig_maxim;
    public query8(ResultSet resultSet)throws SQLException{
        if(resultSet==null)
            System.out.println("result set invalid");
        else{
            this.castig_minim=resultSet.getInt("Castig Minim");
            this.castig_maxim=resultSet.getInt("Castig Maxim");
        }
    }
}
