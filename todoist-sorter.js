var interval;
var api;
var frequency = (+Meteor.settings.todoistCheckFrequency * 60000) || 300000;

Meteor.startup(function () {
  if (Meteor.settings && Meteor.settings.todoistEmail && Meteor.settings.todoistPassword) {
    console.log("Logging in...")
    try {
      api = new Todoist(Meteor.settings.todoistEmail, Meteor.settings.todoistPassword);
      console.log("Logged in")
    }
    catch (err) {
      console.log("Error");
      console.log(err)
    }
    if (api.user) {
      checkForNewTasks();
      interval = Meteor.setInterval(checkForNewTasks, frequency); // every 5 minutes
    }
    else {
      console.log("WTF? Fix me pls.")
    }
  }
});

main = function (argv) {
  return 'DAEMON';
}

checkForNewTasks = function () {
  console.log("Checking for new tasks now and every " + (frequency / 1000 / 60) + " minutes...");
  api.request('getUncompletedItems', { project_id: api.user.inbox_project }, function (err, res, data) {
  // api.request('query', { queries: JSON.stringify(['##']) }, function (err, res, data) {
    if (err) {
      console.log('Error checking for new tasks:');
      console.log(err);
    }
    else {
      if (! _.isEmpty(data)) {
        api.request('getProjects', {}, function (err2, res2, data2) {
          if (err2) {
            console.log("Error getting projects");
            console.log(err2);
          }
          else {
            console.log("Finding ##project assignments...")

            _.each(data, function (item, index) {
              var matches;
              var search = /(.*)##([^\s]+)(.*)/;
              if (matches = search.exec(item.content)) {
                // console.log(item);

                // What word actually matched?
                projectName = matches[2];
                console.log("Project name: " + projectName)

                // OK great, now try to find a project with this name.
                var project = _.findWhere(data2, { name: projectName });

                if (project) {
                  var projectId = project.id;

                  console.log("Project ID: " + projectId)

                  // Finally, move the item to this project. Then we are done.
                  var projectMapping = {};
                  projectMapping[item.project_id] = [item.id.toString()];
                  api.request('moveItems', { project_items: JSON.stringify(projectMapping), to_project: projectId.toString() }, function (err3, res3, data3) {
                    if (err3) {
                      console.log("Problem moving task");
                      console.log(err3);
                    }
                    else {
                      console.log('Task "' + item.content + '" moved to project "' + project.name + '"');

                      api.request('updateItem', { id: item.id, content: (matches[1] + matches[3]).trim() }, function (err4, res4, data4) {
                        if (err4) {
                          console.log("Couldn't fix task name");
                          console.log(err4);
                        }
                        else {
                          // Silence.
                        }
                      });
                    }
                  });
                }
                else {
                  console.log("No matching project for " + matches[2])
                }
              }
            });
          }
        });
      }
      else {
        console.log("No data");
      }
    }
  });
}
