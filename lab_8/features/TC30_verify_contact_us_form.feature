Feature: Verify Contact Us form feedback message

  Scenario: TC30 – Перевірка повідомлення після відправки форми Contact Us
    Given I open the home page
    When I click on "Contact Us"
    And I fill in "Name" with "Petro"
    And I fill in "Email Address" with "testuser@example.com"
    And I fill in "Subject" with "Test Subject"
    And I fill in "Message" with "This is a test message."
    And I click on "Submit"
    Then I should see "Success! Your details have been submitted successfully."
