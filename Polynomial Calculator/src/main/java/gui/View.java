package gui;

import javax.swing.*;
import java.awt.*;

public class View extends JFrame {
    private JPanel contentPane;
    private JPanel numbersPanel;
    private JLabel firstNumberLabel;
    private JTextField firstNumberTextField;
    private JLabel secondNumberLabel;
    private JTextField secondNumberTextField;
    private JLabel operationsLabel;
    private JComboBox operationsComboBox;
    private JButton computeButton;
    private JPanel resultPanel;
    private JLabel resultLabel;
    private JLabel resultValueLabel;

    Controller controller = new Controller(this);

    public View(String name) {
        super(name);
        this.prepareGui();
    }

    public void prepareGui(){
        this.setSize(500, 500);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.contentPane = new JPanel(new GridLayout(2, 2));
        this.prepareNumbersPanel();
        this.prepareResultPanel();
        this.setContentPane(this.contentPane);
    }

    private void prepareResultPanel() {
        this.resultPanel = new JPanel();
        this.resultPanel.setLayout(new GridLayout(1,1));
        this.resultLabel = new JLabel("Result", JLabel.CENTER);
        this.resultValueLabel = new JLabel("", JLabel.CENTER);
        this.resultPanel.add(this.resultLabel);
        this.resultPanel.add(this.resultValueLabel);
        this.contentPane.add(this.resultPanel);
    }

    private void prepareNumbersPanel() {
        this.numbersPanel = new JPanel();
        this.numbersPanel.setLayout(new GridLayout(5, 2));
        this.firstNumberLabel = new JLabel("First Polynomial", JLabel.CENTER);
        this.numbersPanel.add(this.firstNumberLabel);
        this.firstNumberTextField = new JTextField();
        this.numbersPanel.add(this.firstNumberTextField);
        this.secondNumberLabel = new JLabel("Second Polynomial", JLabel.CENTER);
        this.numbersPanel.add(secondNumberLabel);
        this.secondNumberTextField = new JTextField();
        this.numbersPanel.add(secondNumberTextField);
        this.operationsLabel = new JLabel("Select operation", JLabel.CENTER);
        this.numbersPanel.add(this.operationsLabel);
        String[] operations = new String[]{"Add", "Subtract", "Multiply","Divide","Derivative","Integration"};
        this.operationsComboBox = new JComboBox(operations);
        this.numbersPanel.add(operationsComboBox);
        this.computeButton = new JButton("Compute");
        this.computeButton.setActionCommand("COMPUTE");
        this.computeButton.addActionListener(this.controller);
        this.numbersPanel.add(this.computeButton);
        this.contentPane.add(this.numbersPanel);
    }

    public JTextField getFirstNumberTextField() {
        return firstNumberTextField;
    }

    public JTextField getSecondNumberTextField() {
        return secondNumberTextField;
    }

    public JComboBox getOperationsComboBox() {
        return operationsComboBox;
    }

    public JLabel getResultValueLabel() {
        return resultValueLabel;
    }
}
