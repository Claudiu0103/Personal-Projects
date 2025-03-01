package com.example.signup;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Film {
    private String titlu;
    private int an;
    private int durata;
    private String nume_prod;
    public Film(ResultSet resultSet)throws SQLException {
        if(resultSet==null){
            System.out.println("result set invalid");
        }else{
            this.titlu=resultSet.getString("");
            this.an=resultSet.getInt("an");
            this.durata=resultSet.getInt("durata");
            this.nume_prod=resultSet.getString("");
        }

    }
    public void setTitlu(String titlu) {
        this.titlu = titlu;
    }

    public void setAn(int an) {
        this.an = an;
    }

    public void setDurata(int durata) {
        this.durata = durata;
    }

    public void setNume_prod(String nume_prod) {
        this.nume_prod = nume_prod;
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

    public String getNume_prod() {
        return nume_prod;
    }
}
