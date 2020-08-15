var commits = [];
var commitsDetails = [];
var newCommitsDetails = [];
var commitDate = [];
var commitDateCount = [];
var repos = [];
var repoName = [];

async function setup() {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: commitDate,
      datasets: [
        {
          label: "Github Commits",
          data: commitDateCount,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {},
  });
}

async function getCommitData() {
  commits.length = 0;
  commitsDetails.length = 0;
  newCommitsDetails.length = 0;
  commitDate.length = 0;
  commitDateCount.length = 0;

  var userName = document.getElementById("userName").value;
  var repository = document.getElementById("repositories").value;
  // console.log(repository);
  var URL =
    "https://api.github.com/repos/" + userName + "/" + repository + "/commits";
  try {
    var response = await fetch(URL);
    var data = await response.json();
    commits = data;
    // console.log(commits);
  } catch (error) {}

  commits.forEach((element) => {
    commitsDetails.push(new Date(element.commit.author.date).toDateString());
    newCommitsDetails = compressArray(commitsDetails).reverse();
  });
  // console.log(commitsDetails);
  // console.log(newCommitsDetails);

  newCommitsDetails.forEach((row) => {
    commitDate.push(row.value);
    commitDateCount.push(row.count);
  });
  // console.log(commitDate);
  // console.log(commitDateCount);

  await setup();
}

async function getRepoData() {
  repos.length = 0;
  repoName.length = 0;
  // console.log(repoName);
  var userName = document.getElementById("userName").value;
  // console.log(userName);

  var URL = "https://api.github.com/users/" + userName + "/repos";
  try {
    var response = await fetch(URL);
    var data = await response.json();
    repos = data;
    // console.log(repos);
  } catch (error) {}

  repos.forEach((element) => {
    if (!element.private) {
      repoName.push(element.name);
    }
  });
  // console.log(repoName);

  var repositories = document.getElementById("repositories");

  removeOptions(repositories);

  //Add the Options to the DropDownList.
  for (var i = 0; i < repoName.length; i++) {
    var option = document.createElement("OPTION");

    //Set Customer Name in Text part.
    option.innerHTML = repoName[i];

    //Set CustomerId in Value part.
    option.value = repoName[i];

    //Add the Option element to DropDownList.
    repositories.options.add(option);
  }
}

function removeOptions(selectElement) {
  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }
}

function compressArray(original) {
  var compressed = [];
  // make a copy of the input array
  var copy = original.slice(0);

  // first loop goes over every element
  for (var i = 0; i < original.length; i++) {
    var myCount = 0;
    // loop over every element in the copy and see if it's the same
    for (var w = 0; w < copy.length; w++) {
      if (original[i] == copy[w]) {
        // increase amount of times duplicate is found
        myCount++;
        // sets item to undefined
        delete copy[w];
      }
    }

    if (myCount > 0) {
      var a = new Object();
      a.value = original[i];
      a.count = myCount;
      compressed.push(a);
    }
  }

  return compressed;
}
