# MathTrace

A buildless browser interface and file protocol for turning node-structured mathematical papers into interactive dependency graphs.

The interface repository contains the viewer and protocol documentation. MathTrace papers belong in a separate paper repository and are opened locally at runtime. Optional HTML, Canvas, CSS, classic JavaScript, and browser-module demonstrations travel with a paper beneath its `demos/` directory. Module dependencies may be vendored with the paper and imported by relative path, keeping the viewer buildless and the paper offline-capable.

## Documentation

- [`docs/node-markdown-format.md`](docs/node-markdown-format.md): node schema, kinds, metadata, granularity, and examples.
- [`docs/mathtrace-paper-format.md`](docs/mathtrace-paper-format.md): the paper manifest, metadata, prose, node discovery, layout, and export.
- [`docs/authoring-and-conversion-guidelines.md`](docs/authoring-and-conversion-guidelines.md): native authoring and AI-assisted LaTeX conversion.
- [`docs/mathtrace-project-model.md`](docs/mathtrace-project-model.md): paper identity, workspace behavior, and future cross-paper references.

The same core guide is available from the interface's **Documentation** button.

Interface v49 uses narrower graph nodes with room for three title lines and
assigns distinct, restrained colors to definitions, lemmas, propositions,
corollaries, theorems, and examples. Other mathematical node kinds remain
white.

## Updating a release

Release archives are complete snapshots and should be extracted into their own versioned directory. Do not merge a new archive over an older extracted directory: archive extraction replaces files with matching names but does not delete node files retired by a newer version.
