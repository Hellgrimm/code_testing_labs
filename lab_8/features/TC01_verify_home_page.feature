Feature: Verify Home Page

  Scenario: TC01 – Перевірка відображення головної сторінки
    Given I open the home page
    Then I should see "Automation Exercise" in the page title
    And I should see the banner section
