var interval;

Meteor.startup(function () {
  if (Meteor.settings && Meteor.settings.todoistEmail && Meteor.settings.todoistPassword) {
    checkForNewTasks();
    interval = Meteor.setInterval(checkForNewTasks, (300000)); // every 5 minutes
  }
});

main = function (argv) {
  return 'DAEMON';
}

checkForNewTasks = function () {
  console.log("Checking for new tasks...");
}
