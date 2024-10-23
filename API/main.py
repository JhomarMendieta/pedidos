from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos MySQL
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'panol'
app.config['MYSQL_HOST'] = 'localhost'

mysql = MySQL(app)

# get categorias
@app.route('/categorias', methods=['GET'])
def get_categorias():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, nombre FROM categorias")
    categorias = cursor.fetchall()
    cursor.close()
    
    return jsonify(categorias), 200

# get subcategorias
@app.route('/subcategorias', methods=['GET'])
def get_subcategorias():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, nombre, categoria_id FROM subcategorias")
    subcategorias = cursor.fetchall()
    cursor.close()
    
    return jsonify(subcategorias), 200

# get consumibles
@app.route('/consumibles', methods=['GET'])
def get_consumibles():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT co.id, co.nombre, co.unidad, co.cantidad, co.subcategoria_id, sc.nombre as subcagetoria_nombre, ca.id as categoria_id, ca.nombre as categoria_nombre FROM consumibles co INNER JOIN subcategorias sc ON co.subcategoria_id = sc.id INNER JOIN categorias ca ON sc.categoria_id = ca.id")
    subcategorias = cursor.fetchall()
    cursor.close()
    
    return jsonify(subcategorias), 200

# get tipos herramienta
@app.route('/tipos-herramienta', methods=['GET'])
def get_tipos_herramienta():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT th.id, th.nombre, th.cantidad, th.disponibles, th.subcategoria_id, sc.nombre as subcategoria_nombre, sc.categoria_id, ca.nombre as categoria_nombre FROM tipos_herramienta th INNER JOIN subcategorias sc ON th.subcategoria_id = sc.id INNER JOIN categorias ca ON sc.categoria_id = ca.id")
    tipos = cursor.fetchall()
    cursor.close()
    
    return jsonify(tipos), 200


# get herramientas
@app.route('/herramientas', methods=['GET'])
def get_herramientas():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT h.id, h.imagen, h.observaciones, h.tipo_id, th.nombre as tipo_nombre, th.subcategoria_id, sc.nombre as subcategoria_nombre, sc.categoria_id, ca.nombre as categoria_nombre FROM herramientas h INNER JOIN tipos_herramienta th ON h.tipo_id = th.id INNER JOIN subcategorias sc ON th.subcategoria_id = sc.id INNER JOIN categorias ca ON sc.categoria_id = ca.id")
    herramientas = cursor.fetchall()
    cursor.close()
    
    return jsonify(herramientas), 200


# get 1 categoria
@app.route('/categoria', methods=['GET'])
def get_categoria():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, nombre FROM categorias WHERE categoria_id = %s", id)
    categoria = cursor.fetchall()
    cursor.close()
    
    return jsonify(categoria), 200

# get 1 subcategoria
@app.route('/subcategoria', methods=['GET'])
def get_subcategoria():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT sc.id, sc.nombre, sc.categoria_id, c.nombre as categoria_nombre FROM subcategorias sc INNER JOIN categorias c ON sc.categoria_id = c.id WHERE sc.id = %s", id)

    subcategoria = cursor.fetchall()
    cursor.close()
    
    return jsonify(subcategoria), 200

# get 1 consumible
@app.route('/consumible', methods=['GET'])
def get_consumible():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT co.id, co.nombre, co.unidad, co.cantidad, co.imagen, co.subcategoria_id, sc.nombre as subcategoria_nombre, sc.categoria_id, c.nombre as categoria_nombre FROM consumibles co INNER JOIN subcategorias sc ON co.subcategoria_id = sc.id INNER JOIN categorias c ON sc.categoria_id = c.id WHERE co.id = %s", id)

    consumible = cursor.fetchall()
    cursor.close()
    
    return jsonify(consumible), 200

# get 1 tipo herramienta
@app.route('/tipo-herramienta', methods=['GET'])
def get_tipo_herramienta():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT th.id, th.nombre, th.cantidad, th.disponibles, th.subcategoria_id, sc.nombre as subcategoria_nombre, sc.categoria_id, c.nombre as categoria_nombre FROM tipos_herramienta th INNER JOIN subcategorias sc ON th.subcategoria_id = sc.id INNER JOIN categorias c ON sc.categoria_id = c.id WHERE co.id = %s", id)

    tipo = cursor.fetchall()
    cursor.close()
    
    return jsonify(tipo), 200

# get 1 herramienta
@app.route('/herramienta', methods=['GET'])
def get_herramienta():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT h.id, h.imagen, h.observaciones, h.tipo_id, th.nombre as tipo_nombre, th.subcategoria_id, sc.nombre as subcategoria_nombre, sc.categoria_id, ca.nombre as categoria_nombre FROM herramientas h INNER JOIN tipos_herramienta th ON h.tipo_id = th.id INNER JOIN subcategorias sc ON th.subcategoria_id = sc.id INNER JOIN categorias ca ON sc.categoria_id = ca.id WHERE h.id = %s", id)

    herramienta = cursor.fetchall()
    cursor.close()
    
    return jsonify(herramienta), 200


# crear categoria
@app.route('/categoria', methods=['POST'])
def add_categoria():
    data = request.json
    nombre = data['nombre']
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO categorias (nombre) VALUES (%s)", (nombre,))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Categoría creada exitosamente'}), 201

# crear subcategoria (pasando categoria)
@app.route('/subcategoria', methods=['POST'])
def add_subcategoria():
    data = request.json
    nombre = data['nombre']
    categoria_id = data['categoria_id']
    
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO subcategorias (nombre, categoria_id) VALUES (%s, %s)", (nombre, categoria_id))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Subcategoría agregada exitosamente'}), 201

# crear consumibles (en subcategoria)
@app.route('/consumible', methods=['POST'])
def add_consumible():
    data = request.json
    nombre = data['nombre']
    unidad = data['unidad']
    cantidad = data['cantidad']
    imagen = data['imagen']
    subcategoria_id = data['subcategoria_id']
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO consumibles (nombre, unidad, cantidad, imagen, subcategoria_id) VALUES (%s, %s, %s, %s, %s)", (nombre, unidad, cantidad, imagen, subcategoria_id))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Consumible agregado exitosamente'}), 201

# crear tipo_herramienta (en subcategoria)
@app.route('/tipo-herramienta', methods=['POST'])
def add_tipo_herramienta():
    data = request.json
    nombre = data['nombre']
    subcategoria_id = data['subcategoria_id']
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO tipos_herramienta (nombre, cantidad, disponibles, subcategoria_id) VALUES (%s, %s, %s, %s)", (nombre, 0, 0, subcategoria_id))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Tipo de herramienta agregado exitosamente'}), 201

# alta de herramienta
@app.route('/herramienta', methods=['POST'])
def add_herramienta():
    data = request.json
    observaciones = data['observaciones']
    imagen = data['imagen']
    tipo_id = data['tipo_id']
    
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO herramientas (observaciones, imagen, tipo_id) VALUES (%s, %s, %s)", (observaciones, imagen, tipo_id))
    
    # consulta para afectar a cantidad de tipo_herramienta
    cursor.execute("""
        UPDATE tipos_herramienta
        SET cantidad = cantidad + 1, disponibles = disponibles + 1
        WHERE id = %s
    """, (tipo_id,))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Alta exitosa de la herramienta'}), 201

# baja de herramienta (paso toda la info a bajas, y elimino el registro de herramientas)
@app.route('/herramienta', methods=['DELETE'])
def baja_herramienta():
    id = request.args.get('id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Obtener la herramienta con todos sus campos
    cursor.execute("SELECT id, imagen, observaciones, tipo_id FROM herramientas WHERE id = %s", (id,))
    herramienta = cursor.fetchone()

    if not herramienta:
        cursor.close()
        return jsonify({'message': 'Herramienta no encontrada'}), 404

    # Insertar los datos de la herramienta en la tabla baja_herramientas
    cursor.execute("""
        INSERT INTO baja_herramientas (id, observaciones, imagen, tipo_id)
        VALUES (%s, %s, %s, %s)
    """, (herramienta['id'], herramienta['observaciones'], herramienta['imagen'], herramienta['tipo_id']))

    # Eliminar la herramienta de la tabla herramientas
    cursor.execute("DELETE FROM herramientas WHERE id = %s", (id,))
    
    # Actualizar la cantidad y disponibles del tipo de herramienta
    cursor.execute("""
        UPDATE tipos_herramienta
        SET cantidad = cantidad - 1, disponibles = disponibles - 1
        WHERE id = %s
    """, (herramienta['tipo_id'],))
    
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Herramienta dada de baja exitosamente'}), 200



# modificacion de categoria
@app.route("/categoria", methods=['PUT'])
def modificar_categoria():
    id = request.args.get('id')
    data = request.json
    nombre = data['nombre']

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        UPDATE categorias
        SET nombre = %s
        WHERE id = %s
    """, (nombre, id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Categoría modificada exitosamente'}), 200

# modificación de subcategoria - nombre y categoria_id
@app.route("/subcategoria", methods=['PUT'])
def modificar_subcategoria():
    id = request.args.get('id')
    data = request.json
    nombre = data.get('nombre')
    categoria_id = data.get('categoria_id')

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Actualizar tanto el nombre como el categoria_id si están presentes en el request
    cursor.execute("""
        UPDATE subcategorias
        SET nombre = %s, categoria_id = %s
        WHERE id = %s
    """, (nombre, categoria_id, id))

    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Subcategoría modificada exitosamente'}), 200



# modificacion de tipo de herramienta
@app.route("/tipo-herramienta", methods=['PUT'])
def modificar_tipo_herramienta():
    id = request.args.get('id')
    data = request.json
    nombre = data.get('nombre')
    cantidad = data.get('cantidad')
    disponibles = data.get('disponibles')
    subcategoria_id = data.get('subcategoria_id')

    cursor = mysql.connection.cursor()

    # Verificar si el tipo_herramienta existe
    cursor.execute("SELECT * FROM tipos_herramienta WHERE id = %s", (id,))
    tipo_herramienta = cursor.fetchone()

    if not tipo_herramienta:
        cursor.close()
        return jsonify({'message': 'Tipo de herramienta no encontrado'}), 404

    # Actualizar los campos modificables
    cursor.execute("""
        UPDATE tipos_herramienta 
        SET nombre = %s, cantidad = %s, disponibles = %s, subcategoria_id = %s
        WHERE id = %s
    """, (nombre, cantidad, disponibles, subcategoria_id, id))

    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Tipo de herramienta actualizado exitosamente'}), 200


# modificacion de herramienta en especifico
@app.route("/herramienta", methods=['PUT'])
def modificar_herramienta():
    id = request.args.get('id')
    data = request.json
    imagen = data.get('imagen')
    observaciones = data.get('observaciones')
    tipo_id = data.get('tipo_id')

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    # Actualizar los campos de la herramienta si están presentes en el request
    cursor.execute("""
        UPDATE herramientas
        SET imagen = %s, observaciones = %s, tipo_id = %s
        WHERE id = %s
    """, (imagen, observaciones, tipo_id, id))

    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Herramienta modificada exitosamente'}), 200


# modificacion de consumible
@app.route("/consumible", methods=['PUT'])
def modificar_consumible():
    id = request.args.get('id')
    data = request.json
    nombre = data.get('nombre')
    unidad = data.get('unidad')
    cantidad = data.get('cantidad')
    imagen = data.get('imagen')
    subcategoria_id = data.get('subcategoria_id')


    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        UPDATE consumibles
        SET nombre = %s, unidad = %s, cantidad = %s, imagen = %s, subcategoria_id = %s
        WHERE id = %s
    """, (nombre, unidad, cantidad, imagen, subcategoria_id, id))

    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Consumible modificado exitosamente'}), 200

# eliminar categoria CASCADE

@app.route("/categoria", methods=["DELETE"])
def eliminar_categoria():
    id = request.args.get('id')
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM categorias WHERE id = %s", id)
    
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Categoría eliminada exitosamente'}), 200

# eliminar subcategoria CASCADE

# eliminar tipo_herramienta CASCADE

# eliminar consumible


# PROBAR LA BD CASCADE, LOS ENDPOINTS DELETE


















#########################################################################################################
#pedidos

# @app.route('/lista_herramientas_index', methods=['GET'])
# def lista_herramientas_index():
#     cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
#     # Corregir el INNER JOIN y SELECT
#     cursor.execute("""
#         SELECT h.id, h.imagen, h.tipo_id, th.nombre, th.disponibles
#         FROM herramientas h 
#         INNER JOIN tipos_herramienta th ON h.tipo_id = th.id
#     """)
#     lista_herramientas_index = cursor.fetchall()
#     cursor.close()
    
#     # Retornar los datos en formato JSON
#     return jsonify(lista_herramientas_index)


@app.route('/datos_herramienta_pedidos', methods=['GET'])
def datos_herramienta_pedidos():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT h.id, 
                   h.imagen, 
                   h.tipo_id,
                   th.nombre, 
                   th.disponibles, 
                   sc.nombre AS subcategoria_nombre, 
                   c.nombre AS categoria_nombre 
            FROM herramientas h
            INNER JOIN tipos_herramienta th ON h.tipo_id = th.id
            INNER JOIN subcategorias sc ON th.subcategoria_id = sc.id
            INNER JOIN categorias c ON sc.categoria_id = c.id
        """)

        datos_herramienta_pedidos = cursor.fetchall()

    # Verificar si hay resultados
    if datos_herramienta_pedidos:
        return jsonify(datos_herramienta_pedidos), 200
    else:
        return jsonify({'message': 'No se encontraron herramientas'}), 404




# SELECT h.id, h.imagen, h.tipo_id, th.nombre, th.disponibles
#             FROM herramientas h
#             INNER JOIN tipos_herramienta th ON h.tipo_id = th.id
#             WHERE th.nombre LIKE %s


# Obtener todos los pedidos
@app.route('/pedidos', methods=['GET'])
def get_pedidos():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, usuario_fk, fecha, estado_fk FROM pedidos")
    pedidos = cursor.fetchall()
    cursor.close()
    
    return jsonify(pedidos), 200

# Crear un nuevo pedido
@app.route('/pedidos', methods=['POST'])
def crear_pedido():
    datos = request.get_json()
    usuario_fk = datos.get('usuario_fk')
    fecha = datos.get('fecha')
    estado_fk = datos.get('estado_fk')
    cantidad_solicitada = datos.get('cantidad_solicitada')

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO pedidos (usuario_fk, fecha, estado_fk cantidad_solicitada) VALUES (%s, %s, %s, %s, %s)",
                   (usuario_fk, fecha, estado_fk, cantidad_solicitada))
    mysql.connection.commit()
    cursor.close()
    
    return jsonify({"mensaje": "Pedido creado exitosamente"}), 201


# get historica
@app.route('/historica_herramientas', methods=['GET'])
def obtener_historica_herramientas():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id FROM historica_herramientas")
    historica_herramientas = cursor.fetchall()
    cursor.close()

    return jsonify(historica_herramientas), 200

# Obtener un pedido específico por su cliente
@app.route('/pedidos/<int:id>', methods=['GET'])
def get_pedido(id):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    
    # Obtener el pedido y sus herramientas
    cursor.execute("""
        SELECT p.id, p.fecha, p.horario, u.nombre as usuario, e.estado,
        th.nombre as herramienta, ph.cantidad as cantidad_herramienta
        FROM pedidos p
        LEFT JOIN usuarios u ON p.usuario_fk = u.id
        LEFT JOIN estado e ON p.estado_fk = e.id
        LEFT JOIN pedido_herramientas ph ON p.id = ph.pedido_id_fk
        LEFT JOIN herramientas h ON ph.herramienta_id_fk = h.id
        LEFT JOIN tipos_herramienta th ON h.tipo_id = th.id
        WHERE p.id = %s
    """, (id,))
    
    datos = cursor.fetchall()  # Obtener todos los resultados
    cursor.close()

    if not datos:
        return jsonify({"mensaje": "Pedido no encontrado"}), 404

    # Formatear el resultado agrupando las herramientas
    pedido = {
        "pedido_id": datos[0]["id"],
        "usuario": datos[0]["usuario"],
        "fecha": datos[0]["fecha"],
        "estado": datos[0]["estado"],
        "herramientas": []
    }

    for item in datos:
        pedido["herramientas"].append({
            "nombre": item["herramienta"],
            "cantidad": item["cantidad_herramienta"]
        })

    return jsonify(pedido), 200

@app.route('/historica_herramientas', methods=['POST'])
def modificar_herramienta_pedido():
    try:
        data = request.json

        id = data['id']
        pedido_id_fk = data['pedido_id_fk']
        herramienta_id_fk = data['herramienta_id_fk']
        usuario_fk = data['usuario_fk']
        fecha_entrega = data['fecha_entrega']   
        fecha_devolucion = data['fecha_devolucion']
        horario_entrega = data['horario_entrega']
        horario_devolucion = data['horario_devolucion']
        cantidad = data['cantidad']
        estado_fk = data['estado_fk']
        observaciones = data['observaciones']

        cursor = mysql.connection.cursor()

        # Consulta corregida: Mencionar las columnas de la tabla y proporcionar los valores correctos
        query = """
        INSERT INTO historica_herramientas (
            id, pedido_id_fk, herramienta_id_fk, usuario_fk, 
            fecha_entrega, fecha_devolucion, horario_entrega, 
            horario_devolucion, cantidad, estado_fk, observaciones
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (id, pedido_id_fk, herramienta_id_fk, usuario_fk, fecha_entrega, fecha_devolucion, horario_entrega, horario_devolucion, cantidad, estado_fk, observaciones)
        cursor.execute(query, values)

        mysql.connection.commit()
        cursor.close() 

        return jsonify({'message': 'Historial insertado correctamente'}), 201
    
    except Exception as e:
        print(f"Error al insertar historial: {e}")
        return jsonify({'error': 'Error al insertar historial'}), 500

# @app.route("/pedidos", methods=['PUT'])
# def modificar_pedido():
#     # Obtener el ID del pedido desde los parámetros de la URL
#     id = request.args.get('id')
#     if not id:
#         return jsonify({'error': 'ID de pedido no proporcionado'}), 400

#     # Obtener los datos enviados en el cuerpo de la solicitud
#     data = request.json
#     estado_fk = data.get('estado_fk')

#     # Validar si el estado_fk fue enviado
#     if not estado_fk:
#         return jsonify({'error': 'Estado del pedido no proporcionado'}), 400

#     # Actualizar el estado del pedido en la base de datos
#     cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
#     query = "UPDATE pedidos SET estado_fk = %s WHERE id = %s"
#     cursor.execute(query, (estado_fk, id))

#     # Confirmar los cambios en la base de datos
#     mysql.connection.commit()
#     cursor.close()

#     return jsonify({'message': 'Estado del pedido actualizado correctamente'}), 200



if __name__ == '__main__':
    app.run(debug=True)