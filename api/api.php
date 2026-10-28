<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $pdo = db();
    $entity = (string)($_GET['entity'] ?? '');
    if ($entity === 'dashboard' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $summary = [
            'socios' => (int)$pdo->query('SELECT COUNT(*) FROM clientes')->fetchColumn(),
            'membresias_activas' => (int)$pdo->query("SELECT COUNT(*) FROM contrataciones WHERE estado = 'Activa' AND (fecha_vencimiento IS NULL OR fecha_vencimiento >= CURDATE())")->fetchColumn(),
            'membresias_total' => (int)$pdo->query('SELECT COUNT(*) FROM contrataciones')->fetchColumn(),
            'ingresos_mes' => (float)$pdo->query('SELECT COALESCE(SUM(monto),0) FROM pagos WHERE fecha_pago >= DATE_FORMAT(CURDATE(), "%Y-%m-01") AND fecha_pago < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, "%Y-%m-01")')->fetchColumn(),
            'asistencias_hoy' => (int)$pdo->query('SELECT COUNT(*) FROM inscripciones_asistencias WHERE fecha_inscripcion = CURDATE() AND asistido = 1')->fetchColumn(),
            'por_vencer' => (int)$pdo->query("SELECT COUNT(*) FROM contrataciones WHERE fecha_vencimiento BETWEEN CURDATE() AND CURDATE() + INTERVAL 7 DAY AND estado = 'Activa'")->fetchColumn(),
            'vencidas' => (int)$pdo->query("SELECT COUNT(*) FROM contrataciones WHERE fecha_vencimiento < CURDATE() OR estado = 'Vencida'")->fetchColumn(),
        ];
        $recent = $pdo->query("SELECT * FROM (
            SELECT c.nombre, c.apellido, c.dni, 'Pago de cuota' AS actividad, p.fecha_pago AS fecha, 'Completado' AS estado
              FROM pagos p JOIN contrataciones co ON co.id_contratacion=p.contratacion_id JOIN clientes c ON c.id_cliente=co.cliente_id
            UNION ALL
            SELECT c.nombre, c.apellido, c.dni, 'Ingreso al gimnasio', ia.fecha_inscripcion, 'Registrado'
              FROM inscripciones_asistencias ia JOIN contrataciones co ON co.id_contratacion=ia.contratacion_id JOIN clientes c ON c.id_cliente=co.cliente_id WHERE ia.asistido=1
        ) movimientos ORDER BY fecha DESC LIMIT 6")->fetchAll();
        $renewals = $pdo->query("SELECT c.nombre,c.apellido,p.nombre AS plan,co.fecha_vencimiento FROM contrataciones co JOIN clientes c ON c.id_cliente=co.cliente_id JOIN planes p ON p.id_plan=co.plan_id WHERE co.fecha_vencimiento BETWEEN CURDATE() AND CURDATE() + INTERVAL 30 DAY AND co.estado='Activa' ORDER BY co.fecha_vencimiento LIMIT 5")->fetchAll();
        $trend = $pdo->query("SELECT DATE_FORMAT(fecha_pago, '%Y-%m') AS mes, COALESCE(SUM(monto),0) AS monto FROM pagos WHERE fecha_pago >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH) AND fecha_pago < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01') GROUP BY mes ORDER BY mes")->fetchAll();
        respond(200, ['ok' => true, 'data' => ['summary' => $summary, 'recent' => $recent, 'renewals' => $renewals, 'trend' => $trend]]);
    }

    $tables = [
        'clientes' => ['id_cliente', ['nombre','apellido','dni','telefono','domicilio_nro','domicilio_calle','correo','fecha_alta','estado']],
        'empleados' => ['id_empleado', ['nombre','apellido','dni','telefono','domicilio_nro','domicilio_calle','correo']],
        'planes' => ['id_plan', ['nombre','creditos','precio']],
        'clases' => ['id_clase', ['nombre','dia_semana','hora_inicio','hora_fin','limite_clientes','empleado_id']],
        'contrataciones' => ['id_contratacion', ['fecha_inicio','fecha_vencimiento','estado','cliente_id','plan_id']],
        'pagos' => ['id_pago', ['fecha_pago','monto','comprobante','concepto','metodo_pago_id','contratacion_id']],
        'metodos_pago' => ['id_metodo_pago', ['nombre']],
        'inscripciones_asistencias' => ['id_inscripcion', ['fecha_inscripcion','asistido','contratacion_id','clase_id']],
    ];
    if (!isset($tables[$entity])) respond(404, ['ok' => false, 'error' => 'Entidad inexistente.']);
    [$pk, $columns] = $tables[$entity];
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET') {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        $sql = 'SELECT * FROM `' . $entity . '`' . ($id ? ' WHERE `' . $pk . '` = :id' : '') . ' ORDER BY `' . $pk . '` DESC';
        $stmt = $pdo->prepare($sql);
        if ($id) $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $id ? $stmt->fetch() : $stmt->fetchAll();
        respond(200, ['ok' => true, 'data' => $rows]);
    }
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) respond(400, ['ok' => false, 'error' => 'El cuerpo debe ser JSON.']);
    if ($method === 'POST') {
        $data = array_intersect_key($body, array_flip($columns));
        if (!$data) respond(400, ['ok' => false, 'error' => 'No se recibieron campos válidos.']);
        $fields = array_keys($data);
        $sql = 'INSERT INTO `' . $entity . '` (`' . implode('`,`', $fields) . '`) VALUES (:' . implode(',:', $fields) . ')';
        $stmt = $pdo->prepare($sql); $stmt->execute($data);
        respond(201, ['ok' => true, 'data' => ['id' => (int)$pdo->lastInsertId()]]);
    }
    if ($method === 'PUT') {
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        $data = array_intersect_key($body, array_flip($columns));
        if (!$id || !$data) respond(400, ['ok' => false, 'error' => 'Se requiere id y al menos un campo válido.']);
        $sets = array_map(static fn($field) => '`' . $field . '` = :' . $field, array_keys($data));
        $data['__id'] = $id;
        $stmt = $pdo->prepare('UPDATE `' . $entity . '` SET ' . implode(',', $sets) . ' WHERE `' . $pk . '` = :__id');
        $stmt->execute($data);
        respond(200, ['ok' => true, 'data' => ['actualizados' => $stmt->rowCount()]]);
    }
    if ($method === 'DELETE') {
        $id = filter_var($body['id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id) respond(400, ['ok' => false, 'error' => 'Se requiere un id válido.']);
        $stmt = $pdo->prepare('DELETE FROM `' . $entity . '` WHERE `' . $pk . '` = :id');
        $stmt->execute(['id' => $id]);
        respond(200, ['ok' => true, 'data' => ['eliminados' => $stmt->rowCount()]]);
    }
    header('Allow: GET, POST, PUT, DELETE');
    respond(405, ['ok' => false, 'error' => 'Método no permitido.']);
} catch (PDOException $e) {
    error_log($e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Error de base de datos. Revisá la conexión y los datos enviados.']);
} catch (Throwable $e) {
    error_log($e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Error interno de la API.']);
}
