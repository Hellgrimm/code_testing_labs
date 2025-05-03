Feature: Verify Sign Up / Login Page

  Scenario: TC02 – Перехід на сторінку реєстрації та логіну
    Given I open the home page
    When I click on "Signup / Login"
    Then I should see "New User Signup!"
    And I should see "Login to your account"
