from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import ply.lex as lex
import re

app = Flask(__name__)

# Rutas para servir archivos estáticos desde las carpetas 'views' y 'assets'
@app.route('/views/<path:filename>')
def serve_views(filename):
    return send_from_directory('views', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

reserved = {
    'for': 'FOR',
    'while': 'WHILE',
    'if': 'IF',
    'else': 'ELSE',
    'do': 'DO',
    'return': 'RETURN',
    'class': 'CLASS',
    'import': 'IMPORT',
    'from': 'FROM',
    'try': 'TRY'
}

tokens = ['PABIERTO', 'PCERRADO'] + list(reserved.values())

# Función generadora de tokens con expresión regular
def token_func_generator(token_name):
    return (f'r"{token_name}"', lambda t: t)

# Generar funciones de token dinámicamente
for token_name, token_value in reserved.items():
    regex, action = token_func_generator(token_name)
    exec(f"""
def t_{token_value}(t):
    {regex}
    t.type = '{token_value}'
    return t
""")

t_ignore = ' \t\n\r'

t_PABIERTO = r'\('
t_PCERRADO = r'\)'

def t_error(t):
    print('Caracter no valido', t.value[0])
    t.lexer.skip(1)

lexer = lex.lex(reflags=re.IGNORECASE)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        code = request.form.get('code', '')
        lexer.input(code)
        tokens_list = []
        while True:
            token = lexer.token()
            if not token:
                break
            token_type = 'Reservada ' + token.type.capitalize() if token.type in reserved.values() else 'Parentesis de apertura' if token.type == 'PABIERTO' else 'Parentesis de cierre'
            tokens_list.append([token_type, token.value])
        return jsonify({'tokens': tokens_list})
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)