package com.example.ProvaBiblioteca.repository;

import com.example.ProvaBiblioteca.model.LivrosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivrosRepository extends JpaRepository<LivrosModel, Long> {
    // ...existing code...
}