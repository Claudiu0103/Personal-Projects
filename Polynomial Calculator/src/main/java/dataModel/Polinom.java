package dataModel;

import java.text.DecimalFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import businessLogic.Operations;

public class Polinom {
    private Map<Integer, Double> props;

    public Polinom() {
        props = new HashMap<>();
    }

    public Polinom(String s) {
        props = new HashMap<>();
        double coef = 0;
        int exp = 0;
        int ok = 1;
        if (s == null) {
            throw new IllegalArgumentException("Polynomial null");
        }
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c) || c == '^' || c == '*' || c == 'x' || c == ' ' || c == '+' || c == '-' || c == '.') {
                ok = 1;
            } else {
                ok = 0;
            }
        }
        if (ok == 0) {
            throw new IllegalArgumentException("Invalid characters");
        }
        s = s.replaceAll("\\s*", "");
        String sablon = "[+-]?(\\d+)?\\*?x?\\^?(\\d+)?";
        Pattern pattern = Pattern.compile(sablon);
        Matcher matcher = pattern.matcher(s);
        while (matcher.find()) {
            if (!matcher.group().isEmpty()) {
                if (matcher.group(1) != null && matcher.group(2) != null) {
                    coef = Double.parseDouble(matcher.group(1));
                    exp = Integer.parseInt(matcher.group(2));
                } else if (matcher.group(1) == null && matcher.group(2) != null) {
                    coef = 1.0;
                    exp = Integer.parseInt(matcher.group(2));
                } else if (matcher.group(1) != null && matcher.group(2) == null){
                    if(matcher.group().contains("x")) {
                        coef = Double.parseDouble(matcher.group(1));
                        exp = 1;
                    }
                    else{
                        coef = Double.parseDouble(matcher.group(1));
                        exp = 0;
                    }
                }
                else{
                    coef=1.0;
                    exp=1;
                }
                if(matcher.group().startsWith("-")){
                    coef=coef*-1;
                }
            }
            props.put(exp,coef);
        }

    }

    public int degree() {
        int degree = 0;
        for (Map.Entry<Integer, Double> e : this.props.entrySet()) {
            if (e.getKey() > degree) {
                degree = e.getKey();
            }
        }
        return degree;
    }

    @Override
    public String toString() {

        DecimalFormat f = new DecimalFormat("#.###");
        Operations.reduce(this);
        if (this.props.isEmpty()) {
            this.props.put(1, 0.0);
        }
        StringBuilder s1 = new StringBuilder();
        List<Map.Entry<Integer, Double>> sortedEntries = new ArrayList<>(this.props.entrySet());
        sortedEntries.sort((entry1, entry2) -> entry2.getKey().compareTo(entry1.getKey()));
        for (Map.Entry<Integer, Double> entry : sortedEntries) {
            if (entry.getValue() > 0) {
                if (entry.getValue() == 1) {
                    if (entry.getKey() == 0) {
                        s1.append(" + ").append(f.format(entry.getValue()));
                    } else if (entry.getKey() == 1) {
                        s1.append(" + ").append("x");
                    } else {
                        s1.append(" + ").append("x^").append(entry.getKey());
                    }
                } else {
                    if (entry.getKey() > 0) {
                        if (entry.getKey() == 1) {
                            s1.append(" + ").append(f.format(entry.getValue())).append("*x");
                        } else {
                            s1.append(" + ").append(f.format(entry.getValue())).append("*x").append("^").append(entry.getKey());
                        }
                    } else {
                        s1.append(" + ").append(f.format(entry.getValue()));
                    }
                }

            } else if (entry.getValue() < 0) {
                if (entry.getValue() == -1) {
                    if (entry.getKey() == 0) {
                        double aux = entry.getValue();
                        aux = aux * -1;
                        entry.setValue(aux);
                        s1.append(" - ").append(f.format(entry.getValue()));
                    } else if (entry.getKey() == 1) {
                        double aux = entry.getValue();
                        aux = aux * -1;
                        entry.setValue(aux);
                        s1.append(" - ").append("x");
                    } else {
                        double aux = entry.getValue();
                        aux = aux * -1;
                        entry.setValue(aux);
                        s1.append(" - ").append("x^").append(entry.getKey());
                    }
                } else {
                    if (entry.getKey() > 0) {
                        if (entry.getKey() == 1) {
                            double aux = entry.getValue();
                            aux = aux * -1;
                            entry.setValue(aux);
                            s1.append(" - ").append(f.format(entry.getValue())).append("*x");
                        } else {
                            double aux = entry.getValue();
                            aux = aux * -1;
                            entry.setValue(aux);
                            s1.append(" - ").append(f.format(entry.getValue())).append("*x").append("^").append(entry.getKey());
                        }
                    } else if (entry.getKey() == 0) {
                        double aux = entry.getValue();
                        aux = aux * -1;
                        entry.setValue(aux);
                        s1.append(" - ").append(f.format(entry.getValue()));
                    } else {
                        double aux = entry.getValue();
                        aux = aux * -1;
                        entry.setValue(aux);
                        s1.append(" - ").append(f.format(entry.getValue()));
                    }
                }
            } else {
                s1.append(" 0 ");
            }
        }
        if (s1.charAt(1) == '-') {
            s1.deleteCharAt(0);
            s1.deleteCharAt(1);
        } else if (s1.charAt(1) == '0') {
            s1.deleteCharAt(0);
            s1.deleteCharAt(1);
        } else {
            s1.delete(0, 3);
        }
        return s1.toString();
    }

    public Map<Integer, Double> getProps() {
        return props;
    }
}