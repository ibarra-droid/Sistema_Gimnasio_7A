-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-10-2026 a las 12:53:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ingresos_gim`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases`
--

CREATE TABLE `clases` (
  `id_clase` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dia_semana` varchar(15) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `limite_clientes` int(11) DEFAULT NULL,
  `empleado_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases`
--

INSERT INTO `clases` (`id_clase`, `nombre`, `dia_semana`, `hora_inicio`, `hora_fin`, `limite_clientes`, `empleado_id`) VALUES
(1, 'Musculacion', 'Lunes', '08:00:00', '09:00:00', 20, 1),
(2, 'Funcional', 'Martes', '09:00:00', '10:00:00', 15, 2),
(3, 'Spinning', 'Miercoles', '10:00:00', '11:00:00', 12, 3),
(4, 'Yoga', 'Jueves', '11:00:00', '12:00:00', 15, 4),
(5, 'Crossfit', 'Viernes', '17:00:00', '18:00:00', 10, 5),
(6, 'Musculacion', 'Lunes', '18:00:00', '19:00:00', 20, 1),
(7, 'Funcional', 'Martes', '19:00:00', '20:00:00', 15, 2),
(8, 'Spinning', 'Miercoles', '20:00:00', '21:00:00', 12, 3),
(9, 'Yoga', 'Jueves', '08:00:00', '09:00:00', 15, 4),
(10, 'Crossfit', 'Viernes', '09:00:00', '10:00:00', 10, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `domicilio_nro` varchar(10) DEFAULT NULL,
  `domicilio_calle` varchar(100) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `fecha_alta` date DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `dni`, `telefono`, `domicilio_nro`, `domicilio_calle`, `correo`, `fecha_alta`, `estado`) VALUES
(1, 'Lucas', 'Gomez', '45000101', '2914001001', '123', 'San Martin', 'lucas.gomez@example.com', '2026-01-10', 'Activo'),
(2, 'Martina', 'Perez', '45000102', '2914001002', '456', 'Belgrano', 'martina.perez@example.com', '2026-01-15', 'Activo'),
(3, 'Tomas', 'Rodriguez', '45000103', '2914001003', '789', 'Alsina', 'tomas.rodriguez@example.com', '2026-02-01', 'Activo'),
(4, 'Sofia', 'Fernandez', '45000104', '2914001004', '321', 'Moreno', 'sofia.fernandez@example.com', '2026-02-12', 'Activo'),
(5, 'Mateo', 'Lopez', '45000105', '2914001005', '654', 'Sarmiento', 'mateo.lopez@example.com', '2026-03-01', 'Inactivo'),
(6, 'Valentina', 'Diaz', '45000106', '2914001006', '987', 'Rivadavia', 'valentina.diaz@example.com', '2026-03-05', 'Activo'),
(7, 'Benjamin', 'Torres', '45000107', '2914001007', '111', 'Lavalle', 'benjamin.torres@example.com', '2026-03-10', 'Activo'),
(8, 'Camila', 'Ruiz', '45000108', '2914001008', '222', 'Saavedra', 'camila.ruiz@example.com', '2026-04-01', 'Activo'),
(9, 'Joaquin', 'Sanchez', '45000109', '2914001009', '333', 'Chiclana', 'joaquin.sanchez@example.com', '2026-04-05', 'Activo'),
(10, 'Lucia', 'Ramirez', '45000110', '2914001010', '444', 'Brown', 'lucia.ramirez@example.com', '2026-04-10', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contrataciones`
--

CREATE TABLE `contrataciones` (
  `id_contratacion` int(11) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `plan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contrataciones`
--

INSERT INTO `contrataciones` (`id_contratacion`, `fecha_inicio`, `fecha_vencimiento`, `estado`, `cliente_id`, `plan_id`) VALUES
(1, '2026-01-10', '2026-02-10', 'Vencida', 1, 1),
(2, '2026-01-15', '2026-02-15', 'Vencida', 2, 2),
(3, '2026-02-01', '2026-11-01', 'Activa', 3, 3),
(4, '2026-02-12', '2026-11-12', 'Activa', 4, 4),
(5, '2026-03-01', '2026-04-01', 'Vencida', 5, 1),
(6, '2026-03-05', '2026-11-05', 'Activa', 6, 2),
(7, '2026-03-10', '2026-11-10', 'Activa', 7, 3),
(8, '2026-04-01', '2026-11-01', 'Activa', 8, 4),
(9, '2026-04-05', '2026-11-05', 'Activa', 9, 5),
(10, '2026-04-10', '2026-05-10', 'Vencida', 10, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `domicilio_nro` varchar(10) DEFAULT NULL,
  `domicilio_calle` varchar(100) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `nombre`, `apellido`, `dni`, `telefono`, `domicilio_nro`, `domicilio_calle`, `correo`) VALUES
(1, 'Martin', 'Castro', '35000101', '2914101001', '101', 'Colon', 'martin.castro@example.com'),
(2, 'Florencia', 'Molina', '35000102', '2914101002', '202', 'Mitre', 'florencia.molina@example.com'),
(3, 'Nicolas', 'Acosta', '35000103', '2914101003', '303', 'Italia', 'nicolas.acosta@example.com'),
(4, 'Julieta', 'Benitez', '35000104', '2914101004', '404', 'España', 'julieta.benitez@example.com'),
(5, 'Agustin', 'Herrera', '35000105', '2914101005', '505', 'Peru', 'agustin.herrera@example.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones_asistencias`
--

CREATE TABLE `inscripciones_asistencias` (
  `id_inscripcion` int(11) NOT NULL,
  `fecha_inscripcion` date DEFAULT NULL,
  `asistido` tinyint(1) DEFAULT NULL,
  `contratacion_id` int(11) DEFAULT NULL,
  `clase_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones_asistencias`
--

INSERT INTO `inscripciones_asistencias` (`id_inscripcion`, `fecha_inscripcion`, `asistido`, `contratacion_id`, `clase_id`) VALUES
(1, '2026-04-01', 1, 1, 1),
(2, '2026-04-02', 1, 2, 2),
(3, '2026-04-03', 0, 3, 3),
(4, '2026-04-04', 1, 4, 4),
(5, '2026-04-05', 0, 5, 5),
(6, '2026-04-06', 1, 6, 6),
(7, '2026-04-07', 1, 7, 7),
(8, '2026-04-08', 0, 8, 8),
(9, '2026-04-09', 1, 9, 9),
(10, '2026-04-10', 1, 10, 10),
(11, '2026-04-11', 0, 3, 1),
(12, '2026-04-12', 1, 4, 2),
(13, '2026-04-13', 1, 6, 3),
(14, '2026-04-14', 0, 7, 4),
(15, '2026-04-15', 1, 8, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo_pago` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodos_pago`
--

INSERT INTO `metodos_pago` (`id_metodo_pago`, `nombre`) VALUES
(1, 'Efectivo'),
(2, 'Transferencia'),
(3, 'Tarjeta de debito'),
(4, 'Tarjeta de credito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL,
  `concepto` varchar(150) DEFAULT NULL,
  `metodo_pago_id` int(11) DEFAULT NULL,
  `contratacion_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `fecha_pago`, `monto`, `comprobante`, `concepto`, `metodo_pago_id`, `contratacion_id`) VALUES
(1, '2026-01-10', 15000.00, 'COMP001', 'Pago plan basico', 1, 1),
(2, '2026-01-15', 22000.00, 'COMP002', 'Pago plan intermedio', 2, 2),
(3, '2026-02-01', 30000.00, 'COMP003', 'Pago plan completo', 3, 3),
(4, '2026-02-12', 40000.00, 'COMP004', 'Pago plan premium', 4, 4),
(5, '2026-03-01', 15000.00, 'COMP005', 'Pago plan basico', 1, 5),
(6, '2026-03-05', 22000.00, 'COMP006', 'Pago plan intermedio', 2, 6),
(7, '2026-03-10', 30000.00, 'COMP007', 'Pago plan completo', 3, 7),
(8, '2026-04-01', 40000.00, 'COMP008', 'Pago plan premium', 4, 8),
(9, '2026-04-05', 50000.00, 'COMP009', 'Pago plan libre', 1, 9),
(10, '2026-04-10', 15000.00, 'COMP010', 'Pago plan basico', 2, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id_plan` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `creditos` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre`, `creditos`, `precio`) VALUES
(1, 'Basico', 8, 15000.00),
(2, 'Intermedio', 12, 22000.00),
(3, 'Completo', 20, 30000.00),
(4, 'Premium', 30, 40000.00),
(5, 'Libre', 50, 50000.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `fk_clases_empleados` (`empleado_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `contrataciones`
--
ALTER TABLE `contrataciones`
  ADD PRIMARY KEY (`id_contratacion`),
  ADD KEY `fk_contrataciones_clientes` (`cliente_id`),
  ADD KEY `fk_contrataciones_planes` (`plan_id`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`);

--
-- Indices de la tabla `inscripciones_asistencias`
--
ALTER TABLE `inscripciones_asistencias`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD KEY `fk_inscripciones_contrataciones` (`contratacion_id`),
  ADD KEY `fk_inscripciones_clases` (`clase_id`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo_pago`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pagos_metodos_pago` (`metodo_pago_id`),
  ADD KEY `fk_pagos_contrataciones` (`contratacion_id`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clases`
--
ALTER TABLE `clases`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `contrataciones`
--
ALTER TABLE `contrataciones`
  MODIFY `id_contratacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `inscripciones_asistencias`
--
ALTER TABLE `inscripciones_asistencias`
  MODIFY `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clases`
--
ALTER TABLE `clases`
  ADD CONSTRAINT `fk_clases_empleados` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id_empleado`);

--
-- Filtros para la tabla `contrataciones`
--
ALTER TABLE `contrataciones`
  ADD CONSTRAINT `fk_contrataciones_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `fk_contrataciones_planes` FOREIGN KEY (`plan_id`) REFERENCES `planes` (`id_plan`);

--
-- Filtros para la tabla `inscripciones_asistencias`
--
ALTER TABLE `inscripciones_asistencias`
  ADD CONSTRAINT `fk_inscripciones_clases` FOREIGN KEY (`clase_id`) REFERENCES `clases` (`id_clase`),
  ADD CONSTRAINT `fk_inscripciones_contrataciones` FOREIGN KEY (`contratacion_id`) REFERENCES `contrataciones` (`id_contratacion`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_contrataciones` FOREIGN KEY (`contratacion_id`) REFERENCES `contrataciones` (`id_contratacion`),
  ADD CONSTRAINT `fk_pagos_metodos_pago` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id_metodo_pago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
