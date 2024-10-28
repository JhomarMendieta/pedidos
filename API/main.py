from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
from datetime import timedelta
from flask_cors import CORS
from datetime import datetime

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
#########################################################################################################
#pedidos
#########################################################################################################
#########################################################################################################











@app.route('/obtener_herramientas', methods=['GET'])
def obtener_herramientas():
    query = request.args.get('query', '')
    categoria_id = request.args.get('categoria_id', None)  
    subcategoria_id = request.args.get('subcategoria_id', None) 
    tipo_id = request.args.get('tipo_id', None) 

    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        base_query = """
            SELECT hrm.id, 
                   hrm.imagen, 
                   hrm.tipo_id, 
                   thrm.nombre, 
                   thrm.disponibles, 
                   sctr.nombre AS subcategoria_nombre, 
                   ctr.nombre AS categoria_nombre 
            FROM herramientas hrm 
            INNER JOIN tipos_herramienta thrm ON hrm.tipo_id = thrm.id 
            INNER JOIN subcategorias sctr ON thrm.subcategoria_id = sctr.id 
            INNER JOIN categorias ctr ON sctr.categoria_id = ctr.id
        """

        conditions = []
        params = []

        if query:
            conditions.append("thrm.nombre LIKE %s")
            params.append(f"%{query}%")
        if categoria_id:
            conditions.append("ctr.id = %s")
            params.append(categoria_id)
        if subcategoria_id:
            conditions.append("sctr.id = %s") 
            params.append(subcategoria_id)
        if tipo_id:
            conditions.append("thrm.id = %s")
            params.append(tipo_id)

        if conditions:
            base_query += " WHERE " + " AND ".join(conditions)

        cursor.execute(base_query, tuple(params))
        datos_herramienta_pedidos = cursor.fetchall()

    if datos_herramienta_pedidos:
        return jsonify(datos_herramienta_pedidos), 200
    else:
        return jsonify({'message': 'No se encontraron herramientas'}), 404
    
@app.route('/obtener_consumibles', methods=['GET'])
def obtener_consumibles():
    query = request.args.get('query', '')
    categoria_id = request.args.get('categoria_id', None) 
    subcategoria_id = request.args.get('subcategoria_id', None) 

    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        base_query = """
            SELECT csm.id, 
                   csm.nombre, 
                   csm.cantidad, 
                   csm.imagen, 
                   sctr.nombre AS subcategoria_nombre, 
                   ctr.nombre AS categoria_nombre 
            FROM consumibles csm
            INNER JOIN subcategorias sctr ON csm.subcategoria_id = sctr.id
            INNER JOIN categorias ctr ON sctr.categoria_id = ctr.id
        """

        conditions = []
        params = []

        if query:
            conditions.append("csm.nombre LIKE %s")
            params.append(f"%{query}%")
        if categoria_id:
            conditions.append("ctr.id = %s") 
            params.append(categoria_id)
        if subcategoria_id:
            conditions.append("sctr.id = %s") 
            params.append(subcategoria_id)

        if conditions:
            base_query += " WHERE " + " AND ".join(conditions)

        cursor.execute(base_query, tuple(params))
        datos_consumibles = cursor.fetchall()

    if datos_consumibles:
        return jsonify(datos_consumibles), 200
    else:
        return jsonify({'message': 'No se encontraron consumibles'}), 404





@app.route('/categoria_herramientas', methods=['GET'])
def obtener_categoria_herramientas():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT DISTINCT categorias.id, categorias.nombre
            FROM categorias
            JOIN subcategorias ON categorias.id = subcategorias.categoria_id
            JOIN tipos_herramienta ON subcategorias.id = tipos_herramienta.subcategoria_id
            JOIN herramientas ON tipos_herramienta.id = herramientas.tipo_id;
        """)

        categorias_herramientas = cursor.fetchall()

    if categorias_herramientas:
        return jsonify(categorias_herramientas), 200
    else:
        return jsonify({'message': 'No se encontraron categorías de herramientas'}), 404
    
@app.route('/categoria_consumibles', methods=['GET'])
def obtener_categoria_consumibles():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT DISTINCT categorias.id, categorias.nombre
            FROM categorias
            JOIN subcategorias ON categorias.id = subcategorias.categoria_id
            JOIN consumibles ON subcategorias.id = consumibles.subcategoria_id
        """)

        categoria_consumibles = cursor.fetchall()

    if categoria_consumibles:
        return jsonify(categoria_consumibles), 200
    else:
        return jsonify({'message': 'No se encontraron categorías de herramientas'}), 404
    




@app.route('/subcategorias_herramientas', methods=['GET'])
def obtener_subcategorias_herramientas():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT DISTINCT subcategorias.id, subcategorias.nombre
            FROM subcategorias
            JOIN tipos_herramienta ON subcategorias.id = tipos_herramienta.subcategoria_id
            JOIN herramientas ON tipos_herramienta.id = herramientas.tipo_id
        """)
        
        subcategorias_herramientas = cursor.fetchall()

    if subcategorias_herramientas:
        return jsonify(subcategorias_herramientas), 200
    else:
        return jsonify({'message': 'No se encontraron subcategorías de herramientas'}), 404

@app.route('/subcategorias_consumibles', methods=['GET'])
def obtener_subcategorias_consumibles():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT DISTINCT subcategorias.id, subcategorias.nombre
            FROM subcategorias
            JOIN consumibles ON subcategorias.id = consumibles.subcategoria_id
        """)
        
        subcategorias_consumibles = cursor.fetchall()

    if subcategorias_consumibles:
        return jsonify(subcategorias_consumibles), 200
    else:
        return jsonify({'message': 'No se encontraron subcategorías de consumibles'}), 404





@app.route('/tipos_herramienta', methods=['GET'])
def obtener_tipos_herramienta():
    with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT DISTINCT tipos_herramienta.id, tipos_herramienta.nombre
            FROM tipos_herramienta
            JOIN herramientas ON herramientas.tipo_id = tipos_herramienta.id
        """)
        
        tipos_herramienta = cursor.fetchall()

    if tipos_herramienta:
        return jsonify(tipos_herramienta), 200
    else:
        return jsonify({'message': 'No se encontraron tipos de herramientas'}), 404





@app.route('/actualizar_cantidad', methods=['POST'])
def actualizar_cantidad():
    data = request.json
    print(data)
    id = data['id']
    cantidad_a_restar = data['cantidad']
    tabla = data['tabla']

    cursor = mysql.connection.cursor()

    if tabla == 'tipos_herramienta':
        cursor.execute(
            "UPDATE tipos_herramienta th JOIN herramientas h ON th.id = h.tipo_id SET th.disponibles = th.disponibles - %s WHERE h.id = %s",
            (cantidad_a_restar, id)
        )
    elif tabla == 'consumibles':
        cursor.execute(
            "UPDATE consumibles SET cantidad = cantidad - %s WHERE id = %s AND cantidad >= %s",
            (cantidad_a_restar, id, cantidad_a_restar)
        )

    mysql.connection.commit() 
    cursor.close() 
    return jsonify({"status": "success"}), 200





@app.route('/crear_pedido', methods=['POST'])
def crear_pedido():
    data = request.json

    usuario_fk = int(data['usuario_fk'])  
    fecha = data['fecha']  
    horario = data['horario'] 
    estado_fk = int(data['estado_fk'])  
    tipo_pedido = int(data['tipo_pedido']) 
    herramientas = data.get('herramientas', [])  # Usar get para evitar KeyError
    consumibles = data.get('consumibles', [])  # Usar get para evitar KeyError

    cursor = mysql.connection.cursor()
    
    # Insertar el pedido
    query_pedidos = """
    INSERT INTO pedidos (usuario_fk, fecha, horario, estado_fk, tipo_pedido) 
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query_pedidos, (usuario_fk, fecha, horario, estado_fk, tipo_pedido))
    pedido_id = cursor.lastrowid 

    # Insertar herramientas si hay alguna
    if herramientas:
        query_pedidos_herramientas = """
        INSERT INTO pedido_herramientas (pedido_id_fk, herramienta_id_fk, cantidad)
        VALUES (%s, %s, %s)
        """
        for herramienta in herramientas:
            cursor.execute(query_pedidos_herramientas, (pedido_id, int(herramienta['herramienta_id_fk']), int(herramienta['cantidad'])))

    # Insertar consumibles si hay alguno
    if consumibles:
        query_pedidos_consumibles = """
        INSERT INTO pedido_consumibles (pedido_id_fk, consumible_id_fk, cantidad)
        VALUES (%s, %s, %s)
        """
        for consumible in consumibles:
            cursor.execute(query_pedidos_consumibles, (pedido_id, int(consumible['consumible_id_fk']), int(consumible['cantidad'])))

    mysql.connection.commit() 
    cursor.close()

    return jsonify({'message': 'Pedido enviado correctamente'}), 201


if __name__ == '__main__':
    app.run(debug=True)