package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query1 {
    private String titlu;
    private int an;
    private int durata;
    private String gen;
    private String studio;
    private int id_prod;

    public query1(ResultSet resultSet) throws SQLException {
        if (resultSet == null)
            System.out.println("result set invalid");
        else {
            this.titlu = resultSet.getString("titlu");
            this.an = resultSet.getInt("an");
            this.durata = resultSet.getInt("durata");
            this.gen = resultSet.getString("gen");
            this.studio = resultSet.getString("studio");
            this.id_prod = resultSet.getInt("id_producator");
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

    public String getGen() {
        return gen;
    }

    public String getStudio() {
        return studio;
    }

    public int getId_prod() {
        return id_prod;
    }
}
