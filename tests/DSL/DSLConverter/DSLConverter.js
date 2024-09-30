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
    this.baseUrl = 'https://admin.prod.buerokratt.ee/';
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

  // Function to convert businessDSL to testDSL. Go through each method and generate a test.
  convertToTestDSL() {
    if (!this.businessDSL) {
      console.error("Business DSL not loaded.");
      return;
    }

    let testDSL = '';

    this.businessDSL.methods.forEach(method => {

      // TODO: maybe can combine with generateTest later...
      if (method.main && method.main.title) {
        testDSL += this.generateTest(method, "title");
      }

      testDSL += this.generateTest(method, "body");
    });

    const footer = this.businessDSL.methods[0]
    testDSL += this.generateTest(footer, "footer")

    testDSL = this.cleanTestDSL(testDSL);

    return testDSL;
  }


  // Function to generate a test for a body component.
  generateTest(method, type) {
    let testTemplate = '';
    let body 
    // Determine the appropriate body (footer or main body)
    switch (type) {
      case "title":
        body = method.main.title
        break;
      case "body":
        body = method.main.body
        break;
      case "footer":
        body = method.main.footer
        break;
      default:
        break;
    }

    // Check if the body is valid and has components
    if (body && Array.isArray(body.components)) {
      // Iterate over each component in the body
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
      console.warn('Invalid body structure or no components found.');
    }

    return testTemplate;
  }

  populateTemplate(template, component) {

    // For body, extract from label
    const componentType = Object.keys(component)[0];
    const componentData = component[componentType];
    const comp2 = Object.keys(componentData[0])[0]
    const labelValue = componentData[0][comp2].args[1].value; // Adjust this if the structure changes

    const translationData = {};
    const placeHolderMap = new Map();

    const matchString = 'label ' + componentType;

    translationData.label = labelValue;
    placeHolderMap.set(this.toCamelCase(matchString), labelValue);

    const translationKey = this.toCamelCase(translationData.label);
    const capitalizedType = componentType.charAt(0).toUpperCase() + componentType.slice(1)

    // Replace placeholders in the template with the corresponding translation
    const populatedTemplate = template.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
      if (p1 === "label" + capitalizedType) {
        return 'translation.' + translationKey;
      }
      if (p1 === "name") {
        return translationKey;
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
    // On top of the file is the 'name'
    let name = `name: ${this.businessDSL.description}\n`;

    // Construct the dynamic navigation URL
    let navigateUrl = `${this.baseUrl}${this.businessDSL.resource}`;

    // Setup block with tabs for indentation
    let setupBlock = `setup:\n\t- describe: Check visibility of Page Elements\n\t  serial: true\n\t  beforeEach:\n\t  - name: Setup\n\t\t  action:\n\t\t\t  navigate: "${navigateUrl}"\n\t  - name: Fetch Translations\n\t\t\t  action:\n\t\t\t\t  getTranslations: true\n\t\t\t\t  assignVariable: translations\n`;

    // Add tests block
    let testsLabel = 'tests:\n';

    // Indent the entire testDSL block by adding a tab in front of each line
    testDSL = testDSL.replace(/^/gm, '\t');

    // Clean up 'templates:' if present in the testDSL
    testDSL = testDSL.replace(/templates:\s*/g, '');

    // Combine all parts: name, setup block, and tests
    testDSL = name + setupBlock + testsLabel + testDSL;

    return testDSL;
  }
}

const dslConverter = new DSLConverter();
const testDSL = dslConverter.convertToTestDSL();
dslConverter.writeToFile('./testDSL.yml', testDSL);
console.log(testDSL);