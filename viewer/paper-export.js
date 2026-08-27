(function createMathTracePaperExport(globalScope) {
  "use strict";

  const yaml = globalScope.jsyaml;
  const parser = globalScope.MathTraceParser;
  const nodeEditor = globalScope.MathTraceNodeEditor;

  if (!yaml || !parser || !nodeEditor) {
    throw new Error("MathTrace could not start because the paper export dependencies were not loaded.");
  }

  const textEncoder = new TextEncoder();
  const crcTable = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }

    crcTable[index] = value >>> 0;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function dumpYaml(value) {
    return yaml.dump(clone(value), {
      indent: 2,
      lineWidth: -1,
      noCompatMode: true,
      noRefs: true,
      sortKeys: false,
    }).trimEnd();
  }

  function serializePaper(project) {
    const sourceText = project.files.paper?.text;

    if (!sourceText) {
      throw new Error("This project does not include mathtrace.paper.md.");
    }

    const parts = nodeEditor.splitFrontmatter(sourceText, "mathtrace.paper.md");
    const metadata = yaml.load(parts.frontmatter);

    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      throw new Error("mathtrace.paper.md must contain YAML frontmatter.");
    }

    metadata.format = "mathtrace-paper";
    metadata.version = Math.max(2, Number(metadata.version) || 1);
    metadata.graph = clone(project.configuration.graph);
    metadata.layout = clone(project.configuration.layout || {});
    metadata.bundling = clone(project.configuration.bundling || {});
    delete metadata.bundles;

    return `---\n${dumpYaml(metadata)}\n---\n\n${parts.body.replace(/^\n+/, "")}`;
  }

  function normalizedFiles(files) {
    return files
      .map((file) => ({ path: file.path, text: file.text }))
      .sort((first, second) => first.path.localeCompare(second.path));
  }

  function hasChanges(project) {
    if (!project) {
      return false;
    }

    const paperChanged = (project.files.paper?.text || "") !== (project.defaults.paperText || "");
    const nodesChanged = JSON.stringify(normalizedFiles(project.nodeFiles))
      !== JSON.stringify(normalizedFiles(project.defaults.nodeFiles || []));
    const paperStructureChanged = JSON.stringify(project.working.bundles || [])
      !== JSON.stringify(project.defaults.bundles || []);
    return paperChanged || nodesChanged || paperStructureChanged;
  }

  function normalizeArchivePath(value) {
    const path = String(value || "")
      .replaceAll("\\", "/")
      .replace(/^\/+/, "")
      .replace(/\/{2,}/g, "/");

    if (!path || path.split("/").some((segment) => segment === "." || segment === ".." || !segment)) {
      throw new Error(`Cannot export the unsafe path ${value}.`);
    }

    return path;
  }

  function projectEntries(project) {
    const entries = [{
      path: "mathtrace.paper.md",
      text: serializePaper(project),
    }];
    const seenPaths = new Set(["mathtrace.paper.md"]);

    for (const file of project.nodeFiles) {
      parser.parseNode(file);
      const path = normalizeArchivePath(file.path);

      if (seenPaths.has(path)) {
        throw new Error(`More than one node would be exported to ${path}.`);
      }

      seenPaths.add(path);
      entries.push({ path, text: file.text });
    }

    for (const file of project.demoFiles || []) {
      const path = normalizeArchivePath(file.path);

      if (!path.startsWith("demos/")) {
        throw new Error(`Demonstration files must remain beneath demos/: ${path}.`);
      }

      if (seenPaths.has(path)) {
        throw new Error(`More than one paper file would be exported to ${path}.`);
      }

      seenPaths.add(path);
      entries.push({ path, bytes: file.bytes });
    }

    return entries.sort((first, second) => first.path.localeCompare(second.path));
  }

  function crc32(bytes) {
    let checksum = 0xffffffff;

    for (const byte of bytes) {
      checksum = crcTable[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
    }

    return (checksum ^ 0xffffffff) >>> 0;
  }

  function dosTimestamp(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    return {
      time: ((date.getHours() & 0x1f) << 11)
        | ((date.getMinutes() & 0x3f) << 5)
        | (Math.floor(date.getSeconds() / 2) & 0x1f),
      date: (((year - 1980) & 0x7f) << 9)
        | (((date.getMonth() + 1) & 0x0f) << 5)
        | (date.getDate() & 0x1f),
    };
  }

  function header(size) {
    const bytes = new Uint8Array(size);
    return { bytes, view: new DataView(bytes.buffer) };
  }

  function createZip(entries) {
    const localParts = [];
    const centralParts = [];
    const timestamp = dosTimestamp();
    let offset = 0;

    for (const entry of entries) {
      const name = textEncoder.encode(normalizeArchivePath(entry.path));
      const data = entry.bytes instanceof Uint8Array
        ? entry.bytes
        : entry.bytes instanceof ArrayBuffer
          ? new Uint8Array(entry.bytes)
          : textEncoder.encode(String(entry.text || ""));
      const checksum = crc32(data);
      const local = header(30);
      local.view.setUint32(0, 0x04034b50, true);
      local.view.setUint16(4, 20, true);
      local.view.setUint16(6, 0x0800, true);
      local.view.setUint16(8, 0, true);
      local.view.setUint16(10, timestamp.time, true);
      local.view.setUint16(12, timestamp.date, true);
      local.view.setUint32(14, checksum, true);
      local.view.setUint32(18, data.length, true);
      local.view.setUint32(22, data.length, true);
      local.view.setUint16(26, name.length, true);
      local.view.setUint16(28, 0, true);
      localParts.push(local.bytes, name, data);

      const central = header(46);
      central.view.setUint32(0, 0x02014b50, true);
      central.view.setUint16(4, 20, true);
      central.view.setUint16(6, 20, true);
      central.view.setUint16(8, 0x0800, true);
      central.view.setUint16(10, 0, true);
      central.view.setUint16(12, timestamp.time, true);
      central.view.setUint16(14, timestamp.date, true);
      central.view.setUint32(16, checksum, true);
      central.view.setUint32(20, data.length, true);
      central.view.setUint32(24, data.length, true);
      central.view.setUint16(28, name.length, true);
      central.view.setUint16(30, 0, true);
      central.view.setUint16(32, 0, true);
      central.view.setUint16(34, 0, true);
      central.view.setUint16(36, 0, true);
      central.view.setUint32(38, 0, true);
      central.view.setUint32(42, offset, true);
      centralParts.push(central.bytes, name);
      offset += local.bytes.length + name.length + data.length;
    }

    const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
    const end = header(22);
    end.view.setUint32(0, 0x06054b50, true);
    end.view.setUint16(4, 0, true);
    end.view.setUint16(6, 0, true);
    end.view.setUint16(8, entries.length, true);
    end.view.setUint16(10, entries.length, true);
    end.view.setUint32(12, centralSize, true);
    end.view.setUint32(16, offset, true);
    end.view.setUint16(20, 0, true);
    return new Blob([...localParts, ...centralParts, end.bytes], { type: "application/zip" });
  }

  function downloadProject(project) {
    const blob = createZip(projectEntries(project));
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileStem = String(project.paper.id || "mathtrace-paper")
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "mathtrace-paper";
    link.href = objectUrl;
    link.download = `${fileStem}.zip`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    return { blob, fileName: link.download };
  }

  globalScope.MathTracePaperExport = Object.freeze({
    createZip,
    downloadProject,
    hasChanges,
    projectEntries,
    serializePaper,
  });
}(globalThis));
