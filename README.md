# vincentsouveton.github.io

Personal academic website of Vincent Souveton, served by GitHub Pages at
<https://vincentsouveton.github.io>.

It is a plain [Jekyll](https://jekyllrb.com/) site with **no plugins and no
build step of your own**: push to `main` and GitHub builds and publishes it.
Most of the content lives in small YAML files, so updating the site rarely
means touching HTML.

---

## Features

- **Six pages**: Home, Publications, Code, Notes, CV, Teaching.
- **Light / dark mode.** The site follows the visitor's system setting; the
  button in the header switches it, and the choice is remembered.
- **Pixel-art portrait**, also used as the header logo and the browser-tab icon.
- **Notes with LaTeX** (rendered by MathJax), numbered citations and an
  automatic reference list at the end of each note.
- **Content in data files**: publications, repositories, CV and teaching are
  YAML lists; the pages are generated from them.
- **E-mail protected from bots.** The address never appears in the generated
  pages; the *Email* button rebuilds it when clicked and copies it.
- **Responsive**: works on phones (the menu scrolls sideways).
- **Old links kept**: `/publications.html` and `/teaching.html` keep their
  URLs, and the old `/blog.html` redirects to Notes.

---

## Where things are

| To change…                       | Edit                                         |
|----------------------------------|----------------------------------------------|
| Name, position, links, e-mail, menu, footer | `_config.yml`                     |
| Home page text and interests     | `index.md`                                   |
| Publications                     | `_data/publications.yml`                     |
| Repositories on the Code page    | `_data/repos.yml`                            |
| CV (timeline, talks, outreach, skills) | `_data/cv.yml`                         |
| Teaching (courses, tables of PDFs) | `_data/teaching.yml` + PDFs in `assets/cours/` |
| Notes                            | one Markdown file per note in `_notes/`      |
| Colours, fonts, spacing          | `assets/css/main.css` (section 1 at the top) |
| Portrait, logo, favicon          | `assets/img/`                                |
| Page intro lines (grey text under titles) | the `intro:` line at the top of `publications.html`, `code.html`, … |

You should rarely need these, but for reference:

```
_layouts/   default.html (page shell), page.html, home.html, note.html
_includes/  head.html, header.html, footer.html, mathjax.html
assets/js/site.js   theme button + e-mail button
404.html, blog.html (redirect)
```

---

## Common tasks

### Add a publication
Add an entry at the top of `_data/publications.yml` (most recent first):

```yaml
- year: 2027
  type: Journal            # Preprint, Journal, Conference, Workshop, Thesis…
  title: "Title of the paper"
  authors: "A. Coauthor, V. Souveton"   # your name is bolded automatically
  venue: "Journal name, volume:pages"
  links:                   # optional, as many as you like
    - label: arXiv
      url: https://arxiv.org/abs/xxxx.xxxxx
    - label: Code
      url: https://github.com/vincentsouveton/xxx
```

### Add a repository to the Code page
Add an entry to `_data/repos.yml` with `name`, `url` and `description`.

### Write a new note
Create a file in `_notes/`, for example `_notes/my-new-note.md`. The file
name becomes the URL (`/notes/my-new-note/`).

```markdown
---
title: My new note
date: 2026-11-08
tags: [neural operators, Maxwell]
summary: One or two sentences shown in the list of notes and under the title.
references:
  - authors: A. Author, B. Author
    title: Title of the cited paper
    venue: Journal, 2024
    links: [{ label: "arXiv:xxxx.xxxxx", url: "https://arxiv.org/abs/xxxx.xxxxx" }]
---

## 1. First section

Text with inline math $$\nabla \cdot \mathbf{B} = 0$$ and a citation [[1]](#ref-1){:.cite}.

$$
\nabla \times \mathbf{E} = -\partial_t \mathbf{B}
$$
```

The notes are listed automatically on the Notes page, newest first. A note
whose `date` is in the future stays hidden until that day.

**Citations.** References are numbered in the order of the `references:` list.
Cite the *n*-th one with `[[n]](#ref-n){:.cite}`; clicking it scrolls to the
reference, which is highlighted.

**Writing math.** Write LaTeX between **double dollars** `$$ … $$`:

- inside a sentence, it is inline math: `the density $$p_Z$$ is …`
- on its own lines, with a blank line before and after, it is a displayed
  equation; `aligned`, `\\` and `&` work as in LaTeX.

Single dollars `$x$` also work for simple expressions, but Markdown may eat
backslashes in front of punctuation (`\{`, `\\`, `\,`), so prefer `$$` as soon
as an expression has more than letters and indices. Equations wider than the
column scroll sideways on phones.

**Other Markdown.** `*italic*`, `**bold**`, `> quote` (styled as a gold-ruled
quotation), fenced code blocks with ` ```python `, and numbered lists
(add `{:.steps}` on the line right after a list for the grey-number style).

### Update the CV
Edit `_data/cv.yml`. Each timeline entry has `when`, `title`, `kind`, `org`
and a list of `items`; set `current: true` on the present position to get the
gold marker. Text fields accept Markdown, including links.

### Add teaching documents
Put the PDF in `assets/cours/<folder>/`, then add a link in
`_data/teaching.yml`:

```yaml
- { label: Sheet 5, file: maths2/MathsS2_2425_TD5.pdf }
```

A course without a table (like *Machine Learning*) only needs `title`,
`status` and `topics`. The comments at the top of the file describe all
options.

### Change the portrait / logo / favicon
`assets/img/avatar.svg` is used everywhere (home page, header logo, browser
tab). Replace it with any square image and keep the name, or change the path
in `_layouts/home.html`, `_includes/header.html` and `_includes/head.html`.
`avatar-40.png` is the same drawing at its true 40×40 size, handy for editing
in a pixel-art editor (Piskel, Aseprite…). The PNG icons
(`favicon-32.png`, `apple-touch-icon.png`, `avatar-512.png` used for link
previews) are exports of it.

### Change colours or fonts
Everything is in the first section of `assets/css/main.css`. The light
palette is in `:root`; the dark palette is written twice (system setting and
button), so change both blocks. Fonts come from Google Fonts (Geist, Geist
Mono, Source Serif 4); the `<link>` is in `_includes/head.html`.

### Change the menu
The `navigation:` list in `_config.yml` sets the order and labels.

---

## Preview on your computer (optional)

You need Ruby. Then, once:

```bash
bundle install
```

and every time:

```bash
bundle exec jekyll serve
```

Open <http://localhost:4000>. The site is rebuilt each time you save a file
(refresh the browser to see it), except `_config.yml`, which needs a restart. The `Gemfile` pins the same versions
as GitHub Pages, so what you see is what will be published.

## Publish

Commit and push to the `main` branch. In the repository settings, *Pages*
should be set to **Deploy from a branch**, branch `main`, folder `/ (root)`.
The build takes about a minute; its status (and any error message) is in the
**Actions** tab, under *pages build and deployment*.

**If a build fails**, it is almost always YAML: check the indentation (spaces,
not tabs) and put text containing `:` or `"` between quotes.

---

Site design assisted by AI (Claude, Anthropic).
