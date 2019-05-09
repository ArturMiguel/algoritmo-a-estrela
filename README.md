Execução do algoritmo: https://arturmiguel.github.io/algoritmoaestrela/index.html

### Descrição
"Após matar o rei de Hyrule, o mago Agahnim está mantendo a princesa Zelda prisioneira e pretende romper o selo que mantém o malvado Ganon aprisionado no Dark World. Link é o único guerreiro capaz de vencer o mago Agahnim, salvar a princesa Zelda e trazer a paz para o reino de Hyrule. <br>
Porém, a única arma forte o suficiente para derrotar o mago Agahnim é a legendaria Master Sword, que encontra-se presa em um pedestal em Lost Woods. <br>
Para provar que é digno de empunhar a Master Sword, Link deve encontrar e reunir os três Pingentes da Virtude: coragem, poder e sabedoria. Os três pingentes encontram-se espalhados pelo reino de Hyrule, dentro de perigosas Dungeons."

O trabalho consiste em fazer com que o agente (Link) seja capaz de locomover-se autonomamente pelo reino de Hyrule, explorar as perigosas dungeons e reunir os três Pingentes da Virtude.<br>
Para isso é implementado o algoritmo A* baseando-se na heurística de *Manhatan distance* para encontrar sempre a melhor/menor rota considerando a distância entre estado atual e meta e o custo de cada terreno.

### Algoritmo A*

### Tabela de custos
| Terreno | Custo |
| --- | --- |
| Grama | +10|
| Areia | +20|
| Floresta | +100|
| Montanha | +150|
| Água | +180|

### Linguagens 
> HTML 5 e CSS 3

> JavaScript

> Python 3

### Dependências
> [Bootstrap](https://getbootstrap.com/)

> [p5.js](https://p5js.org/)

> [imageio](https://imageio.github.io/)
