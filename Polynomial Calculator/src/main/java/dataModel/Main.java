package dataModel;

import businessLogic.Operations;

public class Main {
    public static void main(String[] args) {
        /*Scanner scanner = new Scanner(System.in);
        String p1 = scanner.nextLine();
        String p2 = scanner.nextLine();
        System.out.println(p1);
        System.out.println(p2);
        scanner.close();*/

        /*Polinom p1 = new Polinom("3*x");
        Polinom p2 = new Polinom("1");
        Polinom[] rez=Operations.impartire(p1,p2);
        System.out.println(Arrays.toString(Operations.impartire(p1, p2)));*/

        //System.out.println(Operations.impartire(p1,p2));
        /*p2.props.put(2.0,1.0);
        p2.props.put(1.0,-4.0);

        p1.props.put(4.0,2.0);
        p1.props.put(2.0,1.0);
        p1.props.put(1.0,1.0);
        p1.props.put(0.0,-3.0);


        Polinom[] rez = new Polinom[2];
        rez=Operations.impartire(p1,p2);
        System.out.println(Arrays.toString(Operations.impartire(p1, p2)));*/

        /*p1.props.put(5.0,4.0);
        p1.props.put(4.0,-3.0);
        p1.props.put(2.0,1.0);
        p1.props.put(1.0,-8.0);
        p1.props.put(0.0,1.0);

        p2.props.put(4.0,3.0);
        p2.props.put(3.0,-1.0);
        p2.props.put(2.0,1.0);
        p2.props.put(1.0,2.0);
        p2.props.put(0.0,-1.0);

        System.out.println(Operations.adunare(p1,p2));*/
        Polinom p1=new Polinom("1");
        Polinom p2=new Polinom("-x");
        System.out.println(Operations.inmultire(p1,p2));
    }
}