// Step 1: Generate index.html dynamically using Node.js
import fs from "fs";
import path from "path";

// Replace variables in the template using provided data
const replaceVariables = (template, data) => {
  return template.replace(/{{\s*(\w+(?:\.\w+)*)\s*}}/g, (match, key) => {
    console.log(`Processing key: ${key}`);
    const keys = key.split(".");
    let value = data;
    for (const k of keys) {
      if (value[k] === undefined) {
        console.log(`Key not found: ${k}, returning original placeholder`);
        return match;
      }
      value = value[k];
      console.log(`Key found: ${k}, current value: ${value}`);
    }
    return value;
  });
};

// Generate index.html
const createIndexHtml = (templates) => {
  const sidebarItems = templates
    .map(({ service, template, language, content, rawContent }) => {
      const previewId = `${service}-${template}-${language}`.replace(
        /\s+/g,
        "-"
      );
      return `<div class="template-item" data-service="${service}" data-template="${template}" data-language="${language}">
      ${service} - ${template} (${language})
    </div>`;
    })
    .join("\n");

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Template Preview</title>
  <style>
    body {
      display: flex;
      font-family: Arial, sans-serif;
    }
    #sidebar {
      width: 30%;
      border-right: 1px solid #ccc;
      padding: 10px;
      overflow-y: auto;
    }
    #preview {
      flex: 1;
      padding: 10px;
    }
    .template-item {
      cursor: pointer;
      padding: 5px;
      border-bottom: 1px solid #ddd;
    }
    .template-item:hover {
      background: #f0f0f0;
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const templates = ${JSON.stringify(templates)};
      const sidebar = document.getElementById('sidebar');
      const preview = document.getElementById('preview');

      sidebar.addEventListener('click', (event) => {
        const item = event.target.closest('.template-item');
        if (!item) return;

        const { service, template, language } = item.dataset;
        const selectedTemplate = templates.find(t => t.service === service && t.template === template && t.language === language);

        if (selectedTemplate) {
          console.log('Selected Template:', selectedTemplate);
          const renderedContent = replaceVariables(selectedTemplate.rawContent, selectedTemplate.data);
          console.log('Rendered Content:', renderedContent);
          preview.innerHTML = renderedContent;
        }
      });
    });

    const replaceVariables = ${replaceVariables.toString()};
  </script>
</head>
<body>
  <div id="sidebar">
    ${sidebarItems}
  </div>
  <div id="preview"></div>
</body>
</html>`;
};

// Generate templates.json dynamically
const generateTemplates = () => {
  const templatesDir = path.resolve("./templates");
  const testDir = path.resolve("./test");
  const templates = [];

  function traverseDirectory(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverseDirectory(fullPath, callback);
      } else if (entry.isFile()) {
        callback(fullPath);
      }
    });
  }

  traverseDirectory(templatesDir, (filePath) => {
    if (filePath.endsWith(".html")) {
      const relativePath = path.relative(templatesDir, filePath);
      const [service, template, language] = relativePath.split(path.sep);
      const dataPath = path.join(testDir, template, "data.json");
      const rawContent = fs.readFileSync(filePath, "utf8");
      const data = fs.existsSync(dataPath)
        ? JSON.parse(fs.readFileSync(dataPath, "utf8"))
        : {};

      templates.push({
        service,
        template,
        language: language.replace(".html", ""),
        rawContent,
        data,
      });
    }
  });

  return templates;
};

// Main build script
const main = () => {
  const templates = generateTemplates();
  const indexHtmlContent = createIndexHtml(templates);
  fs.writeFileSync("./index.html", indexHtmlContent);
  console.log("index.html generated successfully.");
};

main();
