package IS.Proiect.relations;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteCarRepository extends JpaRepository<FavoriteCar, Integer> {
    List<FavoriteCar> findByClient_IdClient(Integer clientId);

    void deleteByClient_IdClientAndCar_IdCar(Integer clientId, Integer carId);
    boolean existsByClient_IdClientAndCar_IdCar(Integer clientId, Integer carId);

}
