from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)

ARQUIVO_RESPOSTAS = "respostas.json"


QUESTIONS = [
    "Comida favorita",
    "Programa ideal juntos para essa semana",
    "Personalidade",
    "O que mais admira no outro",
    "Coisas que vocês têm em comum",
    "Lugar que deveríamos ir juntos",
    "Nível de química",
    "Nível de confiança"
]


def calcular_compatibilidade(respostas):

    try:
        quimica = float(respostas.get("7", 5))
        confianca = float(respostas.get("8", 5))
    except:
        quimica = 5
        confianca = 5

    score = 84 + quimica + (confianca * 0.8)

    score = min(score, 99.8)

    return round(score, 1)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/enviar", methods=["POST"])
def receber_respostas():

    dados = request.get_json()

    if not dados:
        return jsonify({
            "success": False,
            "message": "Nenhum dado recebido."
        }), 400

    respostas = dados.get("respostas", {})

    compatibilidade = calcular_compatibilidade(respostas)

    registro = {
        "data": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "respostas": respostas,
        "compatibilidade": compatibilidade
    }

    registros = []

    if os.path.exists(ARQUIVO_RESPOSTAS):

        try:
            with open(
                ARQUIVO_RESPOSTAS,
                "r",
                encoding="utf-8"
            ) as arquivo:

                registros = json.load(arquivo)

        except:
            registros = []

    registros.append(registro)

    with open(
        ARQUIVO_RESPOSTAS,
        "w",
        encoding="utf-8"
    ) as arquivo:

        json.dump(
            registros,
            arquivo,
            ensure_ascii=False,
            indent=4
        )

    return jsonify({
        "success": True,
        "compatibilidade": compatibilidade
    })


if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )