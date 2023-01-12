---
title: Partitionnement LVM - fdisk
author: Aptura 
date: 2023-01-06 13:45:00 +0800
categories: [Linux, Stockage]
tags: [linux, debian, lvm, paritionnement, fdisk, stockage, disque dur]
img_path: /assets/img/
---

Voici une doc rapide des principales actions à mettre en place pour effectuer un partitionnement LVM simple. C'est la façon moderne de procéder au partitionnement d'un disque dur sous linux. Tout ceci s'appuie sur ce que j'ai appris sous environnement Debian.

> Ici le fonctionnement de fdisk n'est pas abordé.
{: .prompt-warning}

## LVM en gros

Déjà LVM c'est l'acronyme de `Logical Volume Manager`.

- Un affranchissement des limites physiques des périphérique de stockage.
- Plusieurs types d'éléments sont ainsi géré.
  - PV (Physical Volume) : désignent les périphériques intégrés dans LVM
  - VG (Volume Group) : permettent de regrouper les PVs (Physical Volume)
  - LV (Logical Volume) : ce sont les unités définies au sein des VGs (Volume Group)  

La création d’un ou plusieurs groupes de volumes sera faite à
partir des volumes physiques (partitions) disponibles.
Les groupes de volumes seront ensuite découpés en volumes
logiques.

Ces volumes logiques pourront alors être utilisés comme n'importe
quel volume de stockage

Voici un shema d'un LVM théorique et la répartition de chaques éléments :

![VG prenant les 2 PV sdb1 et sdc1 ainsi que les LV root, home, var contenue dans le VG nommé "VG-System"](shemalvm.png)

## Les commandes de gestion LVM

Tout est articulé autours des commandes suivante avec leurs variantes les plus communes, les voici :

- `pvcreate`, `pvdisplay`, `pvextend`, `pvreduce`, `pvremove` ...
- `vgcreate`, `vgdisplay`, `vgextend`, `vgreduce`, `vgremove` ...
- `lvcreate`, `lvdisplay`, `lvextend`, `lvreduce`, `lvremove` ...

## Créer des LVM

Un fois le nouveau disque mis en place et avec une partition grâce a fdisk il suffira de procéder comme suit ci-dessous :

### Etape 1 - pvcreate

Vous aurez besoin de créer des PVs (Physical Volume). Pour cela vous aurez besoin de savoir quel disque sont concerné par la manipulation. Une fois ceci fait, vous procéderer grâce à `pvcreate` à leurs créations.

Dans nôtre exemple nous aurons 4 PV à créer.

```shell
pvcreate /dev/sdb1 /dev/sdb2 /dev/sdc1 /dev/sdd
```

Ce qui en image représente ceci :

![Création des 4 PV](shemalvm2.png)

### Etape 2 - vgcreate

Maintenant que nos PVs sont créer, nous avons besoin de les grouper en fonction de ce dont vous avez besoin, dans nôtre cas, nous allons grouper `sdb1`, `sdb2` et `sdc1` dans un même VG qui sera nommé `vggroup1`.

```shell
vgcreate vggroup1 /dev/sdb1 /dev/sdb2 /dev/sdc1
```

Résultat :

![Groupement des PV dans un VG nommé "vggroup1"](shemalvm3.png)

### Etape 3 - lvcreate

Voila nôtre VG a été créer. Il est maintenant temps de le peupler avec des LVs (Logical Volume) toujours en fonction des besoin, pour nous ce sera 2 LVs nommé respectivement `lv1` et `lv2`.

```shell
lvcreate -n lv1 -L 10G vggroup1 && lvcreate -n lv2 -L 5G vggroup1
```

Ce qui répresente ceci en image :

![LV 1 et 2 créer dans le VG "vggroup1"](shemalvm4.png)

`-n` sert à spécifier le nom du volume logique.

`-L` sert à indiquer la taille souhaité pour le volume logique.

Il est bien sûr possible qu'il reste de l'espace libre pour créer d'autres LV ou étendre un LV existant.

Il y aura deux chemins possibles pour manipuler le Volume Logique :

- `/dev/vggroup1/lv1` ou lv2 pour le deuxième.
- `/dev/mapper/vggroup1-lv1` ou lv2 pour le deuxième.

## Modification des LVM

### Etendre des LVs

Pour cela c'est la commande `lvextend` qui nous servira. Nous utiliserons les même noms que dans la partie création.

```shell
lvextend -r -L +512M /dev/vggroup1/lv1 && lvextend -r -L 1G /dev/vggroup1/lv2
```

Vous noterez surement une particularité. pour `lv1` c'est `+`512M mais pas pour `lv2` qui sera sans le `+`.
La différence est simple, quand il s'agit d'étendre ce sera avec un `+` devant la taille souhaité. A l'inverse si nous ne mettons pas de `+` cela indique le souhait d'avoir un LV strictement a 1G.

`-r` sert a invoquer automatiquement resize2fs

`-L` sert encore une fois à indiquer la taille souhaité.

Résumons encore par une image :

![Extension de lv1 et lv2](shemalvm5.png)

### Réduire

Ce sous-chapitre sera très court, c'est la même procédure que l'extension mais avec la commande `lvreduce`.

> Attention, le système de fichier ne prendra pas en compte automatiquement ces changements. Il faudra forcer un redimensionnement pour pouvoir utiliser tout l'espace.
{: .prompt-danger}

### Afficher des informations LVM

Sous-chapitre aussi très court car les commandes sont très simple à utiliser.

Informations résumées :

- `pvs`
- `vgs`
- `lvs`

Informations détaillées :

- `pvdisplay`
- `vgdisplay`
- `lvdisplay`

## Fin de la doc

Voila, bien sûr je ne rentre pas dans le détails car ce n'est pas dans mon intérêt, vous trouverez ici les bases du partitionnement LVM mais je ne vais pas tout détailler car l'article serait très long, je vous invite cependant à faire marcher vôtre curiosité et à explorer le web pour comprendre plus en profondeur.

Si vous avez des suggestions ou des modifications à apporter à cet article, n'hésitez pas à me le faire savoir !
