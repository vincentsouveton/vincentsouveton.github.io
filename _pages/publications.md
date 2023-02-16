---
layout: page
permalink: /publications/
title: publications
description: Publications in reversed chronological order. More info to come...
years: []
nav: true
nav_order: 1
---

### Preprints

<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
