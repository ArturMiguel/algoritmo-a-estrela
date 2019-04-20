#essa parte converte em rgb
import imageio
rgb_list = imageio.imread('dg1.png')
#variavel rgb_list é uma matriz do tipo imageio

#essa parte é gambiarra para jogar no javascript
lista_full = []
for i in range(0,28):
    lista_col = []
    for j in range(0,28):
        lista_aux = []
        for k in range(0,3):
            lista_aux.append(int(rgb_list[i][j][k]))
        lista_col.append(lista_aux)
    lista_full.append(lista_col)
print(lista_full)
