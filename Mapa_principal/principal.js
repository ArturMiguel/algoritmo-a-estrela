function coloreMapa(mapa, tamanho, lista_rgb){
    for(var i = 0; i < tamanho; i++){
        for(var j = 0; j < tamanho; j++){
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
                mapa[i][j].show(color(35, 142, 35));
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

var tam = 42;
var mapa = new Array(tam);
var blocosAvaliados = []; //Conjunto de nós avaliados
var blocosNaoAvaliados = []; //Conjuntos de nós expandidos mas que não foram avaliados
var personagem, lostwoods, dungeon1, dungeon2, dungeon3;
var w, h;
var img;
function preload(){
    img = loadImage("personagem.gif");
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
        stroke(100);
        fill(cor);
        rect(this.i * h, this.j * w, h - 1, w - 1);
    }
    this.addVizinhos = function(mapa){
        var i = this.i;
        var j = this.j;
        if(mapa[i - 1] && mapa[i - 1][j]) this.vizinhos.push(mapa[i - 1][j]); //Esquerda
        if(mapa[i + 1] && mapa[i + 1][j]) this.vizinhos.push(mapa[i + 1][j]); //Direita
        if(mapa[i][j + 1]) this.vizinhos.push(mapa[i][j + 1]); //Cima
        if(mapa[i][j - 1]) this.vizinhos.push(mapa[i][j - 1]); //Baixo
    }
}

function setup(){
    background(0);
    mapaZelda = createCanvas(2100, 2100);
    h = height / tam;
    w = width / tam;
    for(var i = 0; i < tam; i++){ //Criação do Array 2d
        mapa[i] = new Array(tam);
    }
    for(var i = 0; i < tam; i++){
        for(var j = 0; j < tam; j++){
            mapa[i][j] = new Bloco(i, j);
        }
    }
    for(var i = 0; i < tam; i++){
        for(var j = 0; j < tam; j++){
            mapa[i][j].addVizinhos(mapa);
        }
    }
    coloreMapa(mapa, tam, lista_rgb_principal);
    personagem = mapa[24][27];
    lostwoods = mapa[6][6];
    dungeon1 = mapa[24][1];
    dungeon2 = mapa[39][17];
    dungeon3 = mapa[5][32];
    personagem.local = "Casa do Link";
    lostwoods.local = "Lostwoods";
    dungeon1.local = "Dungeon 1";
    dungeon2.local = "Dungeon 2";
    dungeon3.local = "Dungeon 3";
    lostwoods.show(color(154, 154, 154));
    dungeon1.show(color(0, 0, 0));
    dungeon2.show(color(0, 0, 0));
    dungeon3.show(color(0, 0, 0));
    image(img, (personagem.i*2100)/tam, (personagem.j*2100)/tam, 50, 50);
}

function entrarDungeon(atual){
    var ir = confirm("Entrar na " + atual.local + "?");
    if(ir){
        if(atual.local == "Dungeon 1"){
            $("#irDg1").hide();
           // window.location = "../Dungeon_1/dungeon1.html";
        }else if(atual.local == "Dungeon 2"){
            $("#irDg2").hide();
        }else if(atual.local == "Dungeon 3"){
            $("#irDg3").hide();
            //location.href = "../Dungeon_3/dungeon3.html";
        }
    }
}

function desenharCaminho(atual){
    var melhorCaminho = [];
    var aux = atual;
    melhorCaminho.push(atual);
    while(aux.anterior){
        melhorCaminho.push(aux.anterior);
        aux = aux.anterior;
    }
    var cont = melhorCaminho.length - 1;
    personagem.show(color(146, 208, 80));
    var intervalo = setInterval(function(){
        if(cont == 0){
            clearInterval(intervalo);
            entrarDungeon(atual);
        }
        image(img, (melhorCaminho[cont].i*2100)/(42), (melhorCaminho[cont].j*2100)/(42), 50, 50);
        cont = cont - 1;
    }, 10); 
};

function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

function busca(blocosA, blocosNaoA, inicio, meta){
    setup();
    blocosA = []; blocosNaoA = []; //Blocos avaliados e blocos não avaliados
    blocosNaoA.push(inicio);
    
    while(atual != meta){
        var menorF = 0; //O bloco que será avaliado é o com menor valor f(n)
        for(var i = 0; i < blocosNaoA.length; i++){
            if(blocosNaoA[i].f < blocosNaoA[menorF].f)
                menorF = i;
        }
        var atual = blocosNaoA[menorF];
        if(atual === meta){ //Se o bloco atual for o objetivo (meta) encerra a execução
            desenharCaminho(atual);
            personagem = mapa[atual.i][atual.j];
        }else{
            removeBloco(blocosNaoA, atual);
            blocosA.push(atual);
            var vizinhos = atual.vizinhos;
            for(var i = 0; i < vizinhos.length; i++){ //Percorre os vizinhos do bloco atual
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
function verificarJoias(){
    if($("#irDg1").is(":hidden") && $("#irDg2").is(":hidden") && $("#irDg3").is(":hidden")){
        busca(blocosAvaliados, blocosNaoAvaliados, personagem, lostwoods);
    }else{
        alert("Necessário todas as jóias para is até Lost Woods!");
    }
}