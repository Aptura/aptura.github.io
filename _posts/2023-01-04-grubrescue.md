---
title: Rescue mode
author: Aptura 
date: 2023-01-04 16:34:00 +0800
categories: [Linux, Debian]
tags: [linux, debian, rescue, grub, maintenance mode]
img_path: /assets/img/
---

Voici un article rapide de la procédure pour mettre son Debian en mode maintenance de manière simple.

## GRUB Méthode 1

> Il est important de noter que cette méthode ne fonctionne pas en mode "sudo sans mot de passe" pour l'utilisateur.
{: .prompt-danger }

Pour commencer il suffit de démarrer sa machine et d'empêcher le processus du grub de lancer le démarrage automatique de l'option par défaut qui est notre Debian.

Un coup de flèche pour l'annuler et se positionner sur Debian.

Appuyer sur la touche `E` de votre clavier.

Ceci devrait apparaître sur l'écran (du moins quelque chose de similaire) :
![Image de l'édition de la séquence de démarrage](grubrescue.png)

Il suffira de rechercher la ligne commençant par `linux /vmlinuz-X.X.X-X-X ...` .

Cette ligne est terminée en théorie par le mot `quiet` qu'il suffira de remplacer par -->  `single` .
> Attention le clavier passe en QWERTY !!
{: .prompt-danger }

Une fois le remplacement fait, soit `ctrl + x` ou tout simplement la touche `F10` du clavier.

Après vos actions en mode maintenance, la séquence des touches
[ctrl] + [d] vous permettra de poursuivre vers le chargement vers la
cible « rescue.target »

---

## GRUB Méthode 2

> Attention il sera impossible de taper une commande `shutdown` et vous devrez obligatoirement arrêter la machine électriquement parlant !!
{: .prompt-danger }

Pour cette méthode, elle est à faire dans le cas ou il n'y a pas de mot de passe root.

Il suffit donc de suivre les mêmes étapes que la méthode 1, mais la différence est qu'il faudra remplacer `quiet` par --> `init=/bin/bash` cela lancera un shell bash.

Une fois le remplacement fait, soit `ctrl + x` ou tout simplement la touche `F10` du clavier.

Le système ayant redémarré, vous vous retrouvez sur un shell. Cependant, le disque racine est en lecture seule donc rien ne sera modifiable de cette façon.

Pour palier à ce problème taper la commande :

```shell
mount –o remount,rw /
```

> N'oubliez pas après toutes vos modifications de taper la commande `sync` afin de bien synchroniser les données écrites en RAM vers le disque.
{: .prompt-tip }

---

## La Méthode CDROM

Ici je ne détaillerais pas la procédure qui reste assez simple et qui consiste à passer par le CD d'installation (ou la clé USB avec l'iso debian monté) et d'aller dans les options avancées pour trouver le mode rescue.

---

Voilà, s'il y a des suggestions ou des modifications à apporter à cet article, n'hésitez pas à me le faire savoir !
