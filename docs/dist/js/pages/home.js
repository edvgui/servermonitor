var computers = firestore.collection("computers");
var computersList = [];
const grid = document.getElementById("computer_cards");

getComputers();

function getComputers() {
    computers.onSnapshot(function (querySnapshot) {
        computersList = [];
        querySnapshot.forEach(function (doc) {
            computersList.push({ name: doc.id, data: doc.data() });
        });
        computersList.sort(function (a, b) {
            return b.id - a.id;
        });
        updateComputerGrid();
    });
}

function updateComputerGrid() {
    text = "";
    for (var i = 0; i < computersList.length; i++) {
        text += generateCard(computersList[i]);
    }
    grid.innerHTML = text;

    $(function () {
        /* jQueryKnob */
  
        $('.knob').knob({
          
        })
        /* END JQUERY KNOB */
  
        //INITIALIZE SPARKLINE CHARTS
        $('.sparkline').each(function () {
          var $this = $(this)
          $this.sparkline('html', $this.data())
        })
  
      });
}

function generateCard(computer) {
    var text = "";
    text += '<div class="col-lg-4"><div class="card card-primary card-outline">';
    text += generateHeader(computer);
    text += generateBody(computer);
    text += generateFooter(computer);
    text += "</div></div>";
    return text;
}

function generateHeader(computer) {
    var text = "";
    text += '<div class="card-header d-flex p-0">';
    text += '<h3 class="card-title p-3">';
    text += '<i class="material-icons" style="vertical-align: middle; margin-right: 10px;">computer</i>';
    text += computer.name;
    text += '</h3><div class="card-tools">';
    if (isConnected(computer)) 
        text += '<span class="float-right badge bg-success">Connected</span>';
    else
        text += '<span class="float-right badge bg-danger">Offline</span>';
    text += '</div></div>';
    return text;
}

function generateBody(computer) {
    var text = '';
    text += '<div class="card-body">';
    text += '<p>Public Ip address : <span class="float-right">' + computer.data.publicip + '</span></p>';
    text += '<p>Local Ip address : <span class="float-right">' + computer.data.localip + '</span></p>';
    text += '<p>Number of cores : <span class="float-right">' + computer.data.realcores + '</span></p>';
    text += '<p>Number of virtual cores : <span class="float-right">' + computer.data.virtualcores + '</span></p>';
    text += '<p>Total memory : <span class="float-right">' + Math.round(computer.data.totalmemory / (1000000000)) + ' GB</span></p>';
    text += '<p>Total storage : <span class="float-right">' + Math.round(computer.data.totalstorage / (1000000000)) + ' GB</span></p>';
    text += '<div class="row">';
    text += '<div class="col-6 col-md-6 text-center">';
    text += '<input type="text" class="knob" value="' + Math.round((1 - computer.data.freememory / computer.data.totalmemory) * 100) + '" data-width="90" data-height="90" data-fgColor="#00a65a" readonly>';
    text += '<div class="knob-label">Memory usage</div></div>';
    text += '<div class="col-6 col-md-6 text-center">';
    text += '<input type="text" class="knob" value="' + Math.round((1 - computer.data.freestorage / computer.data.totalstorage) * 100) + '" data-width="90" data-height="90" data-fgColor="#00c0ef" readonly>';
    text += '<div class="knob-label">Disk usage</div></div>';
    text += '</div></div>';
    return text;
}

function generateFooter(computer) {
    const updateTime = new Date(computer.data.lastupdate);
    var text = '';
    text += '<div class="card-footer">';
    text += '<p>Last update : ' + updateTime.toString() + '</p>';
    if (!isConnected(computer)) 
        text += "<button type=\"button\" class=\"btn btn-block btn-danger btn-lg\" onclick=\"deleteChart('" + computer.name + "')\">Delete</button>";
    text += '</div>';
    return text;
}

function isConnected(computer) {
    const now = Date.now();
    const update = computer.data.lastupdate;
    if (now > update + 1000 * 60 * 2)
        return false
    return true;
}

function deleteChart(name) {
    for (var i = 0; i < computersList.length; i++)
        if (computersList[i].name == name)
            computersList.splice(i, 1);
    updateComputerGrid();
}

/*
<div class="col-lg-4">
    <div class="card card-primary card-outline">
    <div class="card-header d-flex p-0">
        <h3 class="card-title p-3">
        <i class="material-icons" style="vertical-align: middle; margin-right: 10px;">computer</i>
        Computer name 
        </h3>
        <div class="card-tools">
        <span class="float-right badge bg-success">Connected</span>
        </div>
    </div>
    <div class="card-body">
        <p>Ip address : <span class="float-right">0.0.0.0</span></p>
        <p>Number of cores : <span class="float-right">2</span></p>
        <p>Number of virtual cores : <span class="float-right">4</span></p>
        <p>Total memory : <span class="float-right">8 GB</span></p>
        <p>Total storage : <span class="float-right">500 GB</span></p>
        <div class="row">
        <div class="col-6 col-md-6 text-center">
            <input type="text" class="knob" value="40" data-width="90" data-height="90" data-fgColor="#00a65a">

            <div class="knob-label">Memory usage</div>
        </div>
        <div class="col-6 col-md-6 text-center">
            <input type="text" class="knob" value="40" data-width="90" data-height="90" data-fgColor="#00c0ef">

            <div class="knob-label">Disk usage</div>
        </div>
        </div>
    </div>
    <div class="card-footer">
        <p>Last update : <span class="float-right">00:00</span></p>
    </div>
    </div>
</div>
*/