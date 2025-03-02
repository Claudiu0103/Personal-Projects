#include <Keypad.h>
#include <LiquidCrystal.h>

const byte ROWS = 4;
const byte COLS = 4;

char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'0', '*', '#', 'D'}
};

byte rowPins[ROWS] = {23, 25, 27, 29};
byte colPins[COLS] = {31, 33, 35, 37};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

LiquidCrystal lcd(7, 6, 5, 4, 3, 2);

String pinCorect = "1234";
String pinIntroducere = "";
int incercari = 0;
int soldCont = 1000;
int stare = 0;

void setup() {
  lcd.begin(16, 2);
  lcd.clear();
  lcd.print("Bun venit la ATM!");
  delay(2000);
  afiseazaIntroducerePIN();
}

void loop() {
  char key = keypad.getKey();

  if (key) {
    switch (stare) {
      case 0:
        if (key == '#') {
          if (pinIntroducere == pinCorect) {
            incercari = 0;
            pinIntroducere = "";
            afiseazaMeniuPrincipal();
          } else {
            incercari++;
            lcd.clear();
            lcd.print("PIN gresit!");
            delay(3000);
            lcd.clear();
            pinIntroducere = "";
            if (incercari >= 3) {
              lcd.clear();
              lcd.print("Prea multe");
              lcd.setCursor(0, 1);
              lcd.print("incercari!");
              delay(3000);
              for (int i = 10; i > 0; i--) {
                lcd.clear();
                lcd.print("Blocat: ");
                lcd.print(i);
                lcd.print(" sec");
                delay(1000);
              }

              lcd.clear();
              lcd.print("Reintrodu PIN:");
              delay(2000);
              resetare();
            } else {
              afiseazaIntroducerePIN();
            }

          }
        } else if (key == '*') {
          pinIntroducere = "";
          lcd.clear();
          lcd.print("PIN sters");
          delay(1000);
          afiseazaIntroducerePIN();
        } else {
          if (key >= '0' && key <= '9') {
            pinIntroducere += key;
            lcd.clear();
            lcd.print("PIN: ");
            for (int i = 0; i < pinIntroducere.length(); i++) {
              lcd.print("*");
            }
          }
        }
        break;

      case 1:
        if (key == '1') {
          lcd.clear();
          lcd.print("Sold: ");
          lcd.print(soldCont);
          lcd.print(" lei");
          delay(2000);
          afiseazaMeniuPrincipal();
        } else if (key == '2') {
          stare = 2;
          pinIntroducere = "";
          lcd.clear();
          lcd.print("Suma retragere?");
          lcd.setCursor(0, 1);
          lcd.print("E pt OK");
        } else if (key == '3') {
          resetare();
        } else if (key == '4') {
          stare = 3;
          pinIntroducere = "";
          lcd.clear();
          lcd.print("Suma depunere?");
          lcd.setCursor(0, 1);
          lcd.print("E pt OK");
        }
        break;

      case 2:
        if (key == '#') {
          int sumaRetrasa = pinIntroducere.toInt();
          if (sumaRetrasa > 0 && sumaRetrasa <= soldCont) {
            soldCont -= sumaRetrasa;
            lcd.clear();
            lcd.print("Retragere OK!");
            delay(2000);
          } else {
            lcd.clear();
            lcd.print("Suma invalida!");
            delay(2000);
          }
          pinIntroducere = "";
          afiseazaMeniuPrincipal();
        } else if (key == '*') {
          pinIntroducere = "";
          lcd.clear();
          lcd.print("Sters suma");
          delay(1000);
          lcd.clear();
          lcd.print("Suma retragere?");
          lcd.setCursor(0, 1);
          lcd.print("E pt OK");
        } else if (key >= '0' && key <= '9') {
          pinIntroducere += key;
          lcd.clear();
          lcd.print("Suma: ");
          lcd.print(pinIntroducere);
          lcd.setCursor(0, 1);
          lcd.print("E pt confirmare");
        }
        break;

      case 3:
        if (key == '#') {
          int sumaDepusa = pinIntroducere.toInt();
          if (sumaDepusa > 0) {
            soldCont += sumaDepusa;
            lcd.clear();
            lcd.print("Depunere OK!");
            delay(2000);
          } else {
            lcd.clear();
            lcd.print("Suma invalida!");
            delay(2000);
          }
          pinIntroducere = "";
          afiseazaMeniuPrincipal();
        } else if (key == '*') {
          pinIntroducere = "";
          lcd.clear();
          lcd.print("Sters suma");
          delay(1000);
          lcd.clear();
          lcd.print("Suma depunere?");
          lcd.setCursor(0, 1);
          lcd.print("E pt OK");
        } else if (key >= '0' && key <= '9') {
          pinIntroducere += key;
          lcd.clear();
          lcd.print("Suma: ");
          lcd.print(pinIntroducere);
          lcd.setCursor(0, 1);
          lcd.print("E pt confirmare");
        }
        break;
    }
  }
}

void afiseazaIntroducerePIN() {
  stare = 0;
  lcd.clear();
  lcd.print("Introdu PIN:");
  lcd.setCursor(0, 1);
  lcd.print("E pt OK F pt del");
}

void afiseazaMeniuPrincipal() {
  stare = 1;
  lcd.clear();
  lcd.print("1:Sold 2:Retrag");
  lcd.setCursor(0, 1);
  lcd.print("3:Reset 4:Depun");
}

void resetare() {
  stare = 0;
  pinIntroducere = "";
  incercari = 0;
  lcd.clear();
  lcd.print("Resetare...");
  delay(2000);
  afiseazaIntroducerePIN();
}


