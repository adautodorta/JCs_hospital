import os
import jwt
from functools import wraps
from flask import Flask, jsonify, request, g
from flask_restful import Api, Resource
from flask_cors import CORS
from flasgger import Swagger
from dotenv import load_dotenv
import profiles

load_dotenv()
app = Flask(__name__)
api = Api(app)

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "API JCS Hospital",
        "description": "Api para gerenciamento de um hospital",
        "version": "1.0.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Autenticação JWT usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\""
        }
    },
    "security": [
        {
            "Bearer": []
        }
    ]
}

swagger = Swagger(app, template=swagger_template)
CORS(app)

SECRET = os.getenv("SUPABASE_JWT_SECRET")

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)

        if not auth_header or not auth_header.startswith("Bearer "):
            return {"message": "Token ausente ou mal formatado"}, 401

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(
                token,
                SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            g.user_id = data["sub"]
        except Exception as e:
            print("Erro no decode:", type(e).__name__, str(e))
            return {"message": "Token inválido!"}, 401

        return f(*args, **kwargs)
    return decorated

class Profiles(Resource):
    method_decorators = [jwt_required]

    def get(self):
        """
        Busca todos os itens da lista de desejos
        ---
        tags:
        - Lista de Desejos
        parameters:
            - name: search
              in: query
              type: string
              required: false
              description: Termo de busca para filtrar por nome do produto
        responses:
            200:
                description: Lista de itens da lista de desejos
                schema:
                    type: object
                    properties:
                        items:
                            type: array
                            items:
                                type: object
                                properties:
                                    id:
                                        type: string
                                        description: ID único do item
                                    nome:
                                        type: string
                                        description: Nome do produto
                                    valor:
                                        type: number
                                        description: Valor do produto
                                    link:
                                        type: string
                                        description: Link do produto
        """
        items = profiles.get_all_profiles()
        return {"items": items}, 200
    
api.add_resource(Profiles, "/profiles")

if __name__ == "__main__":
    app.run(debug=True)