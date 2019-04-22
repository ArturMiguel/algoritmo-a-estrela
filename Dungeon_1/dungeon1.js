function coloreMapa(mapa, tamanho, lista_rgb){
    for(var i = 0; i < tamanho; i++){
        for(var j = 0; j < tamanho; j++){
            lista_distancia_cor = []
            parte_escura = Math.sqrt(pow((lista_rgb[j][i][0] - 160), 2) + pow((lista_rgb[j][i][1] - 160),2) + pow((lista_rgb[j][i][2] - 160), 2));
            parte_clara = Math.sqrt(pow((lista_rgb[j][i][0] - 207), 2) + pow((lista_rgb[j][i][1] - 207), 2) + pow((lista_rgb[j][i][2] - 207), 2));
            lista_distancia_cor.push(parseInt(parte_escura), parseInt(parte_clara));
            minima = Math.min.apply(null, lista_distancia_cor);

            if(minima == parseInt(parte_escura)){
                mapa[i][j].show(color(160, 160, 160));
                mapa[i][j].terreno = "Escuridao";
                mapa[i][j].obstaculo = true;
            }
            else{
                mapa[i][j].show(color(255, 255, 255));
                mapa[i][j].terreno = "Luz";
                mapa[i][j].custo = 10;
            }
        }
    }
}

function removeBloco(arr, bloco){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == bloco){
            arr.splice(i, 1);
        }
    }
}

var tam = 28;
var mapa = new Array(tam);
var blocosAvaliados = []; //Conjunto de nós avaliados
var blocosNaoAvaliados = []; //Conjuntos de nós expandidos mas que não foram avaliados
var personagem, joia;
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
    this.obstaculo = false;

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

/*------------------------------------------------------
    INICIALIZAÇÃO DO MAPA
-------------------------------------------------------*/
function setup(){
    background(0);
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

    coloreMapa(mapa, tam, lista_rgb_dg1);

    personagem = mapa[14][26];
    joia = mapa[13][3];

    personagem.show(color(255, 0, 0));
    joia.show(color(255, 255, 0));
}

function busca(blocosA, blocosNaoA, inicio, meta, tipoBusca){
    setup();
    blocosA = []; blocosNaoA = []; //Blocos avaliados e blocos não avaliados
    blocosNaoA.push(inicio);

    //O bloco que será avaliado é o com menor valor f(n)
    while(atual != meta){
        var menorF = 0;
        for(var i = 0; i < blocosNaoA.length; i++){
            if(blocosNaoA[i].f < blocosNaoA[menorF].f)
                menorF = i;
        }
        var atual = blocosNaoA[menorF];

        //Se o bloco atual for o objetivo (meta) encerra a execução
        if(atual === meta){
            noLoop();
            var melhorCaminho = [];
            var aux = atual;
            while(aux.anterior){
                melhorCaminho.push(aux.anterior);
                aux = aux.anterior;
            }
            for(var i = melhorCaminho.length - 2; i >= 0; i--){
                melhorCaminho[i].show(color(255, 0, 0));
                alert("F(n) = " + melhorCaminho[i].f + "\nG(n) = " + melhorCaminho[i].g + "\nH(n) = " + melhorCaminho[i].h);
            }
            alert("F(n) = " + atual.f + "\nG(n) = " + atual.g + "\nH(n) = " + atual.h);
            if(tipoBusca === 'buscar'){
                $("#irJoia").hide();
                $("#joia").html("Joia -> f(n) = " + atual.f);
                $("#irSaida").show()
            }
            else{
                $("#irSaida").hide();
                $("#saida").html("Saída -> f(n) = " + atual.f);
                $("#irMapa").show()
            }
            return atual.f;
        }
        else{
            removeBloco(blocosNaoA, atual);
            blocosA.push(atual);
            
            var vizinhos = atual.vizinhos;
            //Percorre os vizinhos do bloco atual
            for(var i = 0; i < vizinhos.length; i++){
                //Ignora os blocos vizinhos que já foram avaliados
                if(!blocosA.includes(vizinhos[i]) && !vizinhos[i].obstaculo){
                    var atualG = atual.g + atual.custo; //Custo do inicio (bloco atual) até seu vizinho
                    var novoCaminho = false;
                    //Avalia os blocos vizinhos ainda não avaliados
                    if(blocosNaoA.includes(vizinhos[i])){
                        if(vizinhos[i].g > atualG){
                            novoCaminho = true;
                        }
                    }
                    else{
                        novoCaminho = true;
                        blocosNaoA.push(vizinhos[i]);
                    }
                    //Armazena o melhor caminho até o momento
                    if(novoCaminho){
                        vizinhos[i].g = atualG;
                        vizinhos[i].h = abs(meta.i - vizinhos[i].i) + abs(meta.j - vizinhos[i].j); //Manhattan distance
                        vizinhos[i].f = vizinhos[i].g + vizinhos[i].h;
                        vizinhos[i].anterior = atual;
                    }
                }
            }
        }
    }
}