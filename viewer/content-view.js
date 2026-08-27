(function createMathTraceContentView(globalScope) {
  "use strict";

  const markdownFactory = globalScope.markdownit;

  if (!markdownFactory) {
    throw new Error("MathTrace could not start because the Markdown reader was not loaded.");
  }

  let renderRevision = 0;
  const textDecoder = new TextDecoder();
  const readerResources = new WeakMap();
  const mimeTypes = Object.freeze({
    ".avif": "image/avif",
    ".css": "text/css",
    ".gif": "image/gif",
    ".html": "text/html",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript",
    ".json": "application/json",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".mjs": "text/javascript",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
    ".webm": "video/webm",
    ".webp": "image/webp",
  });

  function closingDelimiterPosition(source, start, delimiter) {
    let position = source.indexOf(delimiter, start);

    while (position !== -1) {
      let precedingBackslashes = 0;

      for (let index = position - 1; index >= 0 && source[index] === "\\"; index -= 1) {
        precedingBackslashes += 1;
      }

      if (precedingBackslashes % 2 === 0) {
        return position;
      }

      position = source.indexOf(delimiter, position + delimiter.length);
    }

    return -1;
  }

  function mathDelimiterAt(source, position) {
    if (source.startsWith("\\[", position)) {
      return { opening: "\\[", closing: "\\]" };
    }

    if (source.startsWith("\\(", position)) {
      return { opening: "\\(", closing: "\\)" };
    }

    if (source.startsWith("$$", position)) {
      return { opening: "$$", closing: "$$" };
    }

    if (source[position] === "$") {
      return { opening: "$", closing: "$" };
    }

    return null;
  }

  function installMathRule(markdown) {
    markdown.inline.ruler.before("text", "mathtrace_math", (state, silent) => {
      const delimiter = mathDelimiterAt(state.src, state.pos);

      if (!delimiter) {
        return false;
      }

      const contentStart = state.pos + delimiter.opening.length;
      const closingPosition = closingDelimiterPosition(state.src, contentStart, delimiter.closing);

      if (closingPosition === -1 || closingPosition === contentStart) {
        return false;
      }

      if (!silent) {
        const token = state.push("mathtrace_math", "math", 0);
        token.content = state.src.slice(
          state.pos,
          closingPosition + delimiter.closing.length,
        );
      }

      state.pos = closingPosition + delimiter.closing.length;
      return true;
    });

    markdown.renderer.rules.mathtrace_math = (tokens, index) => (
      markdown.utils.escapeHtml(tokens[index].content)
    );
  }

  function installMathBlockRule(markdown) {
    markdown.block.ruler.before("fence", "mathtrace_math_block", (
      state,
      startLine,
      endLine,
      silent,
    ) => {
      const openingStart = state.bMarks[startLine] + state.tShift[startLine];
      const openingEnd = state.eMarks[startLine];
      const opening = state.src.slice(openingStart, openingEnd).trim();
      const closing = opening === "\\["
        ? "\\]"
        : opening === "$$"
          ? "$$"
          : null;

      if (!closing) {
        return false;
      }

      let closingLine = startLine + 1;

      while (closingLine < endLine) {
        const lineStart = state.bMarks[closingLine] + state.tShift[closingLine];
        const lineEnd = state.eMarks[closingLine];

        if (state.src.slice(lineStart, lineEnd).trim() === closing) {
          if (silent) {
            return true;
          }

          const token = state.push("mathtrace_math_block", "math", 0);
          token.block = true;
          token.content = state.src.slice(openingStart, lineEnd);
          token.map = [startLine, closingLine + 1];
          token.markup = opening;
          state.line = closingLine + 1;
          return true;
        }

        closingLine += 1;
      }

      return false;
    }, {
      alt: ["paragraph", "reference", "blockquote", "list"],
    });

    markdown.renderer.rules.mathtrace_math_block = (tokens, index) => (
      `<div class="mathtrace-math-block">${markdown.utils.escapeHtml(tokens[index].content)}</div>\n`
    );
  }

  function installWikiLinkRule(markdown) {
    markdown.inline.ruler.before("link", "mathtrace_wiki_link", (state, silent) => {
      if (!state.src.startsWith("[[", state.pos)) {
        return false;
      }

      const closingPosition = state.src.indexOf("]]", state.pos + 2);

      if (closingPosition === -1) {
        return false;
      }

      const linkText = state.src.slice(state.pos + 2, closingPosition);
      const separatorPosition = linkText.indexOf("|");
      const nodeId = (separatorPosition === -1 ? linkText : linkText.slice(0, separatorPosition)).trim();

      if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(nodeId)) {
        return false;
      }

      if (!silent) {
        const nodeRecord = state.env.nodeTitleById?.get(nodeId);
        const nodeTitle = typeof nodeRecord === "string"
          ? nodeRecord
          : nodeRecord?.title;
        const explicitLabel = separatorPosition === -1 ? "" : linkText.slice(separatorPosition + 1).trim();
        const label = explicitLabel || nodeTitle || nodeId;
        const opening = state.push("link_open", "a", 1);
        opening.attrSet("href", `#node=${encodeURIComponent(nodeId)}`);
        opening.attrSet("data-node-link", nodeId);
        opening.attrSet("title", `Preview ${nodeTitle || nodeId}`);
        const text = state.push("text", "", 0);
        text.content = label;
        state.push("link_close", "a", -1);
      }

      state.pos = closingPosition + 2;
      return true;
    });
  }

  function installExternalLinkRule(markdown) {
    const defaultLinkOpen = markdown.renderer.rules.link_open
      || ((tokens, index, options, environment, renderer) => (
        renderer.renderToken(tokens, index, options)
      ));

    markdown.renderer.rules.link_open = (tokens, index, options, environment, renderer) => {
      const href = tokens[index].attrGet("href") || "";

      if (/^https?:\/\//i.test(href)) {
        tokens[index].attrSet("target", "_blank");
        tokens[index].attrSet("rel", "noopener noreferrer");
      }

      return defaultLinkOpen(tokens, index, options, environment, renderer);
    };
  }

  const markdown = markdownFactory({
    html: true,
    linkify: true,
    typographer: false,
  });
  installMathBlockRule(markdown);
  installMathRule(markdown);
  installWikiLinkRule(markdown);
  installExternalLinkRule(markdown);

  function normalizeNodeBody(body) {
    const normalized = String(body || "").replace(/\r\n?/g, "\n").replace(/^\s+/, "");
    return normalized.replace(/^#\s+Main Content\s*(?:\n+|$)/i, "");
  }

  function markdownToHtml(body, nodeTitleById = new Map()) {
    return markdown.render(normalizeNodeBody(body), { nodeTitleById });
  }

  function normalizeDemoPath(value) {
    const path = String(value || "")
      .trim()
      .replaceAll("\\", "/")
      .replace(/^\.\//, "")
      .replace(/^\/+/, "")
      .split(/[?#]/, 1)[0];

    if (!path || path.split("/").some((part) => !part || part === "." || part === "..")) {
      return null;
    }

    return path;
  }

  function demoFileMap(demoFiles) {
    return new Map((demoFiles || []).map((file) => [normalizeDemoPath(file.path), file]));
  }

  function fileBytes(file) {
    if (file.bytes instanceof Uint8Array) {
      return file.bytes;
    }

    if (file.bytes instanceof ArrayBuffer) {
      return new Uint8Array(file.bytes);
    }

    return new Uint8Array(file.bytes || []);
  }

  function mimeTypeFor(file) {
    if (file.type && file.type !== "application/octet-stream") {
      return file.type;
    }

    const path = String(file.path || "").toLowerCase();
    const extension = Object.keys(mimeTypes).find((candidate) => path.endsWith(candidate));
    return extension ? mimeTypes[extension] : "application/octet-stream";
  }

  function clearReaderResources(reader) {
    const resources = readerResources.get(reader);

    if (resources) {
      resources.objectUrls.forEach((url) => URL.revokeObjectURL(url));
      readerResources.delete(reader);
    }
  }

  function rememberObjectUrl(reader, file) {
    let resources = readerResources.get(reader);

    if (!resources) {
      resources = { objectUrls: [] };
      readerResources.set(reader, resources);
    }

    const url = URL.createObjectURL(new Blob([fileBytes(file)], { type: mimeTypeFor(file) }));
    resources.objectUrls.push(url);
    return url;
  }

  function rememberGeneratedObjectUrl(reader, parts, type) {
    let resources = readerResources.get(reader);

    if (!resources) {
      resources = { objectUrls: [] };
      readerResources.set(reader, resources);
    }

    const url = URL.createObjectURL(new Blob(parts, { type }));
    resources.objectUrls.push(url);
    return url;
  }

  function appendDemoError(content, message) {
    const error = document.createElement("p");
    error.className = "mathtrace-demo-error";
    error.setAttribute("role", "status");
    error.textContent = message;
    content.append(error);
  }

  function localDemoFile(reference, filesByPath) {
    const path = normalizeDemoPath(reference);
    return path ? filesByPath.get(path) || null : null;
  }

  function isExternalReference(reference) {
    return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(String(reference || "").trim());
  }

  function prepareTrustedResources({ reader, content, demoFiles }) {
    const filesByPath = demoFileMap(demoFiles);

    content.querySelectorAll('link[rel~="stylesheet"][href]').forEach((link) => {
      const reference = link.getAttribute("href");
      const file = localDemoFile(reference, filesByPath);

      if (file) {
        const style = document.createElement("style");
        style.dataset.mathtraceSource = file.path;
        style.textContent = textDecoder.decode(fileBytes(file));
        link.replaceWith(style);
      } else if (!isExternalReference(reference)) {
        link.remove();
        appendDemoError(content, `The demonstration stylesheet ${reference} was not found.`);
      }
    });

    const resourceAttributes = [
      ["img[src], audio[src], video[src], source[src], track[src], iframe[src]", "src"],
      ["video[poster]", "poster"],
      ["object[data]", "data"],
      ["a[download][href]", "href"],
    ];

    for (const [selector, attribute] of resourceAttributes) {
      content.querySelectorAll(selector).forEach((element) => {
        const reference = element.getAttribute(attribute);
        const file = localDemoFile(reference, filesByPath);

        if (file) {
          element.setAttribute(attribute, rememberObjectUrl(reader, file));
        } else if (String(reference || "").startsWith("demos/") && !isExternalReference(reference)) {
          element.removeAttribute(attribute);
          appendDemoError(content, `The demonstration asset ${reference} was not found.`);
        }
      });
    }

    return filesByPath;
  }

  async function runExternalScript(script, original, source) {
    await new Promise((resolve, reject) => {
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => reject(new Error(`Could not load ${source}.`)), { once: true });
      original.replaceWith(script);
    });
  }

  function resolveModulePath(specifier, importerPath) {
    const reference = String(specifier || "").trim();

    if (isExternalReference(reference)) {
      return null;
    }

    if (!reference.startsWith(".") && !reference.startsWith("/")) {
      throw new Error(
        `The module ${importerPath} uses the bare import ${reference}. `
        + "Use a relative path to a vendored file beneath demos/.",
      );
    }

    const importerParts = importerPath.split("/");
    importerParts.pop();
    const referenceParts = reference.startsWith("/")
      ? reference.slice(1).split("/")
      : reference.split("/");
    const parts = reference.startsWith("/") ? [] : importerParts;

    for (const part of referenceParts) {
      if (!part || part === ".") {
        continue;
      }

      if (part === "..") {
        parts.pop();
      } else {
        parts.push(part);
      }
    }

    const resolved = normalizeDemoPath(parts.join("/"));

    if (!resolved || !resolved.startsWith("demos/")) {
      throw new Error(`The module import ${reference} leaves the paper's demos/ directory.`);
    }

    return resolved;
  }

  function javascriptCodePositions(source) {
    const positions = new Uint8Array(source.length);
    let state = "code";
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
      const character = source[index];
      const nextCharacter = source[index + 1];

      if (state === "line-comment") {
        if (character === "\n" || character === "\r") {
          state = "code";
          positions[index] = 1;
        }

        continue;
      }

      if (state === "block-comment") {
        if (character === "*" && nextCharacter === "/") {
          index += 1;
          state = "code";
        }

        continue;
      }

      if (["single-quote", "double-quote", "template"].includes(state)) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (character === "\\") {
          escaped = true;
          continue;
        }

        if (
          (state === "single-quote" && character === "'")
          || (state === "double-quote" && character === '"')
          || (state === "template" && character === "`")
        ) {
          state = "code";
        }

        continue;
      }

      positions[index] = 1;

      if (character === "/" && nextCharacter === "/") {
        positions[index] = 0;
        positions[index + 1] = 0;
        index += 1;
        state = "line-comment";
      } else if (character === "/" && nextCharacter === "*") {
        positions[index] = 0;
        positions[index + 1] = 0;
        index += 1;
        state = "block-comment";
      } else if (character === "'") {
        positions[index] = 0;
        state = "single-quote";
      } else if (character === '"') {
        positions[index] = 0;
        state = "double-quote";
      } else if (character === "`") {
        positions[index] = 0;
        state = "template";
      }
    }

    return positions;
  }

  async function replaceModuleSpecifiers(source, pattern, replaceSpecifier) {
    let output = "";
    let lastIndex = 0;
    const codePositions = javascriptCodePositions(source);

    for (const match of source.matchAll(pattern)) {
      if (!codePositions[match.index]) {
        continue;
      }

      output += source.slice(lastIndex, match.index);
      output += `${match[1]}${match[2]}${await replaceSpecifier(match[3])}${match[2]}${match[4] || ""}`;
      lastIndex = match.index + match[0].length;
    }

    return output + source.slice(lastIndex);
  }

  async function moduleObjectUrl(reader, path, filesByPath, moduleUrls, ancestors = []) {
    if (ancestors.includes(path)) {
      throw new Error(`Circular local module imports are not supported: ${[...ancestors, path].join(" -> ")}.`);
    }

    if (moduleUrls.has(path)) {
      return moduleUrls.get(path);
    }

    const file = filesByPath.get(path);

    if (!file) {
      throw new Error(`The demonstration module ${path} was not found.`);
    }

    const nextAncestors = [...ancestors, path];
    const replaceSpecifier = async (specifier) => {
      const resolved = resolveModulePath(specifier, path);
      return resolved
        ? moduleObjectUrl(reader, resolved, filesByPath, moduleUrls, nextAncestors)
        : specifier;
    };
    let code = textDecoder.decode(fileBytes(file));
    code = await replaceModuleSpecifiers(
      code,
      /(\b(?:import|export)\b\s*[^'";]*?\bfrom\s*)(['"])([^'"]+)\2()/g,
      replaceSpecifier,
    );
    code = await replaceModuleSpecifiers(
      code,
      /(\bimport\b\s*)(['"])([^'"]+)\2()/g,
      replaceSpecifier,
    );
    code = await replaceModuleSpecifiers(
      code,
      /(\bimport\s*\(\s*)(['"])([^'"]+)\2(\s*\))/g,
      replaceSpecifier,
    );
    code += `\n//# sourceURL=mathtrace-paper/${path}`;
    const url = rememberGeneratedObjectUrl(reader, [code], "text/javascript");
    moduleUrls.set(path, url);
    return url;
  }

  async function activateTrustedScripts(reader, content, filesByPath) {
    const scripts = Array.from(content.querySelectorAll("script"));
    const moduleUrls = new Map();

    for (const original of scripts) {
      const source = original.getAttribute("src");
      const isModule = original.getAttribute("type")?.trim().toLowerCase() === "module";

      try {
        if (source) {
          const file = localDemoFile(source, filesByPath);

          if (file) {
            if (isModule) {
              const executable = document.createElement("script");
              Array.from(original.attributes).forEach((attribute) => {
                if (attribute.name !== "src") {
                  executable.setAttribute(attribute.name, attribute.value);
                }
              });
              const path = normalizeDemoPath(file.path);
              executable.src = await moduleObjectUrl(reader, path, filesByPath, moduleUrls);
              await runExternalScript(executable, original, source);
              continue;
            }

            const code = `${textDecoder.decode(fileBytes(file))}\n//# sourceURL=mathtrace-paper/${file.path}`;
            original.remove();
            Function(code).call(globalScope);
            continue;
          }

          if (!isExternalReference(source)) {
            original.remove();
            throw new Error(`The demonstration script ${source} was not found.`);
          }

          const executable = document.createElement("script");
          Array.from(original.attributes).forEach((attribute) => {
            executable.setAttribute(attribute.name, attribute.value);
          });
          await runExternalScript(executable, original, source);
          continue;
        }

        if (isModule) {
          const path = "demos/inline-module.js";
          const inlineFile = {
            path,
            type: "text/javascript",
            bytes: new TextEncoder().encode(original.textContent),
          };
          const inlineFiles = new Map(filesByPath);
          inlineFiles.set(path, inlineFile);
          const executable = document.createElement("script");
          Array.from(original.attributes).forEach((attribute) => {
            executable.setAttribute(attribute.name, attribute.value);
          });
          executable.src = await moduleObjectUrl(reader, path, inlineFiles, moduleUrls);
          await runExternalScript(executable, original, "an inline demonstration module");
          continue;
        }

        const code = `${original.textContent}\n//# sourceURL=mathtrace-paper/inline-script.js`;
        original.remove();
        Function(code).call(globalScope);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An interactive demonstration failed.";
        console.error("MathTrace could not run an interactive demonstration.", error);
        appendDemoError(content, message);
      }
    }
  }

  function clearPreviousMath(reader) {
    const mathJax = globalScope.MathJax;

    if (typeof mathJax?.typesetClear === "function") {
      mathJax.typesetClear([reader]);
    }
  }

  function createReaderHeader(kind, title, id = null) {
    const header = document.createElement("header");
    header.className = "node-document-header";
    const kindLabel = document.createElement("p");
    kindLabel.className = "node-document-kind";
    kindLabel.textContent = kind;
    const heading = document.createElement("h1");
    heading.textContent = title;
    header.append(kindLabel, heading);

    if (id) {
      const identifier = document.createElement("code");
      identifier.className = "node-document-id";
      identifier.textContent = id;
      identifier.title = "Stable node ID";
      header.append(identifier);
    }

    return header;
  }

  function createPaperHeader(paper) {
    const header = createReaderHeader("paper overview", paper.title);

    if (paper.authors.length > 0) {
      const authors = document.createElement("p");
      authors.className = "paper-overview-authors";
      authors.textContent = paper.authors.map((author) => author.name).join(", ");
      header.append(authors);
    }

    const affiliations = Array.from(new Set(
      paper.authors.map((author) => author.affiliation).filter(Boolean),
    ));

    if (affiliations.length > 0) {
      const affiliationList = document.createElement("p");
      affiliationList.className = "paper-overview-affiliations";
      affiliationList.textContent = affiliations.join(" · ");
      header.append(affiliationList);
    }

    const metadata = document.createElement("div");
    metadata.className = "paper-overview-metadata";
    const entries = [
      ["Paper ID", paper.id],
      ["Date", paper.date],
      ["Status", paper.status],
      ...Object.entries(paper.source)
        .filter(([, value]) => ["string", "number"].includes(typeof value))
        .map(([key, value]) => [key, String(value)]),
    ].filter(([, value]) => value);

    for (const [label, value] of entries) {
      const item = document.createElement("span");
      item.textContent = `${label}: ${value}`;
      metadata.append(item);
    }

    if (metadata.childElementCount > 0) {
      header.append(metadata);
    }

    if (paper.keywords.length > 0) {
      const keywords = document.createElement("p");
      keywords.className = "paper-overview-keywords";
      keywords.textContent = `Keywords: ${paper.keywords.join(", ")}`;
      header.append(keywords);
    }

    return header;
  }

  function installNodeLinkNavigation(reader) {
    if (reader.dataset.nodeLinkNavigation === "installed") {
      return;
    }

    reader.dataset.nodeLinkNavigation = "installed";
    reader.addEventListener("click", (event) => {
      const link = event.target.closest("[data-node-link]");

      if (!link) {
        return;
      }

      event.preventDefault();
      reader.dispatchEvent(new CustomEvent("mathtrace:node-link", {
        bubbles: true,
        detail: { nodeId: link.dataset.nodeLink },
      }));
    });
  }

  async function typesetMath(reader, revision) {
    const mathJax = globalScope.MathJax;

    if (!mathJax?.startup?.promise) {
      return false;
    }

    await mathJax.startup.promise;

    if (revision !== renderRevision || typeof mathJax.typesetPromise !== "function") {
      return false;
    }

    await mathJax.typesetPromise([reader]);
    return true;
  }

  async function renderNode({ reader, node, nodeTitleById, demoFiles = [] }) {
    renderRevision += 1;
    const revision = renderRevision;
    clearPreviousMath(reader);
    clearReaderResources(reader);
    reader.classList.remove("is-empty", "is-bundle", "is-paper-overview");
    reader.classList.add("has-content");
    const content = document.createElement("div");
    content.className = "markdown-content";
    content.innerHTML = markdownToHtml(node.body, nodeTitleById);
    const filesByPath = prepareTrustedResources({ reader, content, demoFiles });
    reader.replaceChildren(createReaderHeader(node.kind, node.title, node.id), content);
    reader.scrollTop = 0;
    installNodeLinkNavigation(reader);
    await activateTrustedScripts(reader, content, filesByPath);

    try {
      await typesetMath(reader, revision);
    } catch (error) {
      console.error("MathTrace could not render mathematics in the selected node.", error);
    }
  }

  async function renderPaperOverview({ reader, paper, nodeTitleById, demoFiles = [] }) {
    renderRevision += 1;
    const revision = renderRevision;
    clearPreviousMath(reader);
    clearReaderResources(reader);
    reader.classList.remove("is-empty", "is-bundle");
    reader.classList.add("has-content", "is-paper-overview");
    const content = document.createElement("div");
    content.className = "markdown-content paper-overview-content";
    content.innerHTML = markdownToHtml(paper.body, nodeTitleById);
    const filesByPath = prepareTrustedResources({ reader, content, demoFiles });
    reader.replaceChildren(createPaperHeader(paper), content);
    reader.scrollTop = 0;
    installNodeLinkNavigation(reader);
    await activateTrustedScripts(reader, content, filesByPath);

    try {
      await typesetMath(reader, revision);
    } catch (error) {
      console.error("MathTrace could not render mathematics in the paper overview.", error);
    }
  }

  function renderBundle({ reader, node, expanded = false }) {
    renderRevision += 1;
    clearPreviousMath(reader);
    clearReaderResources(reader);
    reader.classList.remove("is-empty", "has-content", "is-paper-overview");
    reader.classList.add("is-bundle");
    const notice = document.createElement("div");
    notice.className = "bundle-content-notice";
    const heading = document.createElement("p");
    heading.className = "bundle-content-title";
    heading.textContent = expanded
      ? `${node.memberCount} member nodes are visible in the graph.`
      : `${node.memberCount} nodes are collapsed into this bundle.`;
    const description = document.createElement("p");
    description.textContent = expanded
      ? "Select an individual member node to read its content. The surrounding graph has not moved."
      : "Content is available only after the bundle is expanded and an individual node is selected.";
    const action = document.createElement("button");
    action.className = "bundle-content-action";
    action.type = "button";
    action.textContent = expanded ? "Collapse bundle" : "Expand bundle";
    action.addEventListener("click", () => {
      reader.dispatchEvent(new CustomEvent(
        expanded ? "mathtrace:bundle-collapse" : "mathtrace:bundle-expand",
        {
          bubbles: true,
          detail: { bundleId: node.id },
        },
      ));
    });
    notice.append(heading, description, action);
    reader.replaceChildren(createReaderHeader("bundle", node.title), notice);
    reader.scrollTop = 0;
  }

  globalScope.MathTraceContentView = Object.freeze({
    clearReaderResources,
    markdownToHtml,
    normalizeNodeBody,
    renderBundle,
    renderNode,
    renderPaperOverview,
  });
}(globalThis));
