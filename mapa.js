function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}
var dataInicio = new Date();
var tam = 42;
var mapa = new Array(tam);
var blocosAvaliados = []; //Conjunto de nós avaliados
var blocosNaoAvaliados = []; //Conjuntos de nós expandidos mas que não foram avaliados
var personagem, lostwoods, dungeon1, dungeon2, dungeon3, objetivo;
var w, h;

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
    this.show = function(tam){
        stroke(100);
        fill(tam);
        rect(this.i * h, this.j * w, h - 1, w - 1);
    }  
    //Vizinhos do bloco atual podem estar à esquerda, à direita, acima ou abaixo.
    this.addVizinhos = function(mapa){
        var i = this.i;
        var j = this.j;
        if(mapa[i - 1] && mapa[i - 1][j]){ //Esquerda
            this.vizinhos.push(mapa[i - 1][j]);
        }
        if(mapa[i + 1] && mapa[i + 1][j]){ //Direita
            this.vizinhos.push(mapa[i + 1][j]);
        }
        if(mapa[i][j + 1]){ //Cima
            this.vizinhos.push(mapa[i][j + 1]);
        }
        if(mapa[i][j - 1]){ //Baixo
            this.vizinhos.push(mapa[i][j - 1]);
        }
    }
}

/*------------------------------------------------------
    INICIALIZAÇÃO DO MAPA
-------------------------------------------------------*/
function setup(){
    createCanvas(1400, 1400);
    h = height / tam;
    w = width / tam;
    
    //Criação do Array 2d
    for(var i = 0; i < tam; i++){
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
    /*------------------------------------------------------
        DEFININDO A LOCALIZAÇÃO DOS OBJETOS
    -------------------------------------------------------*/
    /*Personagem*/
    personagem = mapa[25][28];
    /*Lost woods*/
    lostwoods = mapa[7][6];
    lostwoods.custo = 0;
    /*Dungeons*/
    dungeon1 = mapa[27][1];
    dungeon1.custo = 0;
    dungeon2 = mapa[40][20];
    dungeon2.custo = 0;
    dungeon3 = mapa[6][37];
    dungeon3.custo = 0;
    /*Objetivo*/
    objetivo = lostwoods;

    blocosNaoAvaliados.push(personagem);
}

function draw(){
    /*------------------------------------------------------
       ATRIBUIÇÃO DE CORES E TERRENO/CUSTO
    -------------------------------------------------------*/
    background(0);
    for(var i = 0; i < tam; i++){
        for(var j = 0; j < tam; j++){
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
    /*personagem.show(color(255, 0, 0));
    lostwoods.show(color(154, 154, 154));
    dungeon1.show(color(0, 0, 0));
    dungeon2.show(color(0, 0, 0));
    dungeon3.show(color(0, 0, 0));*/

    /*------------------------------------------------------
      PERCURSO UTILIZANDO HEURÍSTICA A*
    -------------------------------------------------------*/
    //Bloco com menor valor f(x)
    var menorF = 0;
    for(var i = 0; i < blocosNaoAvaliados.length; i++){
        if(blocosNaoAvaliados[i].f < blocosNaoAvaliados[menorF].f){
            menorF = i;
        }
    }
    var atual = blocosNaoAvaliados[menorF];
    
    //Objetivo encontrado, encerra execução e mostra o melhor caminho
    if(atual === objetivo){
        /*var melhorCaminho = [], cont = 0;
        while(atual.anterior){ //recursivo
            atual.show(color(255, 150, 0));
            melhorCaminho.push(atual.anterior);
            atual = atual.anterior;
            cont = cont + 1;
        }

        var dataFinal = new Date();
        var tempo = dataFinal - dataInicio;
        var minutos = Math.floor((tempo % (1000 * 60 * 60)) / (1000 * 60));
        var segundos = Math.floor((tempo % (1000 * 60)) / 1000);
        alert("Encontrou em " +  minutos + " minuto(s) e " + segundos + " segundos");*/
        noLoop();
    }
    else{
        removeBloco(blocosNaoAvaliados, atual);
        blocosAvaliados.push(atual);
        
        var vizinhos = atual.vizinhos;
        for(var i = 0; i < vizinhos.length; i++){
            //Var vizinho = vizinhos[i];
            if(!blocosAvaliados.includes(vizinhos[i])){
                var auxG = (atual.g + 1) + atual.custo; //Adiciona o custo de terreno a cada passo
                var novoCaminho = false;
                if(blocosNaoAvaliados.includes(vizinhos[i])){
                    if(auxG < vizinhos[i].g){
                        vizinhos[i].g = auxG;
                        novoCaminho = true;
                    }
                }
                else{
                    vizinhos[i].g = auxG;
                    novoCaminho = true;
                    blocosNaoAvaliados.push(vizinhos[i]);
                }
                if(novoCaminho){
                    vizinhos[i].h = abs(objetivo.i - vizinhos[i].i) + abs(objetivo.j - vizinhos[i].j); //Manhattan distance
                    vizinhos[i].f = vizinhos[i].g + vizinhos[i].h;
                    vizinhos[i].anterior = atual;
                }
            }
        }
    }

    /*var melhorCaminho = [], cont = 1;
    while(atual.anterior){ //recursivo
        atual.show(color(255, 150, 0));
        melhorCaminho.push(atual.anterior);
        atual = atual.anterior;
        cont = cont + 1;
    }*/
}