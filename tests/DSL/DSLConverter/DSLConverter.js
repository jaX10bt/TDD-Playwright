const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class DSLConverter {
  constructor() {
    this.templates = {};
    this.businessDSL = null;
    this.loadTemplates();
    this.loadBusinessDSL();
  }

  loadTemplates() {
    const templatesDir = path.join(process.cwd(), 'templates');
    const files = fs.readdirSync(templatesDir);

    files.forEach(file => {
      const templateName = path.parse(file).name;
      const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      this.templates[templateName] = templateContent;
    });
  }

  loadBusinessDSL() {
    const businessDSLPath = process.argv[2];
    try {
      const businessDSL = yaml.load(fs.readFileSync(businessDSLPath, 'utf-8'));
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
    testDSL = testDSL.replace(/templates:\s*/g, '');
    return testDSL;
  }
}

const dslConverter = new DSLConverter();
const testDSL = dslConverter.convertToTestDSL();
console.log(testDSL);
