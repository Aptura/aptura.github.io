---
title: Sécurité NTFS et les ACL sous windows
author: Aptura 
date: 2023-01-25 12:05:00 +0800
categories: [Windows, NTFS]
tags: [sécurité NTFS, NTFS, ACL, windows, permissions, administration windows, droit fichier]
img_path: /assets/img/windows/ntfs/
---

Voici un article sur la sécurité NTFS et les ACL (Access Control List) sous windows. C'est une notion qui semble assez difficile a cerner et à appliquer. Cet article me servira également de mémo personnel, étant beaucoup moins à l'aise sous windows.

## Définir les ACL

Sur un volume formaté en NTFS ( New Technology File System), tous les répertoires et tous les fichiers sont soumis à la sécurité NTFS, que l'on appelle ACL (Access Control List), ses dernières sont une sorte de bouclier attribué à chaque items sur windows (fichiers, dossiers ...). Cela ce traduit par des autorisations ou non, d'accès, modification, lecture ...

## Fonctionnement

Le fonctionnement est assez simple, quand vous souhaitez entrer dans un dossier, les ACL vont vous challenger, une popup s'affiche, contrôle grâce à un jeton d'accès si l'utilisateur qui souhaite entrer dans le dossier possède les droits.

Toutes les autorisations sont stockées dans l'index du système de fichier NTFS. Ces autorisations sont modifiables dans l'onglet sécurité (dans les propriété) d'un item.

![Exemple de l'onglet sécurité d'un dossier](onglet_sécurité.png)

La liste haute concerne les DACL (Liste de contrôle d'accès discrétionnaires). C'est une liste qui contient les autorisations concernant les groupes et les utilisateurs. C'est une manière simple de définir les accès à un groupe entier ou seulement à un utilisateur en particulier.

La deuxième liste correspond aux ACE (Access Control Entry) qui définit pour le groupe sélectionné les autorisations accordées. Cela est bien sûr modifiable.

Il est évident que la bonne pratique serait de ne mettre des autorisations / refus seulement à des groupes, il est plus simple de gérer les accès à des groupes d'utilisateur plutôt que de configurer les accès individuellement.

## Règles explicites

Ce système est assez déroutant la première fois, c'est une gymnastique mentale pour beaucoup !

Pour commencer, tous groupes non présent dans l'onglet sécurité et plus précisément dans la liste supérieure, les DACL, se verra de manière catégorique l'accès refusé à l'item, c'est un refus implicite. Si nous modifions donc les droits d'un groupe présent dans les DACL d'un item il n'y aura donc que deux solutions, une autorisation ou un refus.

Dans le cas d'un utilisateur qui ferait partie de plusieurs groupes, avec pour chacun de ses groupes des accès totalement contraire, la règle la plus permissive l'emporte. Cependant, un refus explicite l'emportera sur l'autorisation !

> Notez bien que cette notion est très importante à saisir, car dans contexte d'entreprise où nous retrouvons beaucoup d'employé, la gestion peut-être très difficile.
{: .prompt-warning}

## Le mécanisme d'héritage

Cela concerne les répertoires. En effet, lors de la création d'un dossier, les droits posé sur ce dossier serons automatiquement transmis à ses objets enfants. Dossier qui lui-même récupère ses droits en fonction de la partition (volume racine) où il est stocké.

Ses autorisations héritées apparaîtront grisées dans l'onglet sécurité et ne seront pas modifiables. Notez aussi qu'une autorisation d'accès l'emporte sur un refus explicite hérité !

La modification des autorisations sur les objets enfants seras possible seulement si nous "cassons" l'héritage.

Dans l'onglet sécurité du dossier :

![Dans l'onglet sécurité du dossier](désactiver_héritage.png)

## Déplacement ou copie de fichier et héritage

Voici un tableau pour comprendre comment se comporte l'héritage lors d'un déplacement ou d'une copie de fichier.

|            |Même volume / partition | Différent volumes / partitions |
|------------|------------------------|--------------------------------|
|Déplacement | Conservation           | Héritage                       |
|Copie       | Héritage               | Héritage                       |

## Les bonnes pratiques

Une rapide énumération des bonnes pratiques de bases concernant les autorisations et leurs gestions.

* Privilégier au maximum les groupes dans les DACL
* Utiliser au maximum les ACE de base
* Garder en tête les mécanismes d'héritage
* Privilégier l'héritage des droits
* Privilégier le refus implicite
* Tester ce que vous mettez en place

## Fin de la doc

Voilà donc un article qui tente d'expliquer les droits NTFS et leurs fonctionnements. Si vous avez des suggestions ou des remarques, n'hésitez pas à mettre un commentaire plus bas, c'est comme cela que le blog évoluera et moi par la même occasion !
