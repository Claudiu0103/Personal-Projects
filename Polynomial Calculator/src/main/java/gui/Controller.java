package gui;

import businessLogic.Operations;
import dataModel.Polinom;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Controller implements ActionListener {

    private View view;

    private Operations operations = new Operations();

    public Controller(View v) {
        this.view = v;
    }

    public void actionPerformed(ActionEvent e) {
        String command = e.getActionCommand();
        int verif = 0;
        if (view.getFirstNumberTextField().getText().isEmpty()) {
            JOptionPane.showMessageDialog(null, "Campul 1 este gol", "Eroare", JOptionPane.INFORMATION_MESSAGE);
            verif = 1;
        }
        if (view.getSecondNumberTextField().getText().isEmpty()) {
            JOptionPane.showMessageDialog(null, "Campul 2 este gol", "Eroare", JOptionPane.INFORMATION_MESSAGE);
            verif = 1;
        }
        if (verif == 0) {
            Polinom a = new Polinom(view.getFirstNumberTextField().getText());
            Polinom b = new Polinom(view.getSecondNumberTextField().getText());
            if (command == "COMPUTE") {
                String operation = String.valueOf(view.getOperationsComboBox().getSelectedItem());
                Polinom result = new Polinom();
                switch (operation) {
                    case "Add":
                        result = Operations.adunare(a, b);
                        view.getResultValueLabel().setText(result.toString());
                        break;
                    case "Subtract":
                        result = Operations.scadere(a, b);
                        view.getResultValueLabel().setText(result.toString());
                        break;
                    case "Multiply":
                        result = Operations.inmultire(a, b);
                        view.getResultValueLabel().setText(result.toString());
                        break;
                    case "Divide":
                        try {
                            Polinom[] results = new Polinom[2];
                            results = Operations.impartire(a, b);
                            view.getResultValueLabel().setText("c:" + results[0].toString() + " r:" + results[1].toString());
                        } catch (IllegalArgumentException exception) {
                            JOptionPane.showMessageDialog(null, exception.getMessage(), "Eroare", JOptionPane.INFORMATION_MESSAGE);
                        }
                        break;
                    case "Derivative":
                        result = Operations.derivare(a);
                        view.getResultValueLabel().setText(result.toString());
                        break;
                    case "Integration":
                        result = Operations.integrare(a);
                        view.getResultValueLabel().setText(result.toString());
                        break;
                }

            }
        }
    }
}
