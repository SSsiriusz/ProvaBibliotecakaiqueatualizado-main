CREATE TABLE bibliotecarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE livros (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bibliotecario_id BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Disponível',
    data_cadastro DATE NOT NULL,
    CONSTRAINT fk_bibliotecario
        FOREIGN KEY (bibliotecario_id)
        REFERENCES bibliotecarios(id)
);
