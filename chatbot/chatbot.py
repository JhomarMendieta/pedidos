from flask import Flask, request, jsonify
from datetime import datetime
from flask_mysqldb import MySQL
from flask_cors import CORS  
import MySQLdb.cursors

app = Flask(__name__)

CORS(app)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'panol2'
app.config['MYSQL_HOST'] = 'localhost'

mysql = MySQL(app)

@app.route('/chatbot', methods=['POST'])
def recibir_mensaje():
    data = request.get_json()
    mensaje = data.get('message').lower()
    step = data.get('step')
    id_usuario = data.get('id_usuario')
    
    herramienta_seleccionada = data.get('herramienta_seleccionada')
    cantidad_pedida = data.get('cantidad_pedida')
    
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT id, nombre, cantidad FROM tipos_herramienta")
    
    herramienta = cursor.fetchall()
    
    cursor.close()

    herramientas = herramienta
    print(herramienta)
    if mensaje:
        if step == "inicial":
            response = {
                "response": ["Hola, buenas ¿qué desea realizar?<br>- <a onclick=\"enviartexto('pedir herramientas')\">Pedir herramientas</a>", "opciones", {}, 0]
            }
        
        elif (step == "opciones" and mensaje == "pedir herramientas") or (step == "cantidad" and mensaje == "elegir otra herramienta"):
            herramientas_html = "¿Qué herramienta quiere pedir?"
            for herramienta in herramientas:
                if herramienta['cantidad'] > 0:  
                    herramientas_html += f"<br>- <a onclick=\"enviartexto('{herramienta['nombre']}')\">{herramienta['nombre']}</a>"
                else:
                    herramientas_html += f"<br>- <a onclick=\"enviartexto('{herramienta['nombre']}')\">{herramienta['nombre']}</a> SIN UNIDADES"
            
            response = {
                "response": [herramientas_html, "pedir herramientas", {}, 0]
            }
        
        elif step == "pedir herramientas" or (step == "confirmar" and mensaje == "elegir otra cantidad"):
            if step == "pedir herramientas":
                herramienta_seleccionada = next((h for h in herramientas if h['nombre'].lower() == mensaje), {})
            if herramienta_seleccionada:
                if herramienta_seleccionada['cantidad'] > 0:
                    response = {
                        "response": [
                            f"¿Cuántos {herramienta_seleccionada['nombre']} vas a pedir? Quedan {herramienta_seleccionada['cantidad']} disponibles.<br>- <a onclick=\"enviartexto('elegir otra herramienta')\">Elegir otra herramienta</a>",
                            "cantidad",
                            herramienta_seleccionada,
                            0  
                        ]
                    }
                else:
                    response = {
                        "response": [f"Lo siento, {herramienta_seleccionada['nombre']} no está disponible en este momento.", "pedir herramientas", {}, 0]
                    }
            else:
                response = {
                    "response": [f"\"{mensaje}\" no se encuentra en las opciones.", "pedir herramientas", {}, 0]
                }
        
        elif step == "cantidad" :
            if isinstance(cantidad_pedida, str) and cantidad_pedida.isdigit():
                cantidad_pedida = int(mensaje) 
                if herramienta_seleccionada:
                    herramienta = next((h for h in herramientas if h['nombre'].lower() == herramienta_seleccionada["nombre"].lower()), {})
                    if herramienta and cantidad_pedida <= herramienta['cantidad']:
                        response = {
                        "response":[
                            f"Está seguro que quiere pedir Herramienta: {herramienta['nombre']} {herramienta['id']}<br> Cantidad: {cantidad_pedida}?<br>- <a onclick=\"enviartexto('confirmar pedido')\">Confirmar pedido</a><br>- <a onclick=\"enviartexto('elegir otra cantidad')\">Elegir otra cantidad</a>",
                            "confirmar",
                            herramienta,
                            cantidad_pedida
                        ]}
                    else:
                        response = {
                        "response":[
                            f"Lo siento, solo quedan {herramienta['cantidad']} unidades de {herramienta['nombre']}.<br>- <a onclick=\"enviartexto('elegir otra cantidad')\">Elegir otra cantidad</a>",
                            "confirmar",
                            herramienta,
                            0
                        ]}
                else:
                    response = {
                        "response": ["No se ha seleccionado ninguna herramienta.", "opciones", {}, 0]
                    }
            else:
                response = {
                    "response": ["Por favor, ingrese una cantidad válida.", "cantidad", {}, 0]
                }
        
        elif step == "confirmar" and mensaje == "confirmar pedido":
            if herramienta_seleccionada and cantidad_pedida:
                #usuario_fk = id_usuario  
                #fecha = datetime.now()  
                #estado_fk = herramienta_seleccionada["id"]

                #cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
              
                #cursor.execute("INSERT INTO pedidos (usuario_fk, fecha, estado_fk) VALUES (%s, %s, %s)",
                #            (usuario_fk, fecha, estado_fk))
                
                #usuario_fk = int(id_usuario)  
                usuario_fk = 1 
                fecha = datetime.today() 
                horario = datetime.now() 
                estado_fk = 1 
                tipo_pedido = 1
                herramientas = herramienta_seleccionada["id"]

                cursor = mysql.connection.cursor()
                query_pedidos = """
                INSERT INTO pedidos (usuario_fk, fecha, horario, estado_fk, tipo_pedido) 
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query_pedidos, (usuario_fk, fecha, horario, estado_fk, tipo_pedido))
                pedido_id = cursor.lastrowid 

                query_pedidos_herramientas = """
                INSERT INTO pedido_herramientas (pedido_id_fk, herramienta_id_fk, cantidad)
                VALUES (%s, %s, %s)
                """
                mysql.connection.commit() 
                cursor.close()  
    
                response = {
                    "response": [
                        f"Pedido completado: {herramienta_seleccionada['nombre']}<br> Cantidad: {cantidad_pedida}. Gracias por utilizar este servicio",
                        "inicial",
                        {},
                        0
                    ]
                }
        else:
            response = {
                "response": ["No entiendo tu solicitud. Por favor elige una opción válida.", "opciones", {}, 0]
            }
        
        return jsonify(response), 200
    
    else:
        return jsonify({"error": ["No se envió ningún mensaje", "inicial", {}, 0]}), 400


if __name__ == '__main__':
    app.run(debug=True)
