const questions = [

    {
        title: "Comida favorita",
        subtitle:
            "Qual comida você escolheria para vocês comerem juntos?",
        type: "text"
    },

    {
        title: "Programa ideal juntos",
        subtitle:
            "Qual seria o programa perfeito para vocês essa semana?",
        type: "text"
    },

    {
        title: "Personalidade",
        subtitle:
            "Como você descreveria a personalidade de vocês?",
        type: "text"
    },

    {
        title: "O que mais admira no outro",
        subtitle:
            "Qual característica do outro você mais admira?",
        type: "text"
    },

    {
        title: "Coisas que vocês têm em comum",
        subtitle:
            "O que vocês dois têm em comum?",
        type: "text"
    },

    {
        title: "Lugar que deveríamos ir juntos",
        subtitle:
            "Se pudessem sair agora, para onde vocês deveriam ir?",
        type: "text"
    },

    {
        title: "Nível de química",
        subtitle:
            "De 0 a 10, qual é o nível de química entre vocês?",
        type: "scale"
    },

    {
        title: "Nível de confiança",
        subtitle:
            "De 0 a 10, quanto você confia nele?",
        type: "scale"
    }

];


let currentQuestion = 0;

let answers = [];



function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    document
        .getElementById(id)
        .classList.add("active");

}



function startQuiz() {

    currentQuestion = 0;

    answers = [];

    renderQuestion();

    showScreen("quiz");

}



function renderQuestion() {

    const question =
        questions[currentQuestion];


    document.getElementById("counter")
        .textContent =
        `ANÁLISE ${currentQuestion + 1}/${questions.length}`;


    const percent =
        Math.round(
            ((currentQuestion + 1) /
            questions.length) * 100
        );


    document.getElementById("percentage")
        .textContent =
        `${percent}%`;


    document.getElementById("progressBar")
        .style.width =
        `${percent}%`;


    document.getElementById("questionNumber")
        .textContent =
        `PERGUNTA ${String(currentQuestion + 1).padStart(2,"0")}`;


    document.getElementById("questionTitle")
        .textContent =
        question.title;


    document.getElementById("questionSubtitle")
        .textContent =
        question.subtitle;


    const area =
        document.getElementById("answerArea");


    area.innerHTML = "";


    if (question.type === "text") {

        const textarea =
            document.createElement("textarea");


        textarea.id = "answer";

        textarea.placeholder =
            "Digite sua resposta...";


        if (answers[currentQuestion]) {

            textarea.value =
                answers[currentQuestion];

        }


        area.appendChild(textarea);

    }


    else {

        const value =
            answers[currentQuestion] ?? 5;


        area.innerHTML = `

            <div
                class="scale-number"
                id="scaleNumber"
            >
                ${value}
            </div>


            <input
                id="scale"
                type="range"
                min="0"
                max="10"
                step="1"
                value="${value}"
            >

            <div class="scale-labels">

                <span>
                    0 — nenhuma
                </span>

                <span>
                    10 — absurda
                </span>

            </div>

        `;


        document
            .getElementById("scale")
            .addEventListener(
                "input",
                function() {

                    document
                        .getElementById(
                            "scaleNumber"
                        )
                        .textContent =
                        this.value;

                }
            );

    }


    document.getElementById("backButton")
        .style.visibility =
        currentQuestion === 0
        ? "hidden"
        : "visible";


    document.getElementById("nextButton")
        .textContent =
        currentQuestion === questions.length - 1
        ? "FINALIZAR ANÁLISE →"
        : "CONTINUAR →";

}



function nextQuestion() {

    const question =
        questions[currentQuestion];


    let answer;


    if (question.type === "text") {

        answer =
            document
                .getElementById("answer")
                .value
                .trim();


        if (!answer) {

            alert(
                "O algoritmo exige uma resposta. 😌"
            );

            return;

        }

    }

    else {

        answer =
            Number(
                document
                    .getElementById("scale")
                    .value
            );

    }


    answers[currentQuestion] =
        answer;


    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        renderQuestion();

    }

    else {

        enviarRespostas();

    }

}



function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

}



function enviarRespostas() {

    const dados = {

        respostas: {

            "1": answers[0],
            "2": answers[1],
            "3": answers[2],
            "4": answers[3],
            "5": answers[4],
            "6": answers[5],
            "7": answers[6],
            "8": answers[7]

        }

    };


    showLoading();


    fetch("/enviar", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(dados)

    })

    .then(response =>
        response.json()
    )

    .then(data => {

        if (data.success) {

            setTimeout(
                () => showResult(
                    data.compatibilidade
                ),
                1000
            );

        }

        else {

            showResult(99.8);

        }

    })

    .catch(error => {

        console.error(error);

        /*
        Mesmo se o servidor der algum erro,
        o sistema continua funcionando.
        */

        setTimeout(
            () => showResult(99.8),
            1000
        );

    });

}



function showLoading() {

    showScreen("loading");


    const messages = [

        "Comparando personalidades...",

        "Analisando interesses em comum...",

        "Calculando nível de química...",

        "Verificando compatibilidade emocional...",

        "Analisando possibilidade de novos encontros...",

        "Consultando banco de dados amoroso...",

        "Detectando possíveis problemas...",

        "⚠ ANOMALIA ENCONTRADA...",

        "Ignorando evidências que comprometem o paciente...",

        "Finalizando diagnóstico..."

    ];


    let index = 0;


    const interval =
        setInterval(() => {

            document.getElementById(
                "loadingTitle"
            ).textContent =
                messages[index];


            document.getElementById(
                "loadingSubtitle"
            ).textContent =

                index === 7

                ? "Isso não estava previsto nos protocolos."

                : "Processamento em andamento...";


            document.getElementById(
                "loadingBar"
            ).style.width =
                `${((index + 1) /
                messages.length) * 100}%`;


            index++;


            if (index >= messages.length) {

                clearInterval(interval);

            }

        }, 550);

}



function showResult(score) {

    document.getElementById("score")
        .textContent =
        `${Number(score)
            .toFixed(1)
            .replace(".", ",")}%`;


    showScreen("result");

}



const message = `Oi fefê, eu queria te pedir desculpas mais uma vez pelo que aconteceu.

Fiquei pensando desde ontem sobre isso, não quero que fique um clima estranho nem nada.

Entendo que você já tenha compreendido meu lado mas quero me redimir de verdade com você mô. Quero ser sincero com você e mostrar que eu agi mal.

Tô curtindo isso entre a gente e não quero tratar isso de qualquer jeito, fiz isso aqui como uma forma de prender sua atenção por um pouco mais de tempo.

Então fica aqui meu pedido sincero e honesto de desculpas. ❤️

E, se você aceitar o tratamento recomendado pelo algoritmo...

acho que ele também prescreveu mais um date entre a gente.`;



function openMessage() {

    showScreen("message");


    const element =
        document.getElementById(
            "messageText"
        );


    element.textContent = "";


    let index = 0;


    const interval =
        setInterval(() => {

            element.textContent +=
                message[index];


            index++;


            if (
                index >=
                message.length
            ) {

                clearInterval(interval);

            }

        }, 12);

}