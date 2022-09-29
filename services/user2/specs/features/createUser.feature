Feature: Create a account

  Scenario: Create a account with valid data
    Given that I am a user who wants to create an account
    When I enter my user name, password and email correctly
    And I validate the form
    Then my account is created
