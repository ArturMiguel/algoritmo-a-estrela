function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b){
   // var distancia = dist(a.i, a.j, b.i, b.j)
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
    
    this.show = function(colunas){
        fill(colunas);
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
    inicio = grid[28][26];
    espada = grid[tam -1 ][tam - 1];
    
    blocosExpandidos.push(inicio);
    //console.log(grid);
}

function draw(){
    //ATRIBUIÇÃO DAS CORES
    background(0);
    for(var i = 0; i < tam; i++){
        for(var j = 0; j < tam; j++){
            grid[i][j].show(color(255));
        }
    }
    espada.show(color(0, 0, 255));
    
    
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
            alert("Encontrou a espada em\n" + 
                 "Linha " + atual.i +
                 "\nColuna " + atual.j);
        }
        
        removeBloco(blocosExpandidos, atual);
        blocosVisitados.push(atual);
        
        var vizinhos = atual.vizinhos;
        for(var i = 0; i < vizinhos.length; i++){
            var vizinho = vizinhos[i];
            
            if(!blocosVisitados.includes(vizinho)){
                var auxG = atual.g + 1;
                
                if(blocosExpandidos.includes(vizinho)){
                    if(auxG < vizinho.g){
                        vizinho.g = auxG;
                    }
                }
                else{
                    vizinho.g = auxG;
                    blocosExpandidos.push(vizinho);
                }
                
                vizinho.h = heuristic(vizinho, espada);
                vizinho.f = vizinho.g + vizinho.h;
                vizinho.anterior = atual;
            }
        }
    }
    else{
        
    }
    for(var i = 0; i < blocosVisitados.length; i++){
        blocosVisitados[i].show(color(211, 211, 211));
    }
    for(var i = 0; i < blocosExpandidos.length; i++){
        blocosExpandidos[i].show(color(255, 0, 0));
    }
    
    melhorCaminho = [];
    var aux = atual;
    melhorCaminho.push(aux);
    while(aux.anterior){
        melhorCaminho.push(aux.anterior);
        aux = aux.anterior;
    }
    
    for(var i = 0; i < melhorCaminho.length; i++){
        melhorCaminho[i].show(color(0, 255, 0))
    }
}