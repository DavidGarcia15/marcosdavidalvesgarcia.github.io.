# Farmers Field — 3D Prototype

Um jogo de exploração agrícola em primeira pessoa inspirado no mecanismo real de *Shotgun Farmers*: tiros que erram plantam a própria arma no chão — não existe recarga tradicional. Aqui a abordagem é não-violenta: em vez de eliminar NPCs, você os transforma em animais aliados com pólen.

## Plataforma

**Disponível para PC e notebook.** A versão atual foi desenvolvida para teclado e mouse e ainda não possui controles adaptados para celular.

## Mecânicas Principais

- **Sem Recarga, Só Colheita:** fiel ao jogo original — não há botão de "recarregar". Um tiro que erra planta uma semente no chão; quanto mais tempo ela cresce, mais munição rende ao ser colhida com **E**.
- **Arsenal Vegetal (7 armas):** Espingarda de Milho (3 grãos em leque), Sniper de Girassol, Lançador de Abóbora, Peavolver, HayK-47, WatermeLMG e Borrifo de Pimenta — troque com **1-7**.
- **Automáticas de verdade:** HayK-47, WatermeLMG e o Borrifo de Pimenta disparam continuamente enquanto o clique esquerdo é mantido pressionado; as demais são semiautomáticas (um tiro por clique).
- **Pólen em vez de Dano:** acertos (diretos ou por nuvem de pólen) enchem a barra de vínculo de um fazendeiro. Ao encher, ele vira um animal aliado (capivara, coelho ou galinha) — sem mortes. Quando os 6 fazendeiros do mapa são convertidos, a fazenda toca uma fanfarra de vitória.
- **Canteiros que se Renovam:** os pickups fixos espalhados pelo mapa voltam a crescer no mesmo lugar depois de colhidos, então o campo nunca fica permanentemente vazio.
- **Aliados Ativos:** depois de convertidos, os animais passam a plantar novas sementes pelo campo, ajudando sua munição.
- **Muzzle Flash:** cada tiro gera uma luz colorida no cano, de acordo com a arma.

## Controles

| Tecla | Ação |
| --- | --- |
| W A S D | Mover |
| Mouse | Olhar |
| Shift | Correr |
| Space | Pular |
| 1-7 | Trocar arma |
| Clique Esquerdo | Atirar (segure para as automáticas) |
| Botão Direito | Mirar (zoom do Sniper de Girassol) |
| E | Colher planta / pickup (recarrega) |
| Esc | Pausar |

## Executar Localmente

```bash
python -m http.server 8000
```
