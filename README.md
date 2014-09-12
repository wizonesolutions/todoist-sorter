# Todoist Sorter - put tasks into projects with `##`

[Todoist](https://todoist.com) has a problem. There are no good keyboard shortcuts
to move tasks into projects at editing time. You have to use the mouse, and it
breaks your train of thought if you process your tasks GTD style.

**This app fixes that.**

## Usage

When you create tasks in Todoist, simply add `##<project name>` (e.g. `##work`)
anywhere in your task name (much like you would use `@label`s).

You can also use partial project names, such as `##w`. That will match `work`
as long as it is the shortest project name beginning with `w`. You can use partial
names from anywhere in the project name, so `##proc` will match `work/process-improvement`.

You cannot use spaces, and matches are still case-sensitive (it's on the roadmap to make them case-insensitive).

Every 5 minutes (by default), this app will use the
Todoist API to move those tasks into the desired projects. You can also stop
and start the app to do it immediately.

## Installation (command line required)

It is written in [Meteor](http://meteor.com), so you have to install that to
use it. It's super-easy. Just copy and paste one line.

Then clone this app from GitHub and run it with
`meteor --settings=settings.json` AFTER you configure it..

## Configuration

Copy `settings.json.example` to `settings.json` and replace the parameters with
your Todoist credentials and desired update frequency (you can actually delete
the line with update frequency if you want; the default is 5 minutes). There are
a few API calls each time, so I wouldn't update too often or Todoist might think
it's abuse. I haven't had any issues with a 5-minute interval so far.

### Privacy/security

These are used by the app to talk directly to the
Todoist API and are not sent anywhere else. I store the Todoist token in a local
Mongo database using Meteor's APIs so that you don't have to log in for every
check (your credentials are transferred with HTTPS, but this minimizes how
often they have to be).

## Running

`meteor --settings=settings.json`

## Reporting bugs, requesting features, asking questions

First see known issues below.

Use the [issue list](https://github.com/wizonesolutions/todoist-sorter/issues) otherwise.

If there is no GitHub issue for the known issue, you are
welcome to open one.

## Stopping

You can stop Meteor apps by pressing `Ctrl + C`.

## Known issues

- Won't work if the project name has spaces.
- I don't know if Todoist login tokens expire. If they do, you'll start getting
`LOGIN_ERROR`s, and you will have to `meteor reset` to get yourself logged in
again. This is safe since the only thing that is stored is your user info from
Todoist (by the [todoist](https://github.com/wizonesolutions/meteor-todoist)
package).
- **Occasionally**, the app will struggle with Todoist tasks added from Gmail. This is because Todoist actually
stores the task name as `link to Gmail (Email subject line)`. When you add `##project` to this,
it gets placed inside the parentheses, making the app unable to match it.
**Workaround**: Just move `##project` to the beginning of the task name.

## Roadmap

- Support spaces in project name, maybe with dashes or something like
`#project# instead of ##project?`
- Case-insensitive project name matching.
- Maybe label tasks that are moved by this app (for premium users)?
- Compile a list of which projects items will be moved to and submit the whole thing to `moveItems` instead
of calling it every time.

## Author

This Meteor package was written by [WizOne Solutions](http://www.wizonesolutions.com), a Meteor and Drupal CMS developer.

My largest Meteor app so far is [Spendflow](https://github.com/spendflow/spendflow). It has a private beta. Check it out.
