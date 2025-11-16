---
layout: post
title: Piéger Shakespeare sur une GPU
date: 2025-11-16
description: Transformer model
tags:
categories:
---


Depuis toujours, les humains rêvent de comprendre les grands génies littéraires, un verre de vin et beaucoup de condescendence à la main. Mais au XXIᵉ siècle, au lieu de lire *Hamlet*, [quelqu'un]( https://github.com/karpathy/ng-video-lecture) a eu l’idée beaucoup plus efficace de dire : "Et si on compressait Shakespeare dans quelques millions de paramètres et qu’on le faisait tourner sur une carte graphique ?" Le pire, c’est que ça marche. Grâce aux Transformers, ces architectures à la base des grands modèles de langage (LLMs), nous savons aujourd’hui stocker l’essence stylistique d’un dramaturge du XVIᵉ siècle dans une matrice géante de nombres flottants. Le futur est décidément surprenant.

Un Transformer (dans sa version *decoder-only*, celle-là même utilisée par les LLMs modernes) est un modèle auto-régressif, ce qui signifie qu'il reçoit une séquence de mots (plus précisément appelés tokens), qu'il tente de prédire le prochain et qu'il recommence. Cette idée, incroyablement, suffit pour écrire des sonnets entiers. Chaque bloc du Transformer contient une succession de deux choses :

1. **Self-attention** : le mécanisme qui permet au modèle de décider quels mots passés sont utiles pour prédire le prochain.

2. **Un réseau feed-forward (FFN)** : un petit réseau qui transforme les sorties provenant du mécanisme d'attention en des vecteurs légèrement meilleurs.

Empilez quelques blocs, et vous obtenez une fidèle représentation de Shakespeare gravée dans du silicium.

Le mot *attention* semble intimidant. Mais sa version mathématique est en réalité un cocktail de multiplications de matrices. Rafraîchissant. Pour chaque token, on calcule, à l'aide de matrices apprises par le réseau, une *requête Q* (ce que le token cherche), une *clé K* (ce que le token a) et une *valeur V* (ce que le token communique s'il est interrogé). On applique ensuite une formule qui n'a rien de magique :

<p>$$
\text{Attention}(Q, K, V)
= \text{softmax}\!\left( \frac{QK^\top}{\sqrt{d_k}} \right)V
$$</p>

Cela nous dit juste que si la requête d'un token est alignée avec la clé d'un autre, alors les deux compères vont avoir fortement envie de communiquer. Voilà. Pas d’intégrale. Pas de théorème incompréhensible. Juste des multiplications matricielles. Une personne raisonnable pourrait faire ça sur une feuille de papier (mais pas Shakespeare, qui était mauvais en algèbre, d'où probablement son orientation dans une filière littéraire).

Puisque c'était trop simple, les chercheurs ont décidé de faire plusieurs attentions en parallèle. C’est le concept de *multi-head attention* où chaque tête apprend à regarder l’histoire différemment et de manière automatique (l’une va peut-être se concentrer sur les verbes, l’autre sur les rimes, une autre encore sur des détails dramatiquement importants). On concatène les attentions provenant des différentes têtes, et c'est tout.

Contrairement aux anciens réseaux récurrents, qui lisaient les textes comme quelqu’un qui ne peut tourner la page qu’après avoir fini la précédente, les Transformers sont **massivement parallélisables** puisque tous les tokens d’une séquence peuvent être traités en même temps et que toutes les têtes d’attention fonctionnent en parallèle. Ainsi, l'entraînement est beaucoup plus efficace. Pour apprendre, d'ailleur, le modèle lit tout Shakespeare, mot après mot, et doit prédire le suivant.  
Chaque fois qu’il se trompe, on le punit gentiment grâce à une fonction de perte appelée **cross-entropy** :

<p>$$
\mathcal{L}
= - \sum_t \log p_\theta(x_t \mid x_{<t})
$$</p>

Cette quantité mesure à quel point le modèle raconte des bêtises. Et à force de corriger ses erreurs, il finit par réciter des sonnets plutôt convaincants. Une fois entraîné, on lui donne un début de phrase, et le modèle calcule la probabilité que chaque mot du dictionnaire soit le prochain mot de la phrase. Il pioche alors au hasard selon cette distribution de probabilité et recommence le processus, avec cette fois pour entrée le début de phrase et le nouveau mot qui vient d'y être ajouté. Le résultat est que nous avons réussi à compresser l'essence même de Shakespeare en quelques millions de paramètres, et que nous pouvons le forcer à parler sur une GPU. Merci la science.

Fin du billet. Rideau. Applaudissements.


---

## Références
- Vaswani et al., *Attention is All You Need*, NeurIPS, 2017
- Vidéo YouTube : [Let's build GPT: from scratch, in code, spelled out.](https://www.youtube.com/watch?v=kCc8FmEb1nY)
