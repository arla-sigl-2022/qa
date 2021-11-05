Feature: Contractors comments

    We want to query comments of a given contractor (page by page)

    Scenario Outline: Query pages of different sizes
        Given a contractor "<contractor>", <page> and <limit>
        When a user calls contractor comment API
        Then the user should recieve <numberOfComments>

        Examples:
            | contractor | page | limit | numberOfComments |
            | ATG Europe | 1    | 5     | 5                |
            | Leafspace  | 2    | 10    | 10               |
            | SpaceVR    | 3    | 15    | 15               |