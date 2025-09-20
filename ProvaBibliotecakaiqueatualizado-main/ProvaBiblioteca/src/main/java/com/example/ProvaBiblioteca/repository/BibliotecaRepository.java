package com.example.ProvaBiblioteca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ProvaBiblioteca.model.BibliotecarioModel;

@Repository

public interface BibliotecaRepository extends JpaRepository<BibliotecarioModel, Long> {
    // Define any custom query methods if needed
}