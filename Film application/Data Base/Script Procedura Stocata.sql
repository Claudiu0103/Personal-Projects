CREATE DEFINER=`root`@`localhost` PROCEDURE `MinMaxCastigNet`()
BEGIN
  SELECT 
    MIN(castig_net) as "Castig Minim",
    MAX(castig_net) as "Castig Maxim"
  FROM Persoana
  WHERE id_persoana IN (
    SELECT S.id_presedinte
    FROM Studio S JOIN Persoana P ON S.id_presedinte = P.id_persoana
  );
END