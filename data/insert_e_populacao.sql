CREATE TABLE funcionario (
    id_func SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario NUMERIC(10,2) NOT NULL,
    departamento VARCHAR(50) NOT NULL
);


INSERT INTO funcionario (nome, cpf, cargo, salario, departamento) VALUES
('Ana Souza', '12345678901', 'Analista', 4500.00, 'TI'),
('Bruno Lima', '23456789012', 'Gerente', 7000.00, 'Vendas'),
('Carla Mendes', '34567890123', 'Assistente', 3000.00, 'Financeiro'),
('Diego Rocha', '45678901234', 'Analista', 4500.00, 'TI'),
('Fernanda Alves', '56789012345', 'Gerente', 7000.00, 'RH');


CREATE TABLE aluno (
    ra INT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    curso VARCHAR(10) NOT NULL,
    periodo VARCHAR(10) NOT NULL
);


INSERT INTO aluno (ra, nome, curso, periodo) VALUES
(1001, 'João', 'ADS', 'Noturno'),
(1002, 'Maria', 'ADS', 'Noturno'),
(1003, 'Pedro', 'SI', 'Diurno'),
(1004, 'Ana', 'ADS', 'Noturno'),
(1005, 'Lucas', 'SI', 'Diurno');
