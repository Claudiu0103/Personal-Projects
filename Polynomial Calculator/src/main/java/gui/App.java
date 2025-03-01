package gui;

import javax.swing.*;

public class App
{
    public static void main( String[] args )
    {
        JFrame frame = new View("Polynomial Calculator");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        // frame.pack();
        frame.setVisible(true);
    }
}
