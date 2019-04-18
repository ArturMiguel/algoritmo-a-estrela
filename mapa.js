function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

/*function heuristic(inicio, fim){
    var d1 = abs(fim.i - inicio.i);
    var d2 = abs(fim.j - inicio.j);
    var distancia = d1 + d2;
    return distancia;
}*/

var tam = 48;
var colunas = tam, linhas = tam;
var grid = new Array(colunas);

var blocosExpandidos = [], blocosVisitados = [];
var personagem, espada, dungeon1, dungeon2, dungeon3, objetivo;
var w, h;
var melhorCaminho = [];

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
    this.show = function(colunas){
        fill(colunas);
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }  
    //Vizinhos do nó atual podem estar à esquerda, à direita, acima ou abaixo.
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
    
    /*------------------------------------------------------
        DEFININDO A LOCALIZAÇÃO DOS OBJETOS
    -------------------------------------------------------*/
    /*Personagem*/
    personagem = grid[28][31];
    /*Espada*/
    espada = grid[2][1];
    espada.custo = 0;
    /*Dungeons*/
    dungeon1 = grid[27][1];
    dungeon1.custo = 0;
    dungeon2 = grid[45][20];
    dungeon2.custo = 0;
    dungeon3 = grid[28][34];
    dungeon3.custo = 0;
    /*Objetivo*/
    objetivo = dungeon1;

    blocosExpandidos.push(personagem);
}

function draw(){
    /*------------------------------------------------------
       ATRIBUIÇÃO DE CORES E TERRENO
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
                grid[i][j].show(color(146, 208, 80));
                grid[i][j].terreno = "Grama";
                grid[i][j].custo = 10;
            }else if(minima == parseInt(d_areia)){
                grid[i][j].show(color(196, 188, 150));
                grid[i][j].terreno = "Areia";
                grid[i][j].custo = 20;
            }else if(minima == parseInt(d_floresta)){
                grid[i][j].show(color(35, 142, 35));
                grid[i][j].terreno = "Floresta";
                grid[i][j].custo = 100;
            }else if(minima == parseInt(d_montanha)){
                grid[i][j].show(color(148, 138, 84));
                grid[i][j].terreno = "Montanha";
                grid[i][j].custo = 150;
            }else if(minima == parseInt(d_agua)){
                grid[i][j].show(color(84, 141, 212));
                grid[i][j].terreno = "Agua";
                grid[i][j].custo = 180;
            }
        }
    }
    personagem.show(color(255, 0, 0));
    espada.show(color(154, 154, 154));
    dungeon1.show(color(0, 0, 0));
    dungeon2.show(color(0, 0, 0));
    dungeon3.show(color(0, 0, 0));

    /*------------------------------------------------------
      PERCURSO UTILIZANDO HEURÍSTICA A*
    -------------------------------------------------------*/
    //Bloco com menor valor f(x)
    if(blocosExpandidos.length > 0){
        var menorIndex = 0;
        for(var i = 0; i < blocosExpandidos.length; i++){
            if(blocosExpandidos[i].f < blocosExpandidos[menorIndex].f){
                menorIndex = i;
            }
        }
        var atual = blocosExpandidos[menorIndex];
        
        //Objetivo encontrado, encerra execução
        if(atual === objetivo){
            noLoop();
        }
        
        removeBloco(blocosExpandidos, atual);
        blocosVisitados.push(atual);
        
        var vizinhos = atual.vizinhos;
        for(var i = 0; i < vizinhos.length; i++){
            var vizinho = vizinhos[i];
            
            if(!blocosVisitados.includes(vizinho)){
                //var auxG = atual.g + 1;
                var auxG = (atual.g + 1) + atual.custo; //Adiciona o custo de terreno a cada passo
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
                    //vizinho.h = heuristic(vizinho, objetivo);
                    vizinho.h = abs(objetivo.i - vizinho.i) + abs(objetivo.j - vizinho.j); //Manhattan distance
                    vizinho.f = vizinho.g + vizinho.h;
                    vizinho.anterior = atual;
                }
            }
        }
    }
    
    var melhorCaminho = [];
    var aux = atual;
    melhorCaminho.push(aux);
    var cont = 0;
    while(aux.anterior){ //recursivo
        melhorCaminho.push(aux.anterior);
        melhorCaminho[cont].show(color(255, 165, 0));
        aux = aux.anterior;
        cont = cont + 1;
    }
}