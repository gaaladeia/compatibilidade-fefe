from flask import Flask, render_template, request, jsonify

app = Flask(
    __name__,
    template_folder="../templates",
    static_folder="../static"
)

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
    except (ValueError, TypeError):
        quimica = 5
        confianca = 5

    score = 84 + quimica + (confianca * 0.8)

    return round(min(score, 99.8), 1)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/enviar", methods=["POST"])
def receber_respostas():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({
            "success": False,
            "message": "Nenhum dado recebido."
        }), 400

    respostas = dados.get("respostas", {})

    compatibilidade = calcular_compatibilidade(respostas)

    return jsonify({
        "success": True,
        "compatibilidade": compatibilidade
    })
