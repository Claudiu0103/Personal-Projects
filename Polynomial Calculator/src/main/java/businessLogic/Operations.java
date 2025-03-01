package businessLogic;

import dataModel.Polinom;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class Operations {
    public static void reduce(Polinom a) {
        Iterator<Map.Entry<Integer, Double>> iterator = a.getProps().entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<Integer, Double> e = iterator.next();
            if (e.getValue() == 0) {
                iterator.remove(); //
            }
        }
    }

    public static Polinom adunare(Polinom a, Polinom b) {
        Polinom rezultat = new Polinom();
        for (Map.Entry<Integer, Double> e1 : a.getProps().entrySet()) {
            rezultat.getProps().put(e1.getKey(), e1.getValue());
        }
        for (Map.Entry<Integer, Double> e2 : b.getProps().entrySet()) {
            int putere = e2.getKey();
            double coeficient = e2.getValue();
            if (rezultat.getProps().containsKey(putere)) {
                double coeficientVechi = rezultat.getProps().get(putere);
                rezultat.getProps().put(putere, coeficientVechi + coeficient);
            } else {
                rezultat.getProps().put(putere, coeficient);
            }
        }
        return rezultat;
    }

    public static Polinom scadere(Polinom a, Polinom b) {
        Polinom rezultat = new Polinom();
        for (Map.Entry<Integer, Double> e1 : a.getProps().entrySet()) {
            rezultat.getProps().put(e1.getKey(), e1.getValue());
        }
        for (Map.Entry<Integer, Double> e2 : b.getProps().entrySet()) {
            int putere = e2.getKey();
            double coeficient = e2.getValue();
            if (rezultat.getProps().containsKey(putere)) {
                double coeficientVechi = rezultat.getProps().get(putere);
                rezultat.getProps().put(putere, coeficientVechi - coeficient);
            } else {
                coeficient *= -1;
                rezultat.getProps().put(putere, coeficient);
            }
        }
        return rezultat;
    }

    public static Polinom inmultire(Polinom a, Polinom b) {
        Polinom rezultat = new Polinom();
        reduce(a);
        reduce(b);
        for (Map.Entry<Integer, Double> e1 : a.getProps().entrySet()) {
            for (Map.Entry<Integer, Double> e2 : b.getProps().entrySet()) {
                int p1 = e1.getKey();
                double c1 = e1.getValue();
                int p2 = e2.getKey();
                double c2 = e2.getValue();
                int new_p = p1 + p2;
                double new_c = c1 * c2;
                if (rezultat.getProps().containsKey(new_p)) {
                    double aux = rezultat.getProps().get(new_p);
                    aux += new_c;
                    rezultat.getProps().put(new_p, aux);
                } else {
                    rezultat.getProps().put(new_p, new_c);
                }
            }
        }
        return rezultat;
    }

    public static Polinom[] impartire(Polinom a, Polinom b) {
        Polinom[] rezultat = new Polinom[2];
        Polinom r = new Polinom();
        Polinom q = new Polinom();
        int aux = 0;
        r=a;
        for (Map.Entry<Integer, Double> e : b.getProps().entrySet()) {
            if (e.getValue() != 0) {
                aux = 1;
                break;
            }
        }
        if (aux == 0) {
            throw new IllegalArgumentException("Impartire cu 0");
        } else {
            List<Map.Entry<Integer, Double>> sortedEntries1 = new ArrayList<>(a.getProps().entrySet());
            sortedEntries1.sort((entry1, entry2) -> entry2.getKey().compareTo(entry1.getKey()));

            List<Map.Entry<Integer, Double>> sortedEntries2 = new ArrayList<>(b.getProps().entrySet());
            sortedEntries2.sort((entry1, entry2) -> entry2.getKey().compareTo(entry1.getKey()));

            while (!r.getProps().isEmpty() && r.degree()>=b.degree()){
                int rPow=r.degree();
                double rCoef= r.getProps().get(rPow);
                int dPow=b.degree();
                double dCoef= b.getProps().get(dPow);

                Polinom t=new Polinom();
                t.getProps().put(rPow-dPow,rCoef/dCoef);
                q=Operations.adunare(q,t);
                Polinom rez=new Polinom();
                rez=Operations.inmultire(t,b);
                r=Operations.scadere(r,rez);
                Operations.reduce(r);
                t.getProps().clear();
                rez.getProps().clear();
            }
        }
        rezultat[0]=q;
        rezultat[1]=r;
        return rezultat;
    }

    public static Polinom derivare(Polinom a) {
        Polinom rezultat = new Polinom();
        for (Map.Entry<Integer, Double> e : a.getProps().entrySet()) {
            if (e.getKey() != 0) {
                int aux = e.getKey();
                double coef = e.getValue();
                coef = coef * aux;
                aux -= 1;
                rezultat.getProps().put(aux, coef);
            } else {
                rezultat.getProps().put(0, 0.0);
            }
        }
        return rezultat;
    }

    public static Polinom integrare(Polinom a) {
        Polinom rezultat = new Polinom();
        for (Map.Entry<Integer, Double> e : a.getProps().entrySet()) {
            if (e.getKey() != 0) {
                int aux = e.getKey();
                double coef = e.getValue();
                aux += 1;
                coef = coef / aux;
                rezultat.getProps().put(aux, coef);
            } else {
                rezultat.getProps().put(1, e.getValue());
            }
        }
        return rezultat;
    }
}
