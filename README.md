#  Playwright testing
This project is built to test GUI functionality of buerokratt chat widget

## Description:
Current project help to test Buerokratt chat Widget GUI.  
Technologies used: Playwright, NODE.js, Docker

## Project setup
* in root directory
* Build image ```docker-compose up -d```
* Run docker CLI interactively ```docker-compose exec playwright bash```
* Run tests
* To see report ```npx playwright show-report --host 0.0.0.0```	
	
	when done...
* Exit docker CLI ```exit``` or ```CTRL + D```
* Stop and remove container ```docker-compose down```


# Running tests
* run all tests - ```npx playwright test```

* run tests in specific directory - ```npx playwright test ./tests/chatBox```
 
* run specific test file - ```npx playwright test ./tests/chatBox/visibility.spec.js```

* run api test file - ```npx playwright test ./tests/api/sample.spec.js --config=playwright.config.api.js```

* additional flags
	```
	--debug             // debug step by step
	--ui                // inspect tests while running
	--project=chromium  // specify a browser for testing | default: all
	--headed            // graphical representation of tests | default: headless
    --workers=3         // amount of workers to run tests
	--config=playwright.config.api.js // specify a config file to use for testing | default: playwright.config.js
	```  
[Official documentation for running and debugging tests](https://playwright.dev/docs/running-tests)  
Tests result will be opened automatically in the browser and localhost address will be displayed in the terminal 

# Writing tests:
NB! Writng tests should be done outside the container.
The container has to be rebuilt after.

* create new file with ```example.spec.js``` extension
 
* ```import { test, expect } from '@playwright/test'```

* action before each separate test
    ```
    test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Additional actions here
	});
    ```  
[Official documentation - Before and after hooks](https://playwright.dev/docs/test-parameterize#before-and-after-hooks)  
* Use different locators to find elements in DOM:  
Universal locator in Playwright is a method - .locator()  
for other useful follow this link: [locators](https://playwright.dev/docs/locators)

[Official documentation for writing tests](https://playwright.dev/docs/writing-tests)

### Generating tests:
NB! Test generation should be done outside the container
Test can be generated using:
```
npx playwright codegen https://prod.buerokratt.ee/
```

[Playwright inspector](https://playwright.dev/docs/codegen#generate-tests-with-the-playwright-inspector)  
point - click - copy - paste

[Official documentation - Generating tests](https://playwright.dev/docs/codegen-intro)

# Configure file
All configurations can be optionally defined, once, per test, run as flags (e.g. timeout : 30000ms,)
    
Global configuration are defined in: ```playwright.config.js``` and apply to every test run.  
* Global timeout is set for 30 seconds.  
* Failed tests will be retried once.  
* Failed tests will retain a video, a screenshot and a trace.

# Reading logs
* In container the test result will be diplayed ```http://0.0.0.0:9323```
* Outside the container tests result will be opened automatically in the browser and localhost address will be displayed in the terminal.

NB! All tests are saved (including video, screenshot and trace) in the local directories until next batch of tests:
* ```/playwright-report```  
* ```/test-results```

# Test directory tree:
``` 
📦TDD-Playwright
 ┣ 📂tests
 ┃ ┣ 📂.auth
 ┃ ┃ ┗ 📜user.json
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📂.auth
 ┃ ┃ ┃ ┣ 📜auth.setup.eng.js
 ┃ ┃ ┃ ┣ 📜auth.setup.js
 ┃ ┃ ┃ ┗ 📜user.json
 ┃ ┃ ┗ 📂landingPage
 ┃ ┃ ┃ ┣ 📂mainPage
 ┃ ┃ ┃ ┃ ┣ 📂header
 ┃ ┃ ┃ ┃ ┃ ┣ 📂userProfile
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functinality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┗ 📂sideBar
 ┃ ┃ ┃ ┃ ┃ ┣ 📂administration
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂chatbot
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂appearance_and_behavior
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visbility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂emergency_notices
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂settings
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂welcome_message
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂overview
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂sessionLength
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visbility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂users
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visbility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂workingTime
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂DSL
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.yml
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┣ 📂conversations
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂active
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂history
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂pending
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📂unanswered
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜helper.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┣ 📂training
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂training
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜translations.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┣ 📂api
 ┃ ┃ ┗ 📜conversations_api.spec.js
 ┃ ┣ 📂translations
 ┃ ┃ ┣ 📂en
 ┃ ┃ ┃ ┗ 📜common.json
 ┃ ┃ ┣ 📂et
 ┃ ┃ ┃ ┗ 📜common.json
 ┃ ┃ ┗ 📜languageDetector.js
 ┃ ┣ 📂widget
 ┃ ┃ ┣ 📂chatBox
 ┃ ┃ ┃ ┣ 📂closingMenu
 ┃ ┃ ┃ ┃ ┣ 📂feedbackMenu
 ┃ ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┣ 📂detailsMenu
 ┃ ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┃ ┗ 📂landingPage
 ┃ ┃ ┃ ┣ 📜functionality.spec.js
 ┃ ┃ ┃ ┗ 📜visibility.spec.js
 ┃ ┗ 📜example.spec.js
 ┣ 📜.dockerignore
 ┣ 📜Dockerfile
 ┣ 📜README.md
 ┣ 📜docker-compose.yml
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜playwright.config.api.js
 ┗ 📜playwright.config.js
```

# Test Suite for Bürokratt Admin Panel

## Test Functionalities

### General Testing Features

* **Authentication:**
  * All tests are conducted in an authenticated state. Playwright logs in before all tests, saves the cookie, and uses it to access the pages and correct translations.

* **Translations:**
  * Tests dynamically handle translations in English and Estonian. For example, `translation["yes"]` returns "Jah" in Estonian if the cookie is set to the Estonian locale.

## Administration

### administration/workingTime

### functionality.spec.js

This test suite verifies the functionality of the three main switches on the **Working Time** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Consider Public Holidays Switch Functionality:**

  Verifies that toggling the "considerPublicHolidays" switch changes its state and confirms that the new state is correctly applied.

* **Closed On Weekends Switch Functionality:**

  Checks the effect of toggling the "closedOnWeekends" switch. It ensures that the divs for Saturday and Sunday are hidden when the switch is on and visible again when the switch is off. It also verifies the interaction with the "sameOnAllWorkingDays" switch.

* **Same On All Working Days Switch Functionality:**

  Validates the functionality of the "sameOnAllWorkingDays" switch by checking its effect on the visibility of working day divs. Ensures that toggling this switch correctly adjusts which divs are visible based on the state of the "closedOnWeekends" switch.

### administration/workingTime

### visibility.spec.js

This test suite verifies the visibility and correct translation of various switches and day-related elements on the **Working Time** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Header Visibility and Text:**

  Ensures that the header element (`<h1>`) is visible on the page and that it contains the correct text for "workingTime".

* **Consider Public Holidays Switch Visibility and Text:**

  Verifies that the "considerPublicHolidays" switch is visible and that its label matches the expected translated text.

* **Closed On Weekends Switch Visibility and Text:**

  Checks the visibility of the "closedOnWeekends" switch and confirms that its label matches the expected translated text.

* **Same On All Working Days Switch Visibility and Text:**

  Validates the visibility of the "sameOnAllWorkingDays" switch and ensures its label corresponds to the expected translated text.

* **Day Labels and Associated Inputs Visibility:**

  For each day of the week, verifies that the day label, associated switch, and time input fields (start and end times) are all visible on the page. Ensures that each element is properly displayed for each day in the provided translations.


### administration/users

### functionality.spec.js

This test suite covers functionality testing for user management features on the **Users** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Sorting and Searching Tests:**
  * **Sorting:** 
  
    Tests the sorting functionality for ascending and descending order by clicking the sorting button twice.
  * **Searching:** 
  
    Selects random values from columns to verify search functionality.

* **User Management (CRUD Operations):**
  * **Add User:** 

    Adds a user by filling out a form and verifies that the user appears in the table.
  * **Edit User:**

    Edits an existing user and checks that the changes are reflected in the table.
  * **Delete User:** 

    Deletes the created and edited user and verifies the absence of the user in the table.

### visibility.spec.js

This test suite covers visibility testing for user management features on the **Users** page in the **Bürokratt Admin Panel**.


#### Test Suite Overview

* __Heading Visibility:__ 

    Checks if the heading "Users"  is visible on the page.

* __Add User Button Visibility:__ 

    Verifies that the button to add a new user, labeled "Add user", is visible.

* __User Data Table Visibility:__ 

    Ensures that the user data table is visible on the page.

* __Table Headers Visibility:__ 

    Confirms that the table headers are visible and contain the correct text according to the selected language. This includes headers for columns such as Name, ID Code, Role, etc.

* __Edit and Delete Buttons Per Row:__

    Ensures that each row in the user data table has exactly one "Edit" button and one "Delete" button.

### administration/sessionLength

### functionality.spec.js

This test suite verifies the functionality of the session length settings on the **Session Length** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* __Change to Same Session Length, Save, and Verify Persistence:__

    This test updates the session length to the same value as currently set, saves the change, and verifies that the new value persists after refreshing the page. It also checks if the original value can be restored correctly.

* __Attempt to Set an Invalid Session Length and Check for Error Message:__

    This test tries to set an invalid session length (e.g., 500 minutes), saves the change, and verifies that an error message is displayed. It ensures that the application properly handles invalid input and shows the correct error message.

* __Change to Different Session Length, Save, and Verify Persistence:__

    This test changes the session length to a new, valid value (randomly chosen within a specified range), saves the change, and checks if the new value persists after a page reload. It also verifies that the original session length can be restored successfully.

### visibility.spec.js


This test suite verifies the visibility of various elements on the **Session Length** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview


* __Check Visibility of the Main Header:__

    This test ensures that the main header (h1 element) is visible on the page, confirming that the primary title is displayed to users.

* __Check Visibility of the Session Length Label:__

    This test checks if the label associated with the session length input field is visible, ensuring users can see the prompt for entering the session length.

* __Check Visibility of the Session Length Input Field:__

    This test verifies that the input field for setting the session length (input[name="session-length"]) is visible, allowing users to enter the desired session length.

* __Check Visibility of the Unit Label "Minutes":__

    This test checks for the visibility of the "minutes" label (label.minute), which indicates the unit of measurement for the session length input.
* __Check Visibility of the Rule Label:__

    This test ensures that the rule label (label.rule) is visible, providing any additional information or guidelines related to the session length settings.

* __Check Visibility of the Save Button:__

    This test verifies that the save button (button.btn--primary) is visible, ensuring users can submit their changes to the session length.

## administration/chatbot

### welcome_message

### functionality.spec.js

This test suite verifies the functionality of the **welcome message** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* __Check if the switch on "Tervitus aktiivne"/"Greeting active" works:__

    Validates if toggling the "Greeting active" switch affects the display of the welcome message. Specifically, it ensures that turning off the switch hides the welcome message on the widget page.

* __Input Field and Character Counter:__

    Confirms that entering text into the welcome message input field updates the character counter correctly and that the new message is saved and displayed properly in the widget.

### visibility.spec.js

* **Main Title Visibility:**

  Ensures that the main title containing the welcome message text is visible on the page.

* **Textarea Visibility and Content:**

  Checks that the textarea is visible and contains text. Also verifies that the textarea is correctly populated with content.

* **Switch Label Visibility:**

  Confirms that the switch label, indicating whether the greeting is active, is visible.

* **Switch Button Visibility:**

  Validates that the switch button itself is visible.

* **Textarea Label Visibility:**

  Ensures that the label associated with the textarea is visible.

* **Textarea Text Presence:**

  Checks that the textarea contains text.

* **Character Count Visibility:**

  Verifies that the character count reflects the length of the message. Note: There is a known issue where the character count might not display correctly on the first load.

* **Save Button Visibility:**

  Ensures that the "Salvesta" (Save) button is visible.

### settings

### functionality.spec.js

This test suite verifies the functionality of various elements on the **Settings** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Switch Toggling and State Persistence:**

    Ensures that toggling each of the switches on the settings page updates their state as expected. Verifies that changes persist after saving and reloading the page. Also checks that switches return to their original states after restoration, and saves these original states. 

### visibility.spec.js

This test suite verifies the visibility of various elements on the **Settings** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Main Heading Visibility:**

  Verifies that the main heading on the Settings page is visible and contains the correct text as per the translation.

* **Visibility of "Vestlusrobot aktiivne" Switch:**

  Ensures that the first switch ("Vestlusrobot aktiivne") is visible on the Settings page.

* **Visibility of "Kuva nõustaja nimi" Switch:**

  Checks that the second switch ("Kuva nõustaja nimi") is visible and has the default state set to 'checked'.

* **Visibility of "Kuva nõustaja tiitel" Switch:**

  Confirms that the third switch ("Kuva nõustaja tiitel") is visible and has the default state set to 'checked'.

* **Visibility of "Salvesta" Button:**

  Ensures that the "Salvesta" button is visible on the Settings page.

### appearance_and_behavior

### functionality.spec.js

This test suite verifies the functionality of various elements on the **Appearance and Behavior** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Animation Duration Input:**

  Verifies that the animation duration input field on the "Appearance and Behaviour" page accepts and displays the correct value.

* **Notification Switch Toggle:**

  Tests the functionality of the notification switch by toggling it and checking if its state changes as expected.

* **Animation Start Time Input:**

  Ensures that the animation start time input field accepts and displays the correct value.

* **Notification Message Input:**

  Verifies that the notification message input field accepts and displays the correct value.

* **Primary Color Picker:**

  Tests the color picker functionality by setting a new color and verifying the value.

* **Animation Dropdown:**

  Checks that the animation dropdown is visible, can be interacted with, and correctly selects an option.

* **"Eelvaade"/"Preview" Button Functionality:**

  Verifies that clicking the "Eelvaade" button displays the mock widget and reflects the new settings accurately.

* **Functionality Check for All Fields and "Eelvaade" Button:**

  Ensures all fields (animation duration, notification switch, animation start time, notification message, primary color, animation dropdown) work correctly together with the "Eelvaade" button, and that changes are visible on the mock widget.

  Additionally, it checks the notification message visibility based on the switch state, background color, animation iteration count, and animation class on the mock widget.

### visibility.spec.js

This test suite verifies the visibility of various elements on the **Appearance and Behavior** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Header Visibility:**

  Verifies that the header on the "Appearance and Behaviour" page is visible and contains the correct text according to the translation.

* **Animation Duration Input Visibility:**

  Checks that the animation duration input field is visible on the "Appearance and Behaviour" page.

* **Notification Switch Visibility:**

  Ensures that the notification switch is visible on the "Appearance and Behaviour" page.

* **Animation Start Time Input Visibility:**

  Verifies that the animation start time input field is visible on the "Appearance and Behaviour" page.

* **Notification Message Input Visibility:**

  Ensures that the notification message input field is visible on the "Appearance and Behaviour" page.

* **Primary Color Picker Visibility:**

  Checks that the primary color picker input field is visible on the "Appearance and Behaviour" page.

* **Color Picker Button Visibility:**

  Verifies that the color picker button is visible on the "Appearance and Behaviour" page.

* **Animation Dropdown Visibility:**

  Ensures that the animation dropdown is visible on the "Appearance and Behaviour" page.

* **Save Button Visibility:**

  Checks that the "Save" button is visible on the "Appearance and Behaviour" page.

* **Preview Button Visibility:**

  Verifies that the "Preview" button is visible on the "Appearance and Behaviour" page.
