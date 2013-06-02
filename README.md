TagManager
==========

Tag manager or the tag helper plugin helps you convert the text you enter in a text area into a tag, this is similar
to what you see in facebook invite dialog. After entering an email ID/Phone number(configured only 2 validators), and a 
separator(which can be configured in options), the helper converts the entered text into a tag. The tag can be removed
using the remove symbol. 

Usage
======

Initialise the element as taghelper      - $(selector).TagHelper(options)

Get the data that the user has entered   - $(selector).data("parsedData")

Options
=======
validators: A JSON object containing the validator name and function, by default an email validator and a phone number 
validator are available. A validator helps in creating a successful tag once the user has entered valid data, otherwise
the tag is created as error

separator: The seperator character, the user entered text will be converted into a tag once the user types the seperator
character.

tagConverter: One of the validator that is defined in the validators.


