---
layout: post
title: Simuler l'univers (rien que ça)
date: 2025-05-02
description: Simulating the Universe
tags:
categories:
---

L’univers est un endroit décidément trop grand pour être raisonnable. Il est rempli de matière invisible, d’étoiles lointaines, et de gens effroyablement ennuyeux qui pensent qu’on peut l’expliquer avec des équations. Tout commence avec une question simple : comment simuler l’évolution de la matière noire, cette chose mystérieuse qui compose 25 % de la masse de l’univers et ne prend même pas la peine de briller ? La réponse, bien entendu, implique une équation. En l’occurrence, l’équation de Vlasov :

<p>
$$
\frac{\partial f}{\partial t} + v \cdot \nabla_x f - \nabla \Phi \cdot \nabla_v f = 0.
$$
</p>

Ne paniquez pas. Cette équation dit simplement que les particules vont là où la gravité leur dit d’aller, à condition qu’elles n’entrent pas en collision, ne changent pas d’avis, et ne soient pas distraites par un champ de force. On modélise donc la matière noire comme un fluide très poli, qui suit les règles sans discuter. Mais pour que la gravité sache quoi faire, il faut lui donner un plan. Ce plan, c’est l’équation de Poisson :

<p>
$$
\nabla^2 \Phi = 4\pi G (\rho - \bar{\rho}).
$$
</p>

Là encore, rien de bien méchant : si la densité de matière est un peu trop élevée quelque part, alors hop, la gravité tire tout le monde vers ce coin, comme une soirée où il reste encore des chips. Et ainsi l’univers s’organise.

Mais résoudre ces équations à la main est un peu long, on utilise des ordinateurs. On leur confie des centaines, des milliers, des millions, des milliards (selon notre envie mais surtout selon le budget de notre université) de particules fictives et on les regarde évoluer sur une grille numérique. C’est ce qu’on appelle la méthode Particle-In-Cell, ou PIC pour les gens pressés (et les amateurs de sigles mystérieux). Le principe est simple. On commence par placer des particules dans un cube (virtuel, mais très sérieux), puis :

1. On leur demande gentiment de déposer leur masse sur une grille.

2. On calcule le potentiel gravitationnel avec une FFT (Fast Fourier Transform, pour les intimes).  

3. On en déduit un champ de gravitation, qu’on applique aux particules.  

4. On déplace les particules selon ce champ de gravitation.

5. On recommence et on boit du café en attendant que ça tourne.

Petit à petit, des structures apparaissent. Des filaments, des vides, des amas. Ça ressemble à l’univers réel, sauf que celui-ci tient dans quelques gigaoctets et ne nécessite pas de télescope spatial pour être exploré.

Bien sûr, la méthode a ses défauts. Elle est bruitée, sensible aux paramètres, et parfois les particules font n’importe quoi si on les néglige trop longtemps. Mais dans l’ensemble, c’est un outil assez élégant pour modéliser quelque chose d’aussi fondamentalement chaotique que l’univers. Et puis il faut bien l’avouer : faire apparaître des galaxies à partir d’une poignée d’équations et d’un fichier Python, ça a quelque chose de profondément satisfaisant.

---

## Références
- Birdsall & Langdon, *Plasma Physics via Computer Simulation*
- Hockney & Eastwood, *Computer Simulation Using Particles*
