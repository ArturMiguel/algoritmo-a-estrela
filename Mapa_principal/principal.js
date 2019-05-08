function coloreMapa(mapa, tamanho, lista_rgb){
    for(let i = 0; i < tamanho; i++){
        for(let j = 0; j < tamanho; j++){
            lista_distancia_cor = []
            d_grama = Math.sqrt(pow((lista_rgb[j][i][0] - 146), 2) + pow((lista_rgb[j][i][1] - 208),2) +
            pow((lista_rgb[j][i][2] - 80), 2));
            d_areia = Math.sqrt(pow((lista_rgb[j][i][0] - 196), 2) + pow((lista_rgb[j][i][1] - 188), 2) +
            pow((lista_rgb[j][i][2] - 150), 2));
            d_floresta = Math.sqrt(pow((lista_rgb[j][i][0] - 0), 2) + pow((lista_rgb[j][i][1] - 176), 2) +
            pow((lista_rgb[j][i][2] - 80), 2));
            d_montanha = Math.sqrt(pow((lista_rgb[j][i][0] - 148), 2) + pow((lista_rgb[j][i][1] - 138), 2) +
            pow((lista_rgb[j][i][2] - 84), 2));
            d_agua = Math.sqrt(pow((lista_rgb[j][i][0] - 84), 2) + pow((lista_rgb[j][i][1] - 141), 2) +
            pow((lista_rgb[j][i][2] - 212), 2));
            lista_distancia_cor.push(parseInt(d_grama), parseInt(d_areia), parseInt(d_floresta), parseInt(d_montanha), parseInt(d_agua));
            minima = Math.min.apply(null, lista_distancia_cor);
            if(minima == parseInt(d_grama)){
                mapa[i][j].show(color(146, 208, 80));
                mapa[i][j].terreno = "Grama";
                mapa[i][j].custo = 10;
            }else if(minima == parseInt(d_areia)){
                mapa[i][j].show(color(196, 188, 150));
                mapa[i][j].terreno = "Areia";
                mapa[i][j].custo = 20;
            }else if(minima == parseInt(d_floresta)){
                mapa[i][j].show(color(0, 140, 0));
                mapa[i][j].terreno = "Floresta";
                mapa[i][j].custo = 100;
            }else if(minima == parseInt(d_montanha)){
                mapa[i][j].show(color(148, 138, 84));
                mapa[i][j].terreno = "Montanha";
                mapa[i][j].custo = 150;
            }else if(minima == parseInt(d_agua)){
                mapa[i][j].show(color(84, 141, 212));
                mapa[i][j].terreno = "Agua";
                mapa[i][j].custo = 180;
            }
        }
    }
}

tam = 42;
mapa = new Array(tam);
blocosAvaliados = []; //Conjunto de nós avaliados
blocosNaoAvaliados = []; //Conjuntos de nós expandidos mas que não foram avaliados
qtdPingentes = 0;
taDesenhando = 0;

function preload(){
    imgLink = loadImage("personagem.gif");
    imgDungeon1 = loadImage("dungeon.png");
    imgDungeon2 = loadImage("dungeon.png");
    imgDungeon3 = loadImage("dungeon.png");
    imgLostWoods = loadImage("lostwoods.png");
    imgEspada = loadImage("espada.png");
};

function Bloco(i, j){
    this.i = i;
    this.j = j;
    this.f = 0; //Distância total do inicio até o objetivo f(n) = g(n) + h(n)
    this.g = 0;  //Distância do nó inicial até o atual
    this.h = 0; //Heuristica utilizada para calcular a distância do nó atual até o nó objetivo
    this.custo = 0;
    this.vizinhos = [];
    this.anterior = "";
    this.terreno = "";
    this.local = "";
    this.show = function(cor){
        //stroke(cor.levels['0'], cor.levels['1'], cor.levels['2']);
        stroke(130);
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
    mapaZelda = createCanvas(800, 800);
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
    coloreMapa(mapa, tam, lista_rgb_principal);
    personagem = mapa[24][27];
    lostwoods = mapa[6][5];
    espada = mapa[2][1];
    dungeon1 = mapa[24][1];
    dungeon2 = mapa[39][17];
    dungeon3 = mapa[5][32];
    personagem.local = "Casa do Link";
    lostwoods.local = "Lost Woods";
    espada.local = "Espada";
    dungeon1.local = "Dungeon 1";
    dungeon2.local = "Dungeon 2";
    dungeon3.local = "Dungeon 3";
    image(imgLink, (personagem.i * 800) / tam, (personagem.j * 800) / tam, 20, 20);
    image(imgLostWoods, (lostwoods.i * 800) / tam, (lostwoods.j * 800) / tam, 20, 20);
    image(imgEspada, (espada.i * 800) / tam, (espada.j * 800) / tam, 20, 20);
    image(imgDungeon1, (dungeon1.i * 800) / tam, (dungeon1.j * 800) / tam, 20, 20);
    image(imgDungeon2, (dungeon2.i * 800) / tam, (dungeon2.j * 800) / tam, 20, 20);
    image(imgDungeon3, (dungeon3.i * 800) / tam, (dungeon3.j * 800) / tam, 20, 20);
    image(imgDungeon3, (dungeon3.i * 800) / tam, (dungeon3.j * 800) / tam, 20, 20);
}

function tipoDestino(atual){
    if(atual.local == "Lost Woods"){
        alert("Você chegou na entrada de Lost Woods. Indo para a espada!!");
        busca(blocosAvaliados, blocosNaoAvaliados, lostwoods, espada);
    }else if(atual.local == "Espada"){
        alert("Fim de jogo");
        $("#irLostwoods").hide();
        $("#reiniciar").show();
    }
    else{
        var ir = confirm("Confirmar " + atual.local + "?");
        if(ir){
            if(atual.local == "Dungeon 1"){
                $("#irDg1").hide();
                qtdPingentes = qtdPingentes + 1;
                window.location = "../Dungeon_1/dungeon1.html";
            }else if(atual.local == "Dungeon 2"){
                qtdPingentes = qtdPingentes + 1;
                window.location = "../Dungeon_2/dungeon2.html";
            $("#irDg2").hide();
            }else if(atual.local == "Dungeon 3"){
                qtdPingentes = qtdPingentes + 1;
                location.href = "../Dungeon_3/dungeon3.html";
            $("#irDg3").hide();
            }
        }
    }
}

function desenharCaminho(atual){
    let melhorCaminho = [];
    let aux = atual;
    melhorCaminho.push(atual);
    while(aux.anterior){
        melhorCaminho.push(aux.anterior);
        aux = aux.anterior;
    }
    console.log(melhorCaminho);
    let cont = melhorCaminho.length - 1;
    let contPassos = 0;
    personagem.show(color(146, 208, 80));
    $("#caminho").html("Saindo de " + melhorCaminho[melhorCaminho.length - 1].local + " até " + melhorCaminho[0].local);
    let intervalo = setInterval(function(){
        taDesenhando = 1;
        image(imgLink, (melhorCaminho[cont].i * 800) / (42), (melhorCaminho[cont].j * 800) / (42), 20, 20);
        if(melhorCaminho[cont - 1]){
            $("#listagem").html("<tr><th>" + contPassos + "</th><th>" + melhorCaminho[cont - 1].g + "</th><th>" + melhorCaminho[cont - 1].h + "</th><th>" + melhorCaminho[cont - 1].f + "</th></tr>");
        }
        if(melhorCaminho[cont + 1]){
            melhorCaminho[cont + 1].show(color(255, 255,  0));
        }
        if(cont == 0){
            taDesenhando = 0;
            clearInterval(intervalo);
            tipoDestino(atual);
        }else{
            cont = cont - 1;
            contPassos = contPassos + 1;
        }
    }, 200);
};

function removeBloco(arr, bloco){
    for(let i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

function busca(blocosA, blocosNaoA, inicio, meta){
    setup();
    dataInicial = new Date();
    blocosA = []; blocosNaoA = []; //Blocos avaliados e blocos não avaliados
    blocosNaoA.push(inicio);

    while(atual != meta){
        var menorF = 0; //O bloco que será avaliado é o com menor valor f(n)
        for(let i = 0; i < blocosNaoA.length; i++){
            if(blocosNaoA[i].f < blocosNaoA[menorF].f)
                menorF = i;
        }
        var atual = blocosNaoA[menorF];
        if(atual === meta){ //Se o bloco atual for o objetivo (meta) encerra a execução
            dataFinal = new Date();
            dif = Math.abs((dataInicial.getTime() - dataFinal.getTime()) / 1000);
            $("#tempoExecucao").html(dif + 's');
            desenharCaminho(atual);
            personagem = mapa[atual.i][atual.j];
        }else{
            removeBloco(blocosNaoA, atual);
            blocosA.push(atual);
            var vizinhos = atual.vizinhos;
            for(let i = 0; i < vizinhos.length; i++){ //Percorre os vizinhos do bloco atual
                if(!blocosA.includes(vizinhos[i])){ //Ignora os blocos vizinhos que já foram avaliados
                    var atualG = atual.g + atual.custo; //Custo do bloco atual até seu vizinho considerando o terreno
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

//Gambiarra temporária
function verificarPingentes(){
    if(qtdPingentes == 3){
        busca(blocosAvaliados, blocosNaoAvaliados, personagem, lostwoods);
    }else{
        alert("Colete todos os pingentes primeiramente para prosseguir até Lost Woods!\nQuantidade coletada até agora: " + qtdPingentes);
    }
}

//Maior gambiarra para desabilitar os button
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
