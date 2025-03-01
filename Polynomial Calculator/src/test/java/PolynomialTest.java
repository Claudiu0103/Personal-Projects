import businessLogic.Operations;
import dataModel.Polinom;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
public class PolynomialTest {
    @Test
    public void testAdunare1(){
        Polinom a = new Polinom("x");
        Polinom b = new Polinom("-x");
        assertEquals("0", Operations.adunare(a,b).toString());
    }
    @Test
    public void testAdunare2(){
        Polinom a = new Polinom("x^2");
        Polinom b = new Polinom("-x^2");
        assertEquals("0", Operations.adunare(a,b).toString());
    }
    @Test
    public void testAdunare3(){
        Polinom a = new Polinom("x^2");
        Polinom b = new Polinom("0");
        assertEquals("x^2", Operations.adunare(a,b).toString());
    }
    @Test
    public void testAdunareGeneral(){
        Polinom a = new Polinom("4*x^5 - 3*x^4 + x^2 - 8*x+1");
        Polinom b = new Polinom("3*x^4 - x^3 + x^2 + 2*x -1");
        assertEquals("4*x^5 - x^3 + 2*x^2 - 6*x", Operations.adunare(a,b).toString());
    }
    @Test
    public void testScadere1(){
        Polinom a = new Polinom("0");
        Polinom b = new Polinom("0");
        assertEquals("0", Operations.scadere(a,b).toString());
    }
    @Test
    public void testScadere2(){
        Polinom a = new Polinom("x");
        Polinom b = new Polinom("-x");
        assertEquals("2*x", Operations.scadere(a,b).toString());
    }
    @Test
    public void testScadere3(){
        Polinom a = new Polinom("x");
        Polinom b = new Polinom("x");
        assertEquals("0", Operations.scadere(a,b).toString());
    }
    @Test
    public void testScadere4(){
        Polinom a = new Polinom("1");
        Polinom b = new Polinom("0");
        assertEquals("1", Operations.scadere(a,b).toString());
    }
    @Test
    public void testScadereGeneral(){
        Polinom a = new Polinom("4*x^5 - 3*x^4 + x^2 - 8*x+1");
        Polinom b = new Polinom("3*x^4 - x^3 + x^2 + 2*x -1");
        assertEquals("4*x^5 - 6*x^4 + x^3 - 10*x + 2", Operations.scadere(a,b).toString());
    }
    @Test
    public void testInmultire1(){
        Polinom a = new Polinom("1");
        Polinom b = new Polinom("0");
        assertEquals("0", Operations.inmultire(a,b).toString());
    }
    @Test
    public void testInmultire2(){
        Polinom a = new Polinom("1");
        Polinom b = new Polinom("-1");
        assertEquals("-1", Operations.inmultire(a,b).toString());
    }
    @Test
    public void testInmultire3(){
        Polinom a = new Polinom("1");
        Polinom b = new Polinom("-x");
        assertEquals("-x", Operations.inmultire(a,b).toString());
    }
    @Test
    public void testInmultire4(){
        Polinom a = new Polinom("-x^2");
        Polinom b = new Polinom("-x");
        assertEquals("x^3", Operations.inmultire(a,b).toString());
    }
    @Test
    public void testInmultireGeneral(){
        Polinom a = new Polinom("3*x^2 -x + 1");
        Polinom b = new Polinom("x-2");
        assertEquals("3*x^3 - 7*x^2 + 3*x - 2", Operations.inmultire(a,b).toString());
    }
    @Test
    public void testImpartire1(){
        Polinom a = new Polinom("1");
        Polinom b = new Polinom("1");
        assertEquals("[1, 0]", Arrays.toString(Operations.impartire(a, b)));
    }
    @Test
    public void testImpartire2(){
        Polinom a = new Polinom("3*x");
        Polinom b = new Polinom("2");
        assertEquals("[1.5*x, 0]", Arrays.toString(Operations.impartire(a, b)));
    }
    @Test
    public void testImpartire3(){
        try {
            Polinom a = new Polinom("3*x");
            Polinom b = new Polinom("0");
            assertEquals("Impartire cu 0", Arrays.toString(Operations.impartire(a, b)));
        }catch(IllegalArgumentException e){
            e.getMessage();
        }
    }
    @Test
    public void testImpartireGeneral(){
        Polinom a = new Polinom("x^3 - 2*x^2 + 6*x - 5");
        Polinom b = new Polinom("x^2 - 1");
        assertEquals("[x - 2, 7*x - 7]", Arrays.toString(Operations.impartire(a, b)));
    }
    @Test
    public void testDerivare1(){
        Polinom a = new Polinom("-1");
        assertEquals("0", Operations.derivare(a).toString());
    }
    @Test
    public void testDerivare2(){
        Polinom a = new Polinom("0");
        assertEquals("0", Operations.derivare(a).toString());
    }
    @Test
    public void testDerivare3(){
        Polinom a = new Polinom("x");
        assertEquals("1", Operations.derivare(a).toString());
    }
    @Test
    public void testDerivareGenerala(){
        Polinom a = new Polinom("x^3 - 2*x^2 + 6*x - 5");
        assertEquals("3*x^2 - 4*x + 6", Operations.derivare(a).toString());
    }

    @Test
    public void testIntegrare1(){
        Polinom a = new Polinom("1");
        assertEquals("x", Operations.integrare(a).toString());
    }
    @Test
    public void testIntegrare2(){
        Polinom a = new Polinom("0");
        assertEquals("0", Operations.integrare(a).toString());
    }
    @Test
    public void testIntegrareGenerala(){
        Polinom a = new Polinom("x^3 + 4*x^2 + 5");
        assertEquals("0.25*x^4 + 1.333*x^3 + 5*x", Operations.integrare(a).toString());
    }
}
