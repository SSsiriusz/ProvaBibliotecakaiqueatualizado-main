package com.example.ProvaBiblioteca.controller;

import com.example.ProvaBiblioteca.model.LivrosModel;
import com.example.ProvaBiblioteca.servicer.LivrosService;
import com.example.ProvaBiblioteca.repository.BibliotecaRepository;
import com.example.ProvaBiblioteca.repository.LivrosRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/livros")
public class LivrosController {

    private final LivrosService livrosService;

    public LivrosController(LivrosRepository livrosRepository, BibliotecaRepository bibliotecarioRepository) {
        this.livrosService = new LivrosService(livrosRepository);
    }

    // Listar todos os livros
    @GetMapping
    public ResponseEntity<List<LivrosModel>> listar() {
        return ResponseEntity.ok(livrosService.listar());
    }

    // Buscar livro por ID
    @GetMapping("/{id}")
    public ResponseEntity<LivrosModel> buscarPorId(@PathVariable Long id) {
        return livrosService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cadastrar livro
    @PostMapping
    public ResponseEntity<LivrosModel> cadastrar(@RequestBody LivrosModel livro) {
        return ResponseEntity.ok(livrosService.cadastrar(livro));
    }

    // Editar livro
    @PutMapping("/{id}")
    public ResponseEntity<LivrosModel> editar(@PathVariable Long id, @RequestBody LivrosModel livro) {
        return livrosService.buscarPorId(id)
                .map(l -> ResponseEntity.ok(livrosService.editar(id, livro)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Excluir livro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (livrosService.buscarPorId(id).isPresent()) {
            livrosService.excluir(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Alterar status
    @PatchMapping("/{id}/status")
    public ResponseEntity<LivrosModel> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        return livrosService.buscarPorId(id)
                .map(l -> ResponseEntity.ok(livrosService.alterarStatus(id, status)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Exportar livros
    @GetMapping("/exportarLivros")
    public ResponseEntity<byte[]> exportarLivros() {
        List<LivrosModel> livros = livrosService.listar();
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Livros");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Título");
            header.createCell(2).setCellValue("Autor");
            header.createCell(3).setCellValue("Gênero");
            header.createCell(4).setCellValue("Status");
            header.createCell(5).setCellValue("Data Cadastro");

            int rowNum = 1;
            for (LivrosModel livro : livros) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(livro.getId());
                row.createCell(1).setCellValue(livro.getTitulo());
                row.createCell(2).setCellValue(livro.getAutor());
                row.createCell(3).setCellValue(livro.getGenero());
                row.createCell(4).setCellValue(livro.getStatus());
                row.createCell(5).setCellValue(
                        livro.getDataCadastro() != null ? livro.getDataCadastro().toString() : ""
                );
            }
            workbook.write(bos);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        byte[] bytes = bos.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "livros.xlsx");
        headers.setContentLength(bytes.length);

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }
}
