#  Playwright testing
This project is built to test GUI functionality of buerokratt admin panel

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
  * The login logic is handled in `auth.setup.js`, where the authentication flow and cookie saving is described in detail. Additionally, the configuration related to authentication can be found in `playwright.config.js`, which includes settings required to properly simulate and test authentication in the application.

* **Translations:**
  * Tests are dynamically designed to handle translations in both English and Estonian. For example, `translation["yes"]` returns "Jah" when the cookie is set to the Estonian locale. This allows tests to seamlessly switch between languages based on the locale setting, ensuring all user-facing text is verified in the appropriate language.



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


## Conversations/Active

### visibility.spec.js

This test suite verifies the visibility of various elements on the **Active Conversations** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Header Visibility:**

    Verifies that the header on the "Active Conversations" page is visible and contains the correct text according to the translation.

* **Vertical Tabs Visibility:**

    Checks that the Conversations vertical tabs are visible on the page.

* **Body Visibility:**

    Ensures that the main chat body is visible when a chat is active.

* **Header Visibility in Chat Body:**

    Verifies that the chat header within the active chat body is visible.

* **Chat Wrapper Visibility:**

    Ensures that the chat wrapper is visible in the active chat section.

* **Toolbar Visibility:**

    Checks that the chat toolbar is visible in the active chat.

* **Toolbar Button Visibility:**

    Verifies that the buttons inside the chat toolbar are visible.

* **Chat Side Panel Visibility:**

    Confirms that the chat side panel is visible in the active chat section.

* **Meta Information Fields Visibility:**

    Ensures that the meta information fields in the side panel, such as ID, user name, chat started at, device, and location, are visible and correctly displayed.

### functionality.spec.js
This test suite verifies the functionality of various elements on the **Active Conversations** page in the **Bürokratt Admin Panel**.
* to be coming soon....



## Conversations/History

### visibility.spec.js

This test suite verifies the visibility of various elements on the **History** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Header Visibility:**

    Verifies that the header is visible on the History page and displays the correct translated text.

* **Search and Filter Bar Header Visibility:**

    Ensures that the Search and Filter bar is visible and includes essential parts such as the search field, date filtering options, and a dropdown menu.

* **Search Field Visibility and Placeholder Text:**

    Checks that the search field is visible and has the correct placeholder.

* **Date Filter Fields Visibility:**

    Verifies that both date pickers are visible for filtering the chat history by date.

* **Dropdown Menu Visibility:**

    Confirms that the dropdown menu in the Filter and Search bar is visible and includes the default text "Vali".

* **Filter and Search Results Table Visibility:**

    Ensures that the Filter and Search results table is visible and includes all necessary fields and chat result data.

* **Table and Headers Visibility:**

    Checks that the data table is visible and contains the correct column headers, including.

* **Sorting Buttons Presence:**

    Verifies that sorting buttons are present in each column of the data table.

* **Pagination Controls:**

    Ensures that the pagination controls are visible and functioning, allowing users to change the number of rows per page (10, 20, 30, 40, 50).


### functionality.spec.js

This test suite verifies the functionality of various elements on the **History** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Table Horizontal Scrollability:**

    Verifies that the table on the history page is horizontally scrollable, ensuring large datasets can be easily viewed.

* **Date Input Modification:**

    Ensures that the "Ajalugu" date inputs (From and To fields) can be changed and properly reflect the new date values.

* **Invalid Date Format Rejection (From Date):**

    Verifies that the From date input rejects invalid date formats and displays an appropriate validation error message.

* **Invalid Date Format Rejection (To Date):**

    Ensures that the To date input rejects invalid date formats and shows the correct validation feedback.

* **Date Input Validation:**

    Verifies that the date inputs only accept valid date formats, ensuring proper data entry for both From and To fields.

* **Dropdown Menu Selection:**

    Ensures that the dropdown menu expands correctly, displays available options, and allows the user to select a different option.

* **Dropdown Menu Column Visibility:**

    Confirms that selecting an option from the dropdown menu updates the table to show the corresponding column.

* **Search Functionality:**

    Verifies that the search input field accepts text and triggers the search, updating the results in the data table based on the search query.

* **Table Column Sorting (From Date):**

    Ensures that the columns in the data table can be sorted by clicking the column headers, specifically testing sorting by the From date.

* **Table Column Sorting (To Date):**

    Verifies that the columns in the data table can be sorted by clicking the column headers, specifically testing sorting by the To date.

* **Chat Menu Expansion:**

    Ensures that clicking the open chat button expands the chat menu, allowing users to view detailed information about individual chats.

## Conversations/Pending

### visibility.spec.js

This test suite verifies the visibility of various elements on the **Pending Conversations** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Section Titles Visibility:**

    Verifies that the section titles are visible in the vertical tabs.

* **Conversations List Section Visibility:**

    Ensures that the section where all conversations are listed is visible.

* **"To Delete" Title Visibility:**

    Verifies that the "to delete" title is visible in the vertical tabs after activating the corresponding chat status.

* **Main Chat Window Visibility:**

    Ensures that the main chat window is visible.

* **Prompt Text Visibility:**

    Verifies that the correct prompt text is visible in the chat window.

### Body Visibility

* **Chat Body Visibility:**

    Ensures that the main chat body is visible when a chat is selected.

* **Header Visibility:**

    Verifies that the chat header is visible in the active chat.

* **Chat Wrapper Visibility:**

    Ensures that the chat wrapper is visible in the active chat section.

* **Toolbar Visibility:**

    Verifies that the chat toolbar is visible, along with the buttons inside the toolbar.

* **Chat Side Panel Visibility:**

    Confirms that the chat side panel is visible in the active chat section.

* **Meta Information Fields Visibility:**

    Ensures that the meta information fields on the chat side panel are visible.
  

## Conversations/Unanswered

### visibility.spec.js

This test suite verifies the visibility of various elements on the **Unanswered Conversations** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **"Unanswered Conversations" Vertical Tabs:**

    Verifies that the vertical tabs for Unanswered chats are visible.

* **Unanswered Conversations Section:**

    Ensures that the section where all unanswered conversations are listed is visible.

* **"Vastamata vestlused" / "Unanswered Chats" Title:**

    Verifies that the title (Unanswered Chats) is displayed correctly based on the translation.

* **Main Chat Window Visibility:**

    Confirms that the main chat window for unanswered conversations is visible.

* **Prompt Text Visibility:**

    Verifies that the text "Alustamiseks vali vestlus" / "Choose a chat to begin" is visible in the chat window.

### Selected Conversation Open Chat Visibility Tests

* **Meta Information Fields:**

    Ensures that individual meta information fields, such as ID, user name, chat started at, device, and location, are visible in the chat side panel.

* **Active Chat Side Actions:**

    Confirms that the active chat side actions, including buttons for ending the chat, asking for authentication, contact information, permission, and forwarding to a colleague, are visible.

* **"Take Over" Button:**

    Verifies that the "Take Over" button is visible in the toolbar for unanswered chats.

* **Active Chat Header:**

    Ensures that the header of the active chat, including text and heading elements, is visible.

### "Vali vestluse staatus" Dialog Visibility

* **Dialog Visibility:**

    Confirms that the "Vali vestluse staatus" (Choose chat status) dialog is visible after selecting to end the chat.

* **Dialog Header and Body Visibility:**

    Verifies that both the header and body of the dialog are visible.

* **Radio Buttons Visibility:**

    Ensures that all radio buttons are visible.

* **Radio Button Labels:**

    Confirms that the labels for the radio buttons are visible and correctly translated.

### "Forward to a colleague" Active Chat Actions Dialog Visibility

* **Dialog Header and Body Visibility:**

    Ensures that the "Suuna kolleegile" (Forward to colleague) dialog header and body are visible, including the dialog title, close button, and body content.

* **Search Field Visibility:**

    Verifies that the search field in the dialog is visible with the correct placeholder text.

* **Checkbox and Table Visibility:**

    Confirms that the checkbox for showing only active agents and the table with sorting buttons are visible.

* **Pagination Controls:**

    Ensures that pagination controls for changing the number of rows per page are visible and functional, allowing selection of various page sizes (10, 20, 30, 40, 50).


### functionality.spec.js

This test suite verifies the functionality of various elements on the **Unanswered Conversations** page in the **Bürokratt Admin Panel**.

#### Test Suite Overview

* **Open Unanswered Chat:**

    Verifies that clicking on an unanswered chat successfully opens the chat and displays the chat body, header, wrapper, toolbar, side panel, and associated actions.

* **Open "Lõpeta vestlus" Dialog:**

    Ensures that clicking the (End chat) button opens the corresponding dialog.

* **Close "Lõpeta vestlus" Dialog:**

    Confirms that clicking the "Cancel" button inside the (End chat) dialog closes the dialog.

* **Activate Chat:**

    Verifies that clicking the (Take Over) button activates the chat and enables all associated chat actions.

* **Type in Chat Input Field:**

    Ensures that users can type text into the chat input field.

* **Send Text in Chat:**

    Verifies that after typing a message and clicking the send button, the message appears in the chat as expected.

* **Ask for Authentication Event:**

    Confirms that clicking the "Küsi autentimist" (Ask for Authentication) button triggers an event in the chat, and the corresponding message appears.

* **Ask for Contact Information Event:**

    Verifies that clicking the (Ask for Contact Information) button triggers an event in the chat, and the appropriate message appears.

* **Ask for Permission Event:**

    Ensures that clicking the "Küsi nõusolekut" (Ask for Permission) button triggers an event in the chat, and the relevant message appears.

* **Prevent Multiple Event Messages for Authentication:**

    Verifies that clicking the (Ask for Authentication) button multiple times only sends one event message.

* **Prevent Multiple Event Messages for Contact Information:**

    Confirms that clicking the (Ask for Contact Information) button multiple times only sends one event message.

* **Prevent Multiple Event Messages for Permission:**

    Ensures that clicking the (Ask for Permission) button multiple times only sends one event message.