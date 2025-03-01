package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query4 {
    private int primul_actor;
    private String nume_actor_1;
    private int al_doilea_actor;
    private String nume_actor_2;
    public query4(ResultSet resultSet)throws SQLException {
        if(resultSet==null){
            System.out.println("result set invalid");
        }else {
            this.primul_actor = resultSet.getInt("Primul actor");
            this.nume_actor_1 = resultSet.getString("Nume actor 1");
            this.al_doilea_actor = resultSet.getInt("Al doilea actor");
            this.nume_actor_2 = resultSet.getString("Nume actor 2");
        }
    }

    public int getPrimul_actor() {
        return primul_actor;
    }

    public String getNume_actor_1() {
        return nume_actor_1;
    }

    public int getAl_doilea_actor() {
        return al_doilea_actor;
    }

    public String getNume_actor_2() {
        return nume_actor_2;
    }
}
