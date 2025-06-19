package com.example.ProvaBiblioteca.servicer;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ProvaBiblioteca.model.BibliotecarioModel;
import com.example.ProvaBiblioteca.repository.BibliotecaRepository;

@Service
public class BibliotecaServicer {
    @Autowired
    private BibliotecaRepository bibliotecaRepository;
    
    public List<BibliotecarioModel> listar() {
        return bibliotecaRepository.findAll();
    }
    public BibliotecarioModel salvar(BibliotecarioModel bibliotecaModel) {
        return bibliotecaRepository.save(bibliotecaModel);
    }

    public BibliotecarioModel atualizar(Long id, BibliotecarioModel bibliotecaModel) {
        Optional<BibliotecarioModel> optional = bibliotecaRepository.findById(id);
        if (optional.isPresent()) {
            BibliotecarioModel existente = optional.get();
            existente.setNome(bibliotecaModel.getNome());
            existente.setEmail(bibliotecaModel.getEmail());
            return bibliotecaRepository.save(existente);
        }
        return null;
    }

    public void deletar(Long id) {
        bibliotecaRepository.deleteById(id);
    }
}
