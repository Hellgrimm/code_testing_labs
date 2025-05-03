Feature: Verify Subscription in footer

  Scenario: TC24 – Перевірка підписки в футері
    Given I open the home page
    When I scroll to the bottom of the page
    And I fill in "Enter email address" with "test@example.com"
    And I click on the subscription button
    Then I should see "You have been successfully subscribed!"
