# DSLConverter Readme

- DSLConverter on WIP, mis peaks tegema äri DSList templiitide baasil testDSLi. 

- Väga algses faasis, põhimõtteliselt praegu lihtsalt loeb templiidid sisse äriDSLi baasil ja annab tagasi testDSLi, kuhu {{ }} sulgude sisse tõlkevariatsioonid

- Tõlkeid endid pole rakendanud veel, tõenäoliselt saab lihtsamalt, eriti mainHeaderiga, mis on igal leheküljel. Seal ei pea midagi asendama ning saab panna otse translations.XXX. 

## **TODO:**

- Kõik äriDSLid peavad vastama ühele formaadile, muidu läheb programm katki

- Templiidid ühele formaadile vastama ei pea kuid peavad olema võimalikult universaalsed.

- Header ja Footer peab olema handletud eraldi, sest need on üle lehekülgede väga erinevad. 

- Praegune implementatsioon on proovina ehitatud selle baasil, et templatel on üks placeholder, mille formaat on 'label' + XXX

- See aga ei tööta kõigiga kuivõrd osadel on rohkem placeholdereid, osadel on staatilised placeholderid, mis on üle pagede samad (vt nt mainHeader.yml, ükski placeholder tegelikult ei olene kontekstis ning võib kohe olla kas translated või translation.XXX formaadis)


### **Praegune output BusinessDSL.ymli näitel**

- See vajab endale testide kirjeldusi, mida saab genereerida teenuse abil. 
- See vajab täpseid ning universaalseid templiite, mille järgi saab testDSLi ehitada.
- Juhul, kui näiteks on kindlasti vaja locateda klassiga, tuleb kirjeldada äriDSLIs parentclassi.

**Pole kasutanud seda inputiks ChatGPTsse, ei tea, kuidas see output PLaywrighti testina välja näeb**

```
- name: label_input
  - components: 
      parent: input
      children: Label + Input
      - name: Label
        type: Label
        props:
          label: "translation.widgetProactiveSeconds"
          
      - name: Input
        type: Input
        props:
          input: "input"
          
        
- name: label_switch
  - components: 
      parent: switch
      children: Label + Switch
      - name: Label
        type: Label
        props:
          label: " translation.widgetBubbleMessageText"
          
      - name: Switch
        type: Switch
        props:
          switch: "button.switch__button"
          
        
- name: label_input
  - components: 
      parent: input
      children: Label + Input
      - name: Label
        type: Label
        props:
          label: "translation.widgetBubbleMessageSeconds"
          
      - name: Input
        type: Input
        props:
          input: "input"
          
        
- name: label_input
  - components: 
      parent: input
      children: Label + Input
      - name: Label
        type: Label
        props:
          label: "translation.widgetBubbleMessageText"
          
      - name: Input
        type: Input
        props:
          input: "input"
          
        
- name: label_colorpicker
  - components: 
      parent: input
      children: Label + ColorPicker + Button
      - name: Label
        type: Label
        props:
          label: "translation.widgetColor"
          
      - name: ColorPicker
        type: Input
        props:
          input: "input"
          readonly: true
      
      - name: Button
        type: Button
        props:
          icon: true
          # Indicates it's next to the ColorPicker in the DOM structure
          adjacent_to: ColorPicker- name: label_dropdown
  - components: 
      parent: select
      children: Label + Dropdown
      - name: Label
        type: Label
        props:
          label: "translation.widgetAnimation"
          
      - name: Dropdown
        type: Input
        props:
          trigger_class: "select__trigger"
          expanded: false

```