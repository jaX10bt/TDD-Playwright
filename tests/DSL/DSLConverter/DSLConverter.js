const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { dirname } = require('path');

class DSLConverter {
  constructor() {
    this.templates = {};
    this.businessDSL = null;
    this.loadTemplates();
    this.loadBusinessDSL();

    // TODO: not sure it is nice to keep it here. maybe should move somewhere else in setup file etc...
    this.baseUrl = 'https://admin.prod.buerokratt.ee';
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

  // Function to write generated testDSL to a file
  writeToFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
  };


  loadBusinessDSL() {
    const businessDSLPath = process.argv[2];
    const businessDSLPath2 = path.join(__dirname, businessDSLPath); // Adjust path if needed
    try {
      const businessDSL = yaml.load(fs.readFileSync(businessDSLPath2, 'utf-8'));
      console.log("Loaded Business DSL:", businessDSL);
      this.businessDSL = businessDSL;
    } catch (err) {
      console.error(`Error loading Business DSL from ${businessDSLPath}:`, err.message);
      process.exit(1);
    }
  }

  convertToTestDSL() {
    if (!this.businessDSL) {
      console.error("Business DSL not loaded.");
      return;
    }

    let testDSL = '';

    this.businessDSL.methods.forEach(method => {
      testDSL += this.generateTest(method);
    });

    testDSL = this.cleanTestDSL(testDSL);

    return testDSL;
  }

  generateTest(method) {
    let testTemplate = '';

    // Focusing only on the body components
    const body = method.main.body;

    if (body && Array.isArray(body.components)) {
      body.components.forEach(component => {
        const componentType = Object.keys(component)[0];
        const componentTemplate = this.templates[componentType];

        if (componentTemplate) {
          testTemplate += this.populateTemplate(componentTemplate, component);
        } else {
          console.warn(`Template not found for component type: ${componentType}`);
        }
      });
    }

    return testTemplate;
  }

  populateTemplate(template, component) {
    const componentType = Object.keys(component)[0];
    const componentData = component[componentType];
    const labelValue = componentData.args[0].label.args[1].value;

    const translationData = {};
    const placeHolderMap = new Map();

    const matchString = 'label ' + componentType;

    translationData.label = labelValue;
    placeHolderMap.set(this.toCamelCase(matchString), labelValue);

    const translationKey = this.toCamelCase(translationData.label);

    const populatedTemplate = template.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
      if (placeHolderMap.has(p1)) {
        return 'translation.' + translationKey;
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
    // On top of the file is a name
    let name = `name: ${this.businessDSL.description}\n`;
    let navigateUrl = this.baseUrl + this.businessDSL.resource;
    // Constructing yml file so it should have setup block where we define before each for example.
    let beforeEachBlock = `beforeEach:\n\t  - name: Setup\n\t\t  action:\n\t\t\t\tnavigate: "${navigateUrl}"\n`;
    let setupBlock = `setup:\n\t- describe: Check visibility of Page Elements\n\t  serial: true\n\t  ${beforeEachBlock}`;
    
    testDSL = testDSL.replace(/templates:\s*/g, 'tests:\n');

    testDSL = name + setupBlock + testDSL;
    
    return testDSL;
  }
}

const dslConverter = new DSLConverter();
const testDSL = dslConverter.convertToTestDSL();
dslConverter.writeToFile('./testDSL.yml', testDSL);
console.log(testDSL);
