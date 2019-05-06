function coloreMapa(mapa, tamanho, lista_rgb){
    for(let i = 0; i < tamanho; i++){
        for(let j = 0; j < tamanho; j++){
            lista_distancia_cor = []
            parte_escura = Math.sqrt(pow((lista_rgb[j][i][0] - 160), 2) + pow((lista_rgb[j][i][1] - 160),2) + pow((lista_rgb[j][i][2] - 160), 2));
            parte_clara = Math.sqrt(pow((lista_rgb[j][i][0] - 207), 2) + pow((lista_rgb[j][i][1] - 207), 2) + pow((lista_rgb[j][i][2] - 207), 2));
            lista_distancia_cor.push(parseInt(parte_escura), parseInt(parte_clara));
            minima = Math.min.apply(null, lista_distancia_cor);
            if(minima == parseInt(parte_escura)){
                mapa[i][j].show(color(160, 160, 160));
                mapa[i][j].obstaculo = true;
            }else{
                mapa[i][j].show(color(255, 255, 255));
                mapa[i][j].custo = 10;
            }
        }
    }
}

function removeBloco(arr, bloco){
    for(let i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

tam = 28;
mapa = new Array(tam);
blocosAvaliados = []; //Conjunto de nós avaliados
blocosNaoAvaliados = []; //Conjuntos de nós expandidos mas que não foram avaliados
taDesenhando = 0;

function preload(){
    imgLink = loadImage("personagem.gif");
    imgPingente = loadImage("pingente.png");
};

function Bloco(i, j){
    this.i = i;
    this.j = j;
    this.f = 0; //Distância total do inicio até o objetivo f(n) = g(n) + h(n)
    this.g = 0;  //Distância do nó inicial até o atual
    this.h = 0; //Heuristica utilizada para calcular a distância do nó atual até o nó objetivo
    this.vizinhos = [];
    this.anterior = "";
    this.terreno = "";
    this.custo = 0;
    this.local = "";
    this.obstaculo = false;
    this.show = function(cor){
        stroke(100)
        fill(cor);
        rect(this.i * h, this.j * w, h - 1, w - 1);
    }
    this.addVizinhos = function(mapa){
        let i = this.i;
        let j = this.j;
        if(mapa[i - 1] && mapa[i - 1][j]) this.vizinhos.push(mapa[i - 1][j]); //Esquerda
        if(mapa[i + 1] && mapa[i + 1][j]) this.vizinhos.push(mapa[i + 1][j]); //Direita
        if(mapa[i][j + 1]) this.vizinhos.push(mapa[i][j + 1]); //Cima
        if(mapa[i][j - 1]) this.vizinhos.push(mapa[i][j - 1]); //Baixo
    }
}

function setup(){
    background(0);
    createCanvas(800, 800);
    h = height / tam;
    w = width / tam;
    for(let i = 0; i < tam; i++){ //Criação do Array 2d
        mapa[i] = new Array(tam);
    }
    for(let i = 0; i < tam; i++){
        for(let j = 0; j < tam; j++){
            mapa[i][j] = new Bloco(i, j);
        }
    }
    for(let i = 0; i < tam; i++){
        for(let j = 0; j < tam; j++){
            mapa[i][j].addVizinhos(mapa);
        }
    }
    coloreMapa(mapa, tam, lista_rgb_dg3);
    personagem = mapa[14][25];
    pingente = mapa[15][19];
    entrada = mapa[14][25];
    entrada.local = "Entrada";
    pingente.local = "Pingente";
    image(imgLink, (personagem.i * 800) / tam, (personagem.j * 800) / tam, 28, 28);
    image(imgPingente, (pingente.i * 800) / tam, (pingente.j * 800) / tam, 28, 28);
}

function desenharCaminho(atual){
    let melhorCaminho = [];
    let aux = atual;
    melhorCaminho.push(atual);
    while(aux.anterior){
        melhorCaminho.push(aux.anterior);
        aux = aux.anterior;
    }
    let cont = melhorCaminho.length - 1;
    let contPassos = 0;
    personagem.show(color(255, 255, 255));
    let intervalo = setInterval(function(){
        taDesenhando = 1;
        image(imgLink, (melhorCaminho[cont].i * 800) / tam, (melhorCaminho[cont].j * 800) / tam, 28, 28);
        if(melhorCaminho[cont - 1]){
            $("#listagem").html("<tr><th>" + contPassos + "</th><th>" + melhorCaminho[cont - 1].g + "</th><th>" + melhorCaminho[cont - 1].h + "</th><th>" + melhorCaminho[cont - 1].f + "</th></tr>");
        }
        if(melhorCaminho[cont + 1]){
            melhorCaminho[cont + 1].show(color(255, 255, 0));
        }
        if(cont == 0){
            taDesenhando = 0;
            clearInterval(intervalo);
        }else{
            cont = cont - 1;
            contPassos = contPassos + 1;
        }
    }, 200);
}

function busca(blocosA, blocosNaoA, inicio, meta){
    setup();
    dataInicial = new Date();
    blocosA = []; blocosNaoA = []; //Blocos avaliados e blocos não avaliados
    blocosNaoA.push(inicio);
    while(atual != meta){ //O bloco que será avaliado é o com menor valor f(n)
        var menorF = 0;
        for(let i = 0; i < blocosNaoA.length; i++){
            if(blocosNaoA[i].f < blocosNaoA[menorF].f)
                menorF = i;
        }
        var atual = blocosNaoA[menorF];
        if(atual === meta){ //Se o bloco atual for o objetivo (meta) encerra a execução
            dataFinal = new Date();
            if(meta.local == "Pingente"){
                $("#irPingente").hide();
                $("#irEntrada").show();
            }else if(meta.local == "Entrada"){
                $("#irEntrada").hide();
                $("#irMapa").show();
            }
            dif = Math.abs((dataInicial.getTime() - dataFinal.getTime()) / 1000);
            $("#tempoExecucao").html(dif + 's');
            desenharCaminho(atual);
        }else{
            removeBloco(blocosNaoA, atual);
            blocosA.push(atual);
            var vizinhos = atual.vizinhos;
            for(var i = 0; i < vizinhos.length; i++){ //Percorre os vizinhos do bloco atual
                if(!blocosA.includes(vizinhos[i]) && !vizinhos[i].obstaculo){ //Ignora os blocos vizinhos que já foram avaliados
                    var atualG = atual.g + atual.custo; //Custo do inicio (bloco atual) até seu vizinho
                    var novoCaminho = false;
                    if(blocosNaoA.includes(vizinhos[i])){ //Avalia os blocos vizinhos ainda não avaliados
                        if(vizinhos[i].g > atualG){
                            novoCaminho = true;
                        }
                    }else{
                        novoCaminho = true;
                        blocosNaoA.push(vizinhos[i]);
                    }
                    if(novoCaminho){ //Salva o melhor caminho até o momento
                        if(atual != inicio){ //Ignora os custos do bloco inicial
                            vizinhos[i].g = atualG;
                            vizinhos[i].h = abs(meta.i - vizinhos[i].i) + abs(meta.j - vizinhos[i].j); //Manhattan distance
                            vizinhos[i].f = vizinhos[i].g + vizinhos[i].h;
                        }
                        vizinhos[i].anterior = atual;
                    }
                }
            }
        }
    }
}

setInterval(function(){
    if(taDesenhando == 0) {
        $("button").each(function() {
            $(this).removeAttr('disabled');
        });
    }else{
        $("button").each(function() {
            $(this).attr('disabled', 'true');
        });
    }
}, 0)
