-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: film
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `distributie`
--

DROP TABLE IF EXISTS `distributie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributie` (
  `titlu_film` varchar(255) NOT NULL,
  `an_film` int NOT NULL,
  `id_actor` int NOT NULL,
  PRIMARY KEY (`titlu_film`,`an_film`,`id_actor`),
  KEY `id_actor` (`id_actor`),
  CONSTRAINT `distributie_ibfk_1` FOREIGN KEY (`id_actor`) REFERENCES `persoana` (`id_persoana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributie`
--

LOCK TABLES `distributie` WRITE;
/*!40000 ALTER TABLE `distributie` DISABLE KEYS */;
INSERT INTO `distributie` VALUES ('Inceputul',2010,1),('La La Land',2016,2),('Toy Story',1995,3),('Bohemian Rhapsody',2018,4),('Inceputul',2010,4),('Inceputul',2010,5),('Bohemian Rhapsody',2018,6),('La La Land',2016,6),('Bohemian Rhapsody',2018,7),('La La Land',2016,7),('Toy Story',1995,8),('Toy Story',1995,9),('Superbad',2007,10),('Bohemian Rhapsody',2018,11),('Superbad',2007,11),('Toy Story',2009,14),('Toy Story',2009,15),('Toy Story',2009,16),('Toy Story',2009,17),('Superbad',2007,18),('Superbad',2007,19);
/*!40000 ALTER TABLE `distributie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `film`
--

DROP TABLE IF EXISTS `film`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `film` (
  `titlu` varchar(255) NOT NULL,
  `an` int NOT NULL,
  `durata` int DEFAULT NULL,
  `gen` varchar(50) DEFAULT NULL,
  `studio` varchar(255) DEFAULT NULL,
  `id_producator` int DEFAULT NULL,
  PRIMARY KEY (`titlu`,`an`),
  KEY `id_producator` (`id_producator`),
  CONSTRAINT `film_ibfk_1` FOREIGN KEY (`id_producator`) REFERENCES `persoana` (`id_persoana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `film`
--

LOCK TABLES `film` WRITE;
/*!40000 ALTER TABLE `film` DISABLE KEYS */;
INSERT INTO `film` VALUES ('Barry',2018,103,'drama','Pixar',20),('Bohemian Rhapsody',2018,120,'drama','Universal Pictures',1),('Inceputul',2010,148,'SF','Warner Bros',1),('La La Land',2016,128,'drama','Lionsgate',2),('Superbad',2007,113,'comedie','Universal Pictures',10),('Toy Story',1995,81,'copii','Pixar',3),('Toy Story',2009,103,'copii','Pixar',13);
/*!40000 ALTER TABLE `film` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persoana`
--

DROP TABLE IF EXISTS `persoana`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persoana` (
  `id_persoana` int NOT NULL,
  `nume` varchar(255) DEFAULT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `sex` char(1) DEFAULT NULL,
  `data_nasterii` date DEFAULT NULL,
  `castig_net` decimal(10,2) DEFAULT NULL,
  `moneda` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`id_persoana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persoana`
--

LOCK TABLES `persoana` WRITE;
/*!40000 ALTER TABLE `persoana` DISABLE KEYS */;
INSERT INTO `persoana` VALUES (1,'John Doe','Strada Exemplu 123','M','1990-01-15',100010.00,'USD'),(2,'Jane Doe','Strada Test 456','F','1988-05-20',6000.50,'EUR'),(3,'Alice Johnson','Bulevardul Model 789','F','1995-08-10',4500.75,'USD'),(4,'Emily Johnson','Strada Filmului 123','F','1985-03-12',5500.00,'USD'),(5,'Michael Smith','Bulevardul Actorilor 456','M','1987-07-25',6000.50,'EUR'),(6,'Emma Thompson','Aleea Filmelor 789','F','1992-09-18',4800.75,'USD'),(7,'Daniel Brown','Strada Cinematografului 101','M','1984-11-30',7000.00,'USD'),(8,'Sophia Davis','Bulevardul Animatiilor 111','F','1998-04-05',5200.25,'USD'),(9,'William Johnson','Strada Animației 222','M','1991-06-15',6300.75,'EUR'),(10,'Emma Stone','Strada Haioaselor 777','F','1988-11-06',8000.00,'USD'),(11,'Jonah Hill','Strada Comediei 555','M','1983-12-20',7500.00,'USD'),(12,'Ron Meyer','Aleea Executivilor 456','M','1944-09-15',12000.00,'USD'),(13,'Tom Hanks','Bulevardul Actorilor 789','M','1956-07-09',15000.00,'USD'),(14,'John Lasseter','Aleea Animatiilor 987','M','1957-01-12',18000.00,'USD'),(15,'Tim Allen','Strada Actorilor 111','M','1953-06-13',12000.00,'USD'),(16,'Joan Cusack','Bulevardul Filmului 222','F','1962-10-11',10000.00,'USD'),(17,'Don Rickles','Aleea Comediei 333','M','1926-05-08',8000.00,'USD'),(18,'Michael Cera','Bulevardul Comicului 444','M','1988-06-07',11000.00,'USD'),(19,'Christopher Mintz-Plasse','Strada Haioaselor 555','M','1989-06-20',9000.00,'USD'),(20,'John Doe','Strada Haioaselor 123','M','1990-01-01',5000.00,'USD'),(22,'Bob Smith','Bulevardul Filmului 222','M','1990-01-01',5600.00,'USD');
/*!40000 ALTER TABLE `persoana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studio`
--

DROP TABLE IF EXISTS `studio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studio` (
  `nume` varchar(255) NOT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `id_presedinte` int DEFAULT NULL,
  PRIMARY KEY (`nume`),
  KEY `id_presedinte` (`id_presedinte`),
  CONSTRAINT `studio_ibfk_1` FOREIGN KEY (`id_presedinte`) REFERENCES `persoana` (`id_persoana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studio`
--

LOCK TABLES `studio` WRITE;
/*!40000 ALTER TABLE `studio` DISABLE KEYS */;
INSERT INTO `studio` VALUES ('Lionsgate','Bulevardul Filmului 987',2),('Pixar','Aleia Animației 654',3),('Universal Pictures','Strada Studiourilor 123',12),('Warner Bros','Strada Hollywood 321',1);
/*!40000 ALTER TABLE `studio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-06 11:52:38
