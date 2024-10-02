const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const TITLE = 'title';
const FOOTER = 'footer';
const BODY = 'body';

class DSLConverter {
  constructor() {
    this.templates = {};
    this.businessDSL = null;
    this.baseUrl = 'https://admin.prod.buerokratt.ee/'; // You can move this later if needed.
    this.loadTemplates();
  }

  loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    const files = fs.readdirSync(templatesDir);

    files.forEach(file => {
      const templateName = path.parse(file).name;
      const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      this.templates[templateName] = templateContent;
    });
  }

  // Function to write generated testDSL to a file in the folder where business.yml is found
  writeToFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
  };

  // Recursively traverse folders to find 'BDSL' and 'business.yml'
  findBusinessYMLFolders(dir, visited = new Set()) {
    let results = [];

    try {
      const files = fs.readdirSync(dir); // Attempt to read the directory

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath); // Use lstatSync to check for symbolic links

        // Check for already visited directories to prevent infinite loops
        if (visited.has(fullPath)) {
          return; // Skip if already visited
        }

        visited.add(fullPath); // Mark this directory as visited

        if (stat.isDirectory()) {
          if (file === 'BDSL') {
            const businessYmlPath = path.join(fullPath, 'business.yml');
            if (fs.existsSync(businessYmlPath)) {
              results.push(businessYmlPath);
              console.log(`Found business.yml: ${businessYmlPath}`);
            }
          }

          // Recursively search subdirectories
          results = results.concat(this.findBusinessYMLFolders(fullPath, visited));

        }

      });
    } catch (err) {
      if (err.code === 'EACCES') {
        console.warn(`Permission denied for directory: ${dir}`); // Log the permission error
      } else {
        console.error(`Error reading directory ${dir}:`, err.message); // Log any other error
      }
    }

    return results;
  }


  loadBusinessDSL(businessDSLPath) {
    try {
      const businessDSL = yaml.load(fs.readFileSync(businessDSLPath, 'utf-8'));
      console.log(`Loaded Business DSL from: ${businessDSLPath}`); // Log the loaded path
      this.businessDSL = businessDSL;
    } catch (err) {
      console.error(`\x1b[31mError loading Business DSL from ${businessDSLPath}:\x1b[0m`, err.message);
      process.exit(1);
    }
  }

  // Function to convert businessDSL to testDSL.
  convertToTestDSL() {
    if (!this.businessDSL) {
      console.error("Business DSL not loaded.");
      return;
    }

    let testDSL = '';

    this.businessDSL.methods.forEach(method => {
      if (method.main && method.main.title) {
        testDSL += this.generateTest(method, TITLE);
      }
      testDSL += this.generateTest(method, BODY);
    });

    const footer = this.businessDSL.methods[0];
    testDSL += this.generateTest(footer, FOOTER);
    testDSL = this.cleanTestDSL(testDSL);

    return testDSL;
  }

  generateTest(method, type) {
    let testTemplate = '';
    let body;

    switch (type) {
      case TITLE:
        body = method.main.title;
        break;
      case BODY:
        body = method.main.body;
        break;
      case FOOTER:
        body = method.main.footer;
        break;
      default:
        break;
    }

    if (body && Array.isArray(body.components)) {
      body.components.forEach(component => {
        const componentType = Object.keys(component)[0];
        const title = `${componentType} tests for ${this.businessDSL.description}`;
        testTemplate += `\n\n# ${title}\n\n`;
        const componentTemplate = this.templates[componentType];

        if (componentTemplate) {
          testTemplate += this.populateTemplate(componentTemplate, component);
        } else {
          console.warn(`Template not found for component type: ${componentType}`);
        }
      });
    } else {
      console.warn('\x1b[31mInvalid body structure or no components found.\x1b[0m');

    }

    return testTemplate;
  }

  populateTemplate(template, component) {
    const componentType = Object.keys(component)[0];
    const componentData = component[componentType];

    const comp2 = Object.keys(componentData[0])[0];
    const labelValue = componentData[0][comp2].args[1].value;

    const translationData = {};
    const placeHolderMap = new Map();
    const matchString = 'label ' + componentType;

    translationData.label = labelValue;
    placeHolderMap.set(this.toCamelCase(matchString), labelValue);

    const translationKey = this.toCamelCase(translationData.label);
    const capitalizedType = componentType.charAt(0).toUpperCase() + componentType.slice(1);

    const populatedTemplate = template.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
      if (p1 === "label" + capitalizedType) {
        return 'translation.' + translationKey;
      }
      if (p1 === "name") {
        const nameObject = componentData[1].input.args.find(arg => arg.name !== undefined);
        return nameObject ? this.toCamelCase(nameObject.name) : translationKey;
      }
      return match;
    });

    return populatedTemplate;
  }

  toCamelCase(str) {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '');
  }

  cleanTestDSL(testDSL) {
    let name = `name: ${this.businessDSL.description}\n`;
    let navigateUrl = `${this.baseUrl}${this.businessDSL.resource}`;

    let setupBlock = `setup:\n\t- describe: Check visibility of Page Elements\n\t  serial: true\n\t  beforeEach:\n\t  - name: Setup\n\t\t  action:\n\t\t\t  navigate: "${navigateUrl}"\n\t  - name: Fetch Translations\n\t\t\t  action:\n\t\t\t\t  getTranslations: true\n\t\t\t\t  assignVariable: translations\n`;

    let testsLabel = 'tests:\n';
    testDSL = testDSL.replace(/^/gm, '\t');
    testDSL = testDSL.replace(/templates:\s*/g, '');
    testDSL = name + setupBlock + testsLabel + testDSL;

    return testDSL;
  }

  processBusinessDSL(businessYMLPath = null) {
    if (businessYMLPath) {
      // If a specific path is provided, load that file directly
      this.loadBusinessDSL(businessYMLPath);
      const testDSL = this.convertToTestDSL();

      const outputDir = path.dirname(businessYMLPath);
      const outputFilePath = path.join(outputDir, 'testDSL.yml');
      this.writeToFile(outputFilePath, testDSL);

      console.log(`TestDSL written to: ${outputFilePath} \n`); // Log where the TestDSL was written
    } else {
      // Otherwise, search for business.yml files
      const startDirectory = path.resolve(__dirname, '../../'); // Go up two levels to reach TDD-Playwright
      const businessYMLPaths = this.findBusinessYMLFolders(startDirectory); // Traverse from the TDD-Playwright directory
      console.log(`\n`);

      businessYMLPaths.forEach(businessYMLPath => {
        this.loadBusinessDSL(businessYMLPath);
        const testDSL = this.convertToTestDSL();

        const outputDir = path.dirname(businessYMLPath);
        const outputFilePath = path.join(outputDir, 'testDSL.yml');
        this.writeToFile(outputFilePath, testDSL);

        console.log(`TestDSL written to: ${outputFilePath} \n`); // Log where the TestDSL was written
      });
    }
  }
}

const dslConverter = new DSLConverter();
const specificPath = process.argv[2] || null; 
dslConverter.processBusinessDSL(specificPath);
