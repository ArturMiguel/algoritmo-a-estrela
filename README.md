# Algoritmo A*
Trabalho desenvolvimento para disciplina de Inteligência Artificial com objeto de implementar o Algoritmo A* em um jogo de busca baseado no *The Legend of Zelda*. 

A implementação do Algoritmo A* baseia-se na heurística de *Manhattan distance* para encontrar o menor caminho entre dois pontos, além disso cada passo possui um custo relacionado ao terreno que o personagem caminha, ou seja, o algoritmo deve ser capaz de identificar a menor distância com o menor custo. Em relação a movimentação do personagem, como toda menor distância entre dois pontos é uma linha reta, o personagem limita-se propositalmente a andar/avaliar os blocos que estão a sua frente, direita, esquerda ou atrás.

### Tabela de custos
> Grama     -> custo +10

> Areia     -> custo +20

> Floresta  -> custo +100

> Montanha  -> custo +150

> Água      -> custo +180

![Imagem não encontrada](https://i.imgur.com/4wLpcvs.png)

### Linguagens 
> HTML 5

> CSS 3

> JavaScript

> Python 3

### Bibliotecas
> [p5.js](https://p5js.org/)

> [imageio](https://imageio.github.io/)

#### Observações
No Google Chrome o uso de alguns arquivos acabam resultando em erro de Cross-Origin, portando é recomendável o Mozila Firefox.
