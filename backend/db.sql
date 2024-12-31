-- Crear tabla Usuario
CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Crear tabla Rol (entidad débil)
CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_usuario INT UNIQUE, -- Relación 1:1 con Usuario
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- Crear tabla Área de Trabajo
CREATE TABLE AreaTrabajo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_usuario_propietario INT, -- Relación es_prop (1:N con Usuario)
    FOREIGN KEY (id_usuario_propietario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- Tabla intermedia para la relación trabaja_en (N:M entre Usuario y Área de Trabajo)
CREATE TABLE UsuarioAreaTrabajo (
    id_usuario INT,
    id_area_trabajo INT,
    PRIMARY KEY (id_usuario, id_area_trabajo),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_area_trabajo) REFERENCES AreaTrabajo(id) ON DELETE CASCADE
);

-- Crear tabla Columna
CREATE TABLE Columna (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    orden INT NOT NULL,
    id_area_trabajo INT, -- Relación tiene (1:N con Área de Trabajo)
    FOREIGN KEY (id_area_trabajo) REFERENCES AreaTrabajo(id) ON DELETE CASCADE
);

-- Crear tabla Tarea
CREATE TABLE Tarea (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    comentario TEXT,
    id_columna INT NOT NULL,
    id_usuario_creador INT NOT NULL, -- Relación con el usuario que crea la tarea
    FOREIGN KEY (id_columna) REFERENCES Columna(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_creador) REFERENCES Usuario(id)
);

--Tablas temporales

CREATE TABLE PasswordResetCodes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expiration TIMESTAMP NOT NULL
);

CREATE TABLE EmailVerificationCodes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expiration TIMESTAMP NOT NULL
);