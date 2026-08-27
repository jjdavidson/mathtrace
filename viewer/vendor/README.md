# Vendored browser libraries

`js-yaml.min.js` is the browser build of `js-yaml` 5.2.3.
It is distributed under the MIT License; see `js-yaml-LICENSE.txt`.

The file is stored locally so that MathTrace can parse YAML without a CDN, Node.js, npm, or a build step at runtime.

`elk.bundled.js` is the browser build of `elkjs` 0.12.0.
It is distributed under the Eclipse Public License 2.0 or GPL 3.0 or later; see `elkjs-LICENSE.md`.
MathTrace uses it only to calculate the layered positions and routed edges of the dependency graph.

`markdown-it.min.js` is the browser build of `markdown-it` 14.1.0.
It is distributed under the MIT License; see `markdown-it-LICENSE.txt`.
MathTrace uses it to render node bodies with raw HTML disabled.

`mathjax-tex-svg.js` is the combined TeX-to-SVG browser component from MathJax 3.2.2.
It is distributed under the Apache License 2.0; see `mathjax-LICENSE.txt`.
MathTrace stores the combined component locally so mathematical notation renders without an internet connection.
