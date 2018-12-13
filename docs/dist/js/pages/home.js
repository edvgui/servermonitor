var computers = firestore.collection("computers");
var computersList = [];
var computersListView = [];
const grid = document.getElementById("computer-cards");
const modalsDelete = document.getElementById("computer-modals-delete");
const modalsInfo = document.getElementById("computer-modals-info");

getComputers();

function getComputers() {
    computers.onSnapshot(function (querySnapshot) {
        computersList = [];
        computersListView = [];
        querySnapshot.forEach(function (doc) {
            computersList.push({ name: doc.id, data: doc.data() });
        });
        computersList.sort(function (a, b) {
            return b.id - a.id;
        });
        updateViewedList();
        updateComputerGrid();
    });
}

function updateComputerGrid() {
    text = "";
    for (var i = 0; i < computersListView.length; i++) {
        text += generateCard(computersListView[i]);
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
    text += generateCardHeader(computer);
    text += generateCardBody(computer);
    text += generateCardFooter(computer);
    text += "</div></div>";
    return text;
}

function generateCardHeader(computer) {
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

function generateCardBody(computer) {
    var text = '';
    text += '<div class="card-body">';
    text += '<p>Public Ip address : <span class="float-right">' + computer.data.publicip + '</span></p>';
    text += '<p>Local Ip address : <span class="float-right">' + computer.data.localip + '</span></p>';
    //text += '<p>Number of cores : <span class="float-right">' + computer.data.realcores + '</span></p>';
    //text += '<p>Number of virtual cores : <span class="float-right">' + computer.data.virtualcores + '</span></p>';
    //text += '<p>Total memory : <span class="float-right">' + Math.round(computer.data.totalmemory / (1000000000)) + ' GB</span></p>';
    //text += '<p>Total storage : <span class="float-right">' + Math.round(computer.data.totalstorage / (1000000000)) + ' GB</span></p>';
    text += '<div class="row">';
    text += '<div class="col-4 col-md-4 text-center">';
    text += '<input type="text" class="knob" value="' + Math.round((1 - computer.data.freememory / computer.data.totalmemory) * 100) + '" data-width="90" data-height="90" data-fgColor="#00a65a" readonly>';
    text += '<div class="knob-label">Memory usage</div></div>';
    text += '<div class="col-4 col-md-4 text-center">';
    text += '<input type="text" class="knob" value="' + Math.round((1 - computer.data.freestorage / computer.data.totalstorage) * 100) + '" data-width="90" data-height="90" data-fgColor="#00c0ef" readonly>';
    text += '<div class="knob-label">Disk usage</div></div>';
    text += '<div class="col-4 col-md-4 text-center">';
    text += '<input type="text" class="knob" value="' + Math.round(computer.data.cpuload) + '" data-width="90" data-height="90" data-fgColor="#f56954" readonly>';
    text += '<div class="knob-label">CPU load</div></div>';
    text += '</div></div>';
    return text;
}

function generateCardFooter(computer) {
    const updateTime = new Date(computer.data.lastupdate);
    var text = '';
    text += '<div class="card-footer">';
    text += '<p>Last update : ' + updateTime.toString() + '</p>';
    text += "<button type=\"button\" onclick=\"updateModals('" + computer.name + "', 'info')\" class=\"btn btn-block btn-info btn-sm\">More informations</button>";
    if (!isConnected(computer)) 
        text += "<button type=\"button\" onclick=\"updateModals('" + computer.name + "', 'delete')\" class=\"btn btn-block btn-outline-danger btn-sm\">Delete</button>";
    text += '</div>';
    return text;
}

function updateModals(name, type) {
    computersListView.forEach(function (computer) {
        if (computer.name == name) {
            modalsDelete.innerHTML = generateModalDelete(computer);
            modalsInfo.innerHTML = generateModalInfo(computer);
            $("#modal-" + type + "-" + name).modal("show");
        }
    });
}

function generateModalInfo(computer) {
    var text = '';
    text += '<div class="modal fade" id="modal-info-' + computer.name + '">';
    text += '<div class="modal-dialog">';
    text += '<div class="modal-content">';
    text += generateModalInfoHeader(computer);
    text += generateModalInfoBody(computer);
    text += generateModalInfoFooter(computer);
    text += '</div></div></div>';
    return text;
}

function generateModalInfoHeader(computer) {
    var text = '';
    text += '<div class="card-header d-flex p-0">';
    text += '<h4 class="modal-title p-3">';
    text += '<i class="material-icons" style="vertical-align: middle; margin-right: 10px;">computer</i>';
    text += computer.name;
    text += '</h4><div class="card-tools">';
    text += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    text += '</div></div>';
    return text;
}

function generateModalInfoBody(computer) {
    console.log(computer);
    var text = '';
    text += '<div class="modal-body">';
    text += '<p>Status : ';
    if (isConnected(computer)) 
        text += '<span class="float-right badge bg-success">Connected</span>';
    else
        text += '<span class="float-right badge bg-danger">Offline</span>';
    text += '</p>';
    text += '<p>Public Ip address : <span class="float-right">' + computer.data.publicip + '</span></p>';
    text += '<p>Local Ip address : <span class="float-right">' + computer.data.localip + '</span></p>';
    if (computer.data.hasbattery) {
        text += '<p>Battery : <span class="float-right">' + Math.round(computer.data.batterypercent) + ' %';
        if (computer.data.batteryplugged)
            text += ' (Charging)';
        text += '</span></p>';
    }
    else
        console.log('This device doesn t have a battery');
    text += '<p>Number of cores : <span class="float-right">' + computer.data.realcores + '</span></p>';
    text += '<p>Number of virtual cores : <span class="float-right">' + computer.data.virtualcores + '</span></p>';
    text += '<p>Total memory : <span class="float-right">' + Math.round(computer.data.totalmemory / (1000000000)) + ' GB</span></p>';
    text += '<p>Free memory : <span class="float-right">' + Math.round(computer.data.freememory / (10000000)) / 100 + '/' + Math.round(computer.data.totalmemory / (1000000000)) + ' GB</span></p>';
    text += '<p>Total storage : <span class="float-right">' + Math.round(computer.data.totalstorage / (1000000000)) + ' GB</span></p>';
    text += '<p>Free storage : <span class="float-right">' + Math.round(computer.data.freestorage / (1000000000)) + '/' + Math.round(computer.data.totalstorage / (1000000000)) + ' GB</span></p>';
    text += '<p>CPU load : <span class="float-right">' + Math.round(computer.data.cpuload) + ' %</span></p>';
    text += '</div>';
    return text;
}

function generateModalInfoFooter(computer) {
    const updateTime = new Date(computer.data.lastupdate);
    var text = '';
    text += '<div class="modal-footer">';
    text += '<p>Last update : ' + updateTime.toString() + '</p>';
    text += '<button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>';
    text += '</div>';
    return text;
}

function generateModalDelete(computer) {
    var text = '';
    text += '<div class="modal fade" id="modal-delete-' + computer.name + '">';
    text += '<div class="modal-dialog">';
    text += '<div class="modal-content">';
    text += generateModalDeleteHeader(computer);
    text += generateModalDeleteBody(computer);
    text += generateModalDeleteFooter(computer);
    text += '</div></div></div>';
    return text;
}

function generateModalDeleteHeader(computer) {
    var text = '';
    text += '<div class="modal-header">';
    text += '<h4 class="modal-title">Delete ' + computer.name + '</h4>';
    text += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
    text += '</div>';
    return text;
}

function generateModalDeleteBody(computer) {
    var text = '';
    text += '<div class="modal-body">';
    text += 'Are you sure that you want to delete this card?  It will erase all those informations from the database, definitely.';
    text += '</div>';
    return text;
}

function generateModalDeleteFooter(computer) {
    var text = '';
    text += '<div class="modal-footer">';
    text += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
    text += "<button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" onclick=\"deleteComputer(\"" + computer.name + "\")>Delete</button>";
    text += '</div>';
    return text;
}

function deleteComputer(computer) {
    console.log('Deleting computer from database...');
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

function updateViewedList() {
    const checkConnected = document.getElementById("check-connected");
    const checkOffline = document.getElementById("check-offline");
    computersListView = [];
    computersList.forEach(function (computer) {
        var connected = isConnected(computer);
        if (connected && checkConnected.checked) computersListView.push(computer);
        else if (!connected && checkOffline.checked) computersListView.push(computer);
    });
    updateComputerGrid();
}

/*
<div class="modal fade" id="modal">
<div class="modal-dialog">
    <div class="modal-content">

    <!-- Modal Header -->
    <div class="modal-header">
        <h4 class="modal-title">Modal Heading</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>

    <!-- Modal body -->
    <div class="modal-body">
        Modal body..
    </div>

    <!-- Modal footer -->
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
    </div>

    </div>
</div>
</div>
*/

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