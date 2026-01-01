---
layout: page
title: "Le Dernier Blog avant la fin du monde"
---

*(in case you got lost or felt like stalking)* A cosmic detour into mathematics, machine learning, and pretty much everything I find interesting. Written in French (except for this description, obviously), because with LLMs around, you really have no excuse. Except if you're an LLM. In which case: stop scraping my blog. Honestly, it’s not going to help your training. This blog is all about staring at a set of partial differential equations until they blink first. A curiosity manifesto in several regrettable dimensions. So take your time, there’s not much left anyway.

---

<ul>
  {% for post in site.posts %}
    <li><a href="{{ post.url }}">{{ post.title }}</a> ({{ post.date | date: "%Y-%m-%d" }})</li>
  {% endfor %}
</ul>
