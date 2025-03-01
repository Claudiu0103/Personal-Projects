package com.example.signup;

import java.sql.ResultSet;
import java.sql.SQLException;

public class query2 {
    private int id_pers;
    private String nume;
    private String adresa;
    private String sex;
    private String data_nasterii;
    private int castig_net;
    private String moneda;
    public query2 (ResultSet resultSet)throws SQLException {
        if(resultSet==null)
            System.out.println("result set invalid");
        else{
            this.id_pers=resultSet.getInt("id_persoana");
            this.nume=resultSet.getString("nume");
            this.adresa=resultSet.getString("adresa");
            this.sex=resultSet.getString("sex");
            this.data_nasterii=resultSet.getString("data_nasterii");
            this.castig_net=resultSet.getInt("castig_net");
            this.moneda=resultSet.getString("moneda");
        }

    }

    public int getId_pers() {
        return id_pers;
    }

    public String getNume() {
        return nume;
    }

    public String getAdresa() {
        return adresa;
    }

    public String getSex() {
        return sex;
    }

    public String getData_nasterii() {
        return data_nasterii;
    }

    public int getCastig_net() {
        return castig_net;
    }

    public String getMoneda() {
        return moneda;
    }
}
