function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b){
    //var distancia = dist(a.i, a.j, b.i, b.j)
    var distancia = abs(a.i - b.i) + abs(a.j - b.j);
    return distancia;
}

var tam = 48;
var colunas = tam, linhas = tam;
var grid = new Array(colunas);

var blocosExpandidos = [], blocosVisitados = [];
var inicio, espada;
var w, h;
var melhorCaminho = [];

function Bloco(i, j){
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.vizinhos = [];
    this.anterior = "";
    this.obstaculo = false;
    this.terreno = '';
    
    //Definindo o bloco aleatoriamente como obstaculo
    if(Math.random(1) < 0.3){
        this.obstaculo = true;
    }
    

    this.show = function(colunas){
        fill(colunas);
        if(this.obstaculo){
            //fill(104, 76, 56);
        }
        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1); //Retângulo
    }
    

    //VIZINHOS DO NÓ ATUAL
    this.addVizinhos = function(grid){
        var i = this.i;
        var j = this.j;
        if(i < colunas - 1){
            this.vizinhos.push(grid[i + 1][j]);
        }
        if(i > 0){
            this.vizinhos.push(grid[i - 1][j]);
        }
        if(j < linhas - 1){
            this.vizinhos.push(grid[i][j + 1]);
        }
        if(j > 0){
            this.vizinhos.push(grid[i][j - 1]);
        }
        /*if(i > 0 && j > 0){
            this.vizinhos.push(grid[i - 1][j - 1]);
        }
        if(i < colunas - 1 && j > 0){
            this.vizinhos.push(grid[i + 1][j - 1]);
        }
        if(i > 0 && j < linhas - 1){
            this.vizinhos.push(grid[i - 1][j + 1]);
        }
        if(i < colunas - 1 && j < linhas - 1){
            this.vizinhos.push(grid[i + 1][j + 1]);
        }*/
    }
}

function setup(){
    createCanvas(1366, 1366);
    
    //PROPORÇÃO CORRETA DOS PIXELS
    w = width / colunas;
    h = height / linhas;
    
    //Array 2D
    for(var i = 0; i < colunas; i++){
        grid[i] = new Array(linhas);
    }
    
    for(var i = 0; i < colunas; i++){
        for(var j = 0; j < linhas; j++){
            grid[i][j] = new Bloco(i, j);
        }
    }
    for(var i = 0; i < colunas; i++){
        for(var j = 0; j < linhas; j++){
            grid[i][j].addVizinhos(grid);
        }
    }
    
    //DEFININDO A LOCALIZAÇÃO DOS OBJETOS
    /*Personagem*/
    inicio = grid[0][0];
    /*Espada*/
    grid[tam - 1][tam - 1].obstaculo = false;
    espada = grid[tam - 1][tam - 1];
    
    blocosExpandidos.push(inicio);
}

function draw(){
    //ATRIBUIÇÃO DAS CORES
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
                grid[i][j].show(color(146, 208, 80));
            }else if(minima == parseInt(d_areia)){
                grid[i][j].show(color(196,188,150));
            }else if(minima == parseInt(d_floresta)){
                grid[i][j].show(color(0,176,80));
            }else if(minima == parseInt(d_montanha)){
                grid[i][j].show(color(148, 138, 84));
            }else if(minima == parseInt(d_agua)){
                grid[i][j].show(color(84, 141, 212));
            }
        }
    }
    //espada.show(color(0, 0, 255));
    
    //PERCURSO
    if(blocosExpandidos.length > 0){
        var menorIndex = 0;
        for(var i = 0; i < blocosExpandidos.length; i++){
            if(blocosExpandidos[i].f < blocosExpandidos[menorIndex].f){
                menorIndex = i;
            }
        }
        var atual = blocosExpandidos[menorIndex];
        if(atual === espada){
            noLoop();
            melhorCaminho = [];
            var aux = atual;
            melhorCaminho.push(aux);
            while(aux.anterior){ //recursivo
                melhorCaminho.push(aux.anterior);
                aux = aux.anterior;
            }
        }
        
        removeBloco(blocosExpandidos, atual);
        blocosVisitados.push(atual);
        
        var vizinhos = atual.vizinhos;
        for(var i = 0; i < vizinhos.length; i++){
            var vizinho = vizinhos[i];
            
            if(!blocosVisitados.includes(vizinho) && !vizinho.obstaculo){
                var auxG = atual.g + 1;
                var novoCaminho = false;
                if(blocosExpandidos.includes(vizinho)){
                    if(auxG < vizinho.g){
                        vizinho.g = auxG;
                        novoCaminho = true;
                    }
                }
                else{
                    vizinho.g = auxG;
                    novoCaminho = true;
                    blocosExpandidos.push(vizinho);
                }
                if(novoCaminho){
                    vizinho.h = heuristic(vizinho, espada);
                    vizinho.f = vizinho.g + vizinho.h;
                    vizinho.anterior = atual;
                }
            }
        }
    }
    else{
        
    }
    //Coloração dos blocos visitados
    for(var i = 0; i < blocosVisitados.length; i++){
        //blocosVisitados[i].show(color(255, 255, 211));
        //blocosVisitados[i].show(color(255, 255, 255));
    }
    //Coloração dos blocos expandidos
    for(var i = 0; i < blocosExpandidos.length; i++){
        //blocosExpandidos[i].show(color(255, 255, 255));
    }
    
    melhorCaminho = [];
    var aux = atual;
    melhorCaminho.push(aux);
    while(aux.anterior){ //recursivo
        melhorCaminho.push(aux.anterior);
        aux = aux.anterior;
    }

    //Coloração do melhor caminho
    for(var i = 0; i < melhorCaminho.length; i++){
        //melhorCaminho[i].show(color(0, 0, 0))
    }
}