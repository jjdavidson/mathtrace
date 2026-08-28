# MathTrace

A buildless browser interface and file protocol for turning node-structured mathematical papers into interactive dependency graphs.

The interface repository contains the viewer and protocol documentation. MathTrace papers belong in a separate paper repository and are opened locally at runtime. Optional HTML, Canvas, CSS, classic JavaScript, and browser-module demonstrations travel with a paper beneath its `demos/` directory. Module dependencies may be vendored with the paper and imported by relative path, keeping the viewer buildless and the paper offline-capable.

## Documentation

- [`docs/mathtrace-philosophy.md`](docs/mathtrace-philosophy.md): the motivation for web-native papers, dependency-driven collaboration, granular verification, parallel refereeing, and mathematical canonization.
- [`docs/node-markdown-format.md`](docs/node-markdown-format.md): node schema, kinds, metadata, granularity, and examples.
- [`docs/mathtrace-paper-format.md`](docs/mathtrace-paper-format.md): the minimal paper manifest, paper-level prose, imported-node rule, and export.
- [`docs/authoring-and-conversion-guidelines.md`](docs/authoring-and-conversion-guidelines.md): native authoring and AI-assisted LaTeX conversion.
- [`docs/mathtrace-project-model.md`](docs/mathtrace-project-model.md): paper identity, workspace behavior, and self-contained imported nodes.

The same core guide is available from the interface's **Documentation** button.

Interface v55 adds paper removal to the cross-paper dependency graph. Each paper node has a red delete control, and MathTrace asks for confirmation while reporting whether the paper contains in-browser edits. Removing a paper affects only the current browser workspace and does not modify its source folder.

It retains v54's MathTrace welcome, project-philosophy documentation, compact metadata-badge example, and independent camera state for the cross-paper graph. Ordinary paper navigation restores the saved pan and zoom, while a new paper or changed cross-paper dependency rebuilds and fits the workspace. The minimal manifest, arXiv author links, and dashed imported nodes from v51 remain supported.

## Updating a release

Release archives are complete snapshots and should be extracted into their own versioned directory. Do not merge a new archive over an older extracted directory: archive extraction replaces files with matching names but does not delete node files retired by a newer version.

## License

Original MathTrace source code and documentation are licensed under the [MIT License](LICENSE).

Third-party libraries in [`viewer/vendor/`](viewer/vendor/) remain under their respective licenses. See [`viewer/vendor/README.md`](viewer/vendor/README.md) and the accompanying license files.

MathTrace papers are independent works and are not automatically covered by this repository's MIT License. Each paper repository should state its own licensing terms.
