Feature: Verify Login with correct credentials

  Scenario: TC03 – Перевірка логіну з коректними обліковими даними
    Given I open the home page
    When I click on "Signup / Login"
    And I enter email "testuser@example.com" and password "password123"
    And I click on "Login"
    Then I should see "Logged in as testuser"
