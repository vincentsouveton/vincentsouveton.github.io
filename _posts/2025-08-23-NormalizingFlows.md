---
layout: post
title: Ma vie est un long flot tranquille
date: 2025-01-01
description: comment générer des hiboux à partir d'une Gaussienne
tags:
categories:
---

Si une matinale radio avait la décence de m’inviter un jour, je parlerais probablement de **modèles de flots normalisants**. Il ne serait point question de crise énergétique ou d’extinction de l’humanité par l’IA. Juste de hiboux, de formule de changement de variable et de GPUs. Ce serait un grand moment de radio.

## Les modèles génératifs appliqués aux oiseaux nocturnes

Un **modèle génératif**, c’est une machine à produire des choses qu’on n’a pas encore vues mais qui *ressemblent* beaucoup à ce qu’on a déjà. On en voit partout : des visages générés, des voix clonées, des poèmes médiocres, et bien sûr… des chats. Mais parlons franchement : les chats ont pris trop de place dans l’écosystème des données. Ils sont surfaits, égocentriques, et parfaitement prévisibles.

Parlons plutôt des majestueux **hiboux**, maîtres du ciel nocturne. Imaginons donc un ensemble d’images de hiboux. Chaque image est un **échantillon** tiré selon une mystérieuse **distribution de probabilité** censée représenter tous les hiboux du monde. Et c'est sur cet ensemble d'échantillons que nous allons entraîner notre modèle génératif.

Notre objectif ? Apprendre à générer *de nouvelles images de hiboux*. Pas des copies, des créations inédites. Comme un oracle, mais avec des cartes graphiques assez puissantes (les fameuses GPUs, si chères aux ami-es gamers, si chères tout court d'ailleurs. Au vu des commandes grandissantes, il conviendrait de se demander s'il n'y a pas un vaste système de contournement de l'utilisation des GPUs dans les labos d'IA pour jouer à Call of Duty sous prétexte de recherche scientifique).

## Les flots normalisants : du bruit vers les hiboux

Le principe des **flots normalisants** (ou *normalizing flows*, pour les bilingues contrariés) est le suivant :  
On part d’une distribution de probabilité simple (par exemple une bonne vieille Gaussienne) $p_Z$ et on la transforme progressivement pour qu’elle ressemble à notre **distribution des hiboux** $p$. Ce qui donne, dans un moment de poésie mathématique :

<p>
$$
\log p_X(x) = \log p_Z(f(x)) + \log \left| \det \left( \\rac{\partial f}{\partial x} \right) \right|
$$
</p>

- $x$ est une image de hibou ;
- $p_X$ est la distribution de probabilité de notre modèle (idéalement, s'il est bien entraîné, elle doit être presque égale à la distribution cible $p$
- $f$ est la fonction qui transforme notre image en bruit (et inversement).  
- Le déterminant du jacobien de $f$ est là pour faire peur aux littéraires (en vrai, c'est lui qui mesure à quel point la transformation déforme l’espace).

L'entraînement, c’est simple : on prend une belle image de hibou et on lui applique une suite de transformations soigneusement choisies pour la transformer en notre Gaussienne, aussi appelée **bruit pur** car dans le cas d'une image, une Gaussienne ressemble à ce qu’on voit sur une télé des années 90 quand l’antenne est mal orientée. L’idée est que si on sait comment détruire (métaphoriquement, hein !) un hibou avec assez d’élégance, on saura faire le chemin inverse.

Et effectivement : une fois entraîné, on peut prendre du bruit pur, lui appliquer la transformation **inverse**, et obtenir une toute nouvelle image de hibou.

## La vraie beauté, c’est l’inversibilité (et les jacobiens pas trop compliqués)

Pour que tout cela fonctionne, les transformations qu’on utilise doivent satisfaire quelques critères techniques mais vitaux :

- Être **bijectives** (on peut revenir en arrière sans tout casser)  
- Être **différentiables** (sinon, l’optimiseur pleure)  
- Avoir un **jacobien** facile à calculer (parce qu’on a autre chose à faire de nos vies)

Heureusement, des gens extrêmement intelligents ont inventé plein de constructions techniques pour faire ça : RealNVP, Glow, MAF, et autres acronymes qui sonnent comme des noms de virus inquiétants.

Personnellement, je m’intéresse à des **transformations hamiltoniennes** qui viennent de la mécanique classique. Elles préservent le volume en espace de phase, ce qui veut dire que le déterminant jacobien est égal à 1, donc on ne peut plus facile à calculer, et qu'elles offrent une belle interprétabilité physique. Autrement dit, au lieu de triturer nos données au hasard, on les fait évoluer selon des lois inspirées des systèmes dynamiques classiques, les mêmes lois qui font tomber la pomme sur la tête de Newton. Et si ça semble inutile, c’est probablement qu’on est sur la bonne voie.


## En conclusion

Les flots normalisants, c’est donc fait pour générer des hiboux à partir d'une télé mal réglée. Et si une radio me tendait un micro un matin à 7h45, entre deux pubs pour du café soluble et un jingle sur l’emploi des seniors, je crois que je dirais que c'est chouette.

---

## Références

- George Papamakarios, Eric Nalisnick, Danilo Jimenez Rezende, Shakir Mohamed, and Balaji Lakshminarayanan. 2021. Normalizing flows for probabilistic modeling and inference. J. Mach. Learn. Res. 22, 1, Article 57 (January 2021), 64 pages.
- Peter Toth, Danilo J. Rezende, Andrew Jaegle, Sébastien Racanière, Aleksandar Botev, Irina Higgins. Hamiltonian Generative Networks. In 8th International Conference on Learning Representations, ICLR 2020, Addis Ababa, Ethiopia, April 26-30, 2020.
