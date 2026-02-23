package com.example.musify.repository;
import com.example.musify.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlternativeTitleRepository extends JpaRepository <AlternativeTitle, Long>{
}
