$(function() {

//********************** Default Display *********************//
//***********************************************************//
const $dinerImg = $('#dinerImg')
const $details = $('#details')
$details.hide()

const $introBlurb = $('#intro')
// home button event listener
$('.navbar-brand').on('click', () => { 
    $introBlurb.fadeIn()
    $dinerImg.slideDown()
    $SodaDiv.hide()
    $DinerDiv.hide()
    $details.hide()
})

const $SodaBtn = $('#SodaBtn') // show all sodas btn
const $SodaDiv = $('#Sodas')
const $SodaList = $('#SodaList')
const $addSodaBtn = $('#addSodaBtn')
const $sodaAlert = $('#newSodaAlert')

$SodaDiv.hide()
$addSodaBtn.on('click', () => $sodaAlert.empty())

const $DinerBtn = $('#DinerBtn') // show all diners btn
const $DinerDiv = $('#Diners')
const $DinerList = $('#DinerList')
const $dinerAlert = $('#newDinerAlert')
const $addDinerBtn = $('#addDinerBtn')

$DinerDiv.hide()
$addDinerBtn.on('click', () => $dinerAlert.empty())

//********************* Read Functions **********************//
//***********************************************************//
$SodaBtn.on('click', () => displaySodas())
$DinerBtn.on('click', () => displayDiners())

function displayDiners(){
    $introBlurb.hide(); 
    $SodaDiv.hide(); 
    $details.hide()
    $DinerDiv.fadeIn(); 
    $dinerImg.slideDown()
    // empty list before updating
    $DinerList.empty() 
    fetchDiners()
}

async function fetchDiners(){
    let response = await fetch('/api/diner')
    let data = await response.json()
    if (data.length === 0) {
        $DinerList.append(`<h3>Sorry, there are currently no diners. Click the button below to add one!</h3>`)
        return
    }
    $DinerList.append(`<h3>Click on a diner to see more details</h3>`)
    data.forEach(diner => {
        $DinerList.append(`
        <div><button id="${diner._id}" class="ui big button dinerName my-3">${diner.name}</button></div>`)
    })
    // attach event listner to buttons
    $('.dinerName').on('click', (e) => fetchDinerDetails(e))
}

async function fetchDinerDetails(e) {
    $dinerImg.hide()
    $details.fadeIn().empty()
    const id = e.target.id
    let response = await fetch(`/api/diner/${id}`)
    let data = await response.json()
    for (let key in data) { 
        if (key !== 'sodas')$details.append(`<div class="my-3"><h2>${key} : ${data[key]}</h2></div>`)
    }
    $details.prepend(`
        <button id="${e.target.id}" class="button primary ui large mt-4 showSodas">Display Sodas</button>
        <button id="${e.target.id}" class="button ui large mt-4 dinerEdit" data-toggle="modal" data-target="#editDinerModal">Edit</button>
        <button id="${e.target.id}" class="button ui large left labeled icon mt-4 dinerDelete">Delete Diner<i class="trash icon"></i></button>
    `)
    $details.append(`
        <div id="servedSodas"></div>
        <div id="deleteDinerAlert"></div>
    `)
    // attach delete event listeners
    $('.dinerDelete').on('click', (e) => deleteDinerAlert(e))
    $('.showSodas').on('click', e => showSodas(e))
    $('.dinerEdit').on('click', e => passDinerID(e))
}

function displaySodas() {
    $introBlurb.hide(); 
    $DinerDiv.hide(); 
    $details.hide()
    $SodaDiv.fadeIn(); 
    $dinerImg.slideDown()
    // empty list before updating
    $SodaList.empty() 
    fetchSodas()
}

async function fetchSodas() {
    let response = await fetch('/api/soda')
    let data = await response.json()
    if (!data.length) {
        $SodaList.append(`<h3>Sorry, there are currently no sodas. Click the button below to add one!</h3>`)
        return
    }
    $SodaList.append(`<h3>Click on a soda to see more details</h3>`)
    data.forEach(soda => $SodaList.append(`<div><button id="${soda._id}" class="ui big ${sodaColor(soda.name)} button sodaName my-3">${soda.name}</button></div>`))
    // attach event listener
    $('.sodaName').on('click', e => fetchSodaDetails(e))
}

async function fetchSodaDetails(e) {
    $dinerImg.hide()
    $details.empty()
    let id = e.target.id
    let response = await fetch(`api/soda/${id}`)
    let data = await response.json()
    $details.append(`
        <button id="${e.target.id}" class="button ui big my-4 sodaEdit" data-toggle="modal" data-target="#editSodaModal">Edit</button>
        <button id="${e.target.id}" class="button ui left labeled icon big mt-4 sodaDelete">Delete Soda<i class="trash icon"></i></button>
    `)
    for (let key in data){ 
        $details.append(`
            <div class="my-3">
            <h2>${key} : ${data[key]}</h2>
            </div>`) 
    }
    $details.append('<div id="deleteSodaAlert"></div>')
            .hide()
            .fadeIn()
    // attach delete event listener / function 
    $('.sodaDelete').on('click', (e) =>  deleteSodaAlert(e))
    $('.sodaEdit').on('click', e => passSodaID(e))
}

//******************** Create Functions  ********************//
//***********************************************************//
const $addSoda = $('form#addSoda')
const $sodaName = $('#sodaName')
const $fizziness = $("#fizziness")
const $tasteRating = $('#taste-rating')


$addSoda.on('submit', async (e) => {
    e.preventDefault()
    // clear out soda div for new alert each event
    $sodaAlert.empty() 
    // capture form values
    const name = $sodaName.val()
    const fizziness = parseInt($fizziness.val())
    const rating = parseInt($tasteRating.val())
    let data = { name, fizziness, 'taste rating': rating }
    
    const headers = {'Content-Type': 'application/json'}
    const body = JSON.stringify(data)

    let response = await fetch('/api/soda', {method: 'POST', headers, body})
    if (response.status === 200) {
        // create a success alert
        $sodaAlert.append(`
        <div id="addSodaSuccess" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> You created ${name}.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`).hide().fadeIn()
        // clear form values
        $sodaName.val('')
        $fizziness.val('')
        $tasteRating.val('')
        displaySodas()
    }
    else if (response.status === 400) { 
        // create a fail alert
        $sodaAlert.append(`
        <div id="addSodaFail" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Whoops!!</strong> Looks like something went wrong. Bummer. Try a different name or make sure you filled out the form correctly!!
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`)
        .hide()
        .fadeIn()
    }
})

const $addDiner = $('form#addDiner')
const $dinerName = $('#dinerName')
const $dinerLocation = $('#dinerLocation')

$addDiner.on('submit', async (e) => {
    e.preventDefault()
    // clear alert div for new alert each event
    $dinerAlert.empty()
    //capture form values
    let name = $dinerName.val()
    let location = $dinerLocation.val()
    let data = { name, location  }

    const headers = {'Content-Type': 'application/json'}
    let body = JSON.stringify(data)

    let response = await fetch('/api/diner', {method: 'POST', headers, body})
    if (response.status === 200) {
        // create a success alert
        $dinerAlert.append(`
        <div id="addDinerSuccess" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> You created a new diner: <strong>${name}<strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div>`).hide().fadeIn()
        //clear out form values
        $dinerName.val('')
        $dinerLocation.val('')
        displayDiners()
    }
    else if (response.status === 400){
        // create a fail alert
        $dinerAlert.append(`
        <div id="addDinerFail" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Whoops!!</strong> Looks like something went wrong. Try making a diner with a different name or making sure you filled out all fields!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div>`).hide().fadeIn()
    }
})

//********************* Delete Functions  ********************//
//***********************************************************//
async function deleteSoda(e) {
    let id = e.target.dataset.id
    let response = await fetch(`/api/soda/${id}`, {method: "DELETE"})
    if (response.status === 200) {
        $details.empty()
        displaySodas()
    }
    else if (response.status === 400) { alert('Whoops! There\'s been an error') }
}

function deleteSodaAlert(e){
    $('#deleteSodaAlert')
    .empty()
    .append(`
        <div id="deleteSodaAlert" class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>Are you sure you want to delete this soda?</strong>
        <div class="mt-2">
        <button id="sodaDeleteConfirm" data-id="${e.target.id}" class="ui button inverted red tiny">Confirm</button>
        <button class="ui button black tiny" type="button" class="close" data-dismiss="alert">Cancel</button>
        </div>
        </div>
    `)
    .hide()
    .fadeIn()
    $('#sodaDeleteConfirm').on('click', e => deleteSoda(e))
}

function deleteDinerAlert(e){
    $('#deleteDinerAlert').empty().append(`
        <div id="deleteDinerAlert" class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>Are you sure you want to delete this diner?</strong>
        <div class="mt-2">
        <button id="dinerDeleteConfirm" data-id="${e.target.id}" class="ui button inverted red tiny">Confirm</button>
        <button class="ui button black tiny" type="button" class="close" data-dismiss="alert">Cancel</button>
        </div>
        </div>
    `)
    .hide()
    .fadeIn()
    $('#dinerDeleteConfirm').on('click', e => deleteDiner(e))
}

async function deleteDiner(e) {
    let id = e.target.dataset.id
    let response = await fetch(`/api/diner/${id}`, {method: "DELETE"})
    if (response.status === 200) {
        $details.empty()
        displayDiners()
    }
    else if (response.status === 400) { alert('Whoops! There has been an error') }
}

//********************* Show / Delete Soda's being served  *********************//
//******************************************************************************//
async function showSodas(e) {
    const dinerID = e.target.id
    let response = await fetch(`/api/diner/${dinerID}`)
    let data = await response.json()
    const $servedSodas = $("#servedSodas")
    $servedSodas.empty()
                .append(`<h2>Sodas:</h2>`)
    data.sodas.forEach((soda) => {
        $servedSodas.append(`
        <div class="my-2">
        <button data-soda="${soda._id}" data-diner="${dinerID}" class="unserve ui right ${sodaColor(soda.name)} labeled icon button">
        ${soda.name}<i data-soda="${soda._id}" data-diner="${dinerID}" data-name="${soda.name}" class="trash icon"></i></button>
        </div>`)
    })
    $servedSodas.append(`
    <div class="mt-4">
    <button id="${dinerID}" class="serveSoda ui button right labeled icon" data-toggle="modal" data-target="#serveSoda">
    <i class="add icon"></i>Serve a Soda</button>
    </div> <p class="lead mt-2"><i>Click on a soda to delete</i></p>`)
    .hide()
    .fadeIn()

    // attach event listener
    $('.unserve').on('click',(e) => unserveSoda(e))
    $('.serveSoda').on('click', (e) =>  chooseSodas(e))
}

async function unserveSoda(e) {
    const sodaID = e.target.dataset.soda
    const dinerID = e.target.dataset.diner
    let response = await fetch(`/api/diner/${dinerID}/${sodaID}`, {method: "DELETE"})
    const $btn = $(`[data-soda='${sodaID}']`)
    if (response.status === 200) $btn.fadeOut()
    else if (response.status === 400) {
        $servedSodas.append(`
        <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Oh no!</strong> Something went wrong.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>
        `)
    }
}

//********************* Add a Soda to a Diner's Sodas array *********************//
//******************************************************************************//

const $availableSodas = $('#availableSodas')

async function chooseSodas(e){
    let dinerID = e.target.id
    let response = await fetch(`/api/diner/${dinerID}/sodas`)
    let data = await response.json()
    $availableSodas.empty()
    if (data.length === 0) {
        return $availableSodas.append('Sorry, there are no more sodas to serve.')
    }
    $availableSodas.append(`<p>Click on a soda to start serving</p>`)
    data.forEach(soda => {
        $availableSodas.append(`
        <div class="my-3">
        <button id="${soda._id}" class="ui button ${sodaColor(soda.name)} serveSoda"  data-diner="${dinerID}">${soda.name}</button>
        </div>`)
    })
    // attach event listener
    $('.serveSoda').on('click', e => startServingSoda(e))
}

async function startServingSoda(e) {
    const dinerID = e.target.dataset.diner
    const sodaID = e.target.id
    const $btn = $(`#${e.target.id}`)
    let response = await fetch(`/api/diner/${dinerID}/${sodaID}`, {method: 'PUT'})
    if (response.status === 200) {
        $btn.fadeOut()
        $availableSodas.append(`
        <div id="serveSodaSuccess" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> ${e.target.textContent} is now being served. Click on 'Display Sodas' to see the changes.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>
        `)
    }
    else if (response.status === 400) {
        $availableSodas.append(`
        <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Whoops!</strong> Something went wrong.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>
        `)
    }
}

//******************************* Edit Functions *******************************//
//******************************************************************************//

const $editSodaSubmit = $('#editSodaSubmit')
const $editSodaAlert = $('#editSodaAlert')
const $editSodaName = $("#editSodaName")
const $editSodaFizziness = $('#editFizziness')
const $editTasteRating = $('#editTaste-rating')

function passSodaID(e) {
    // pass the _id value of the soda into the editSoda modal
    $editSodaSubmit.attr('data-id', e.target.id)
}

$('#editSoda').on('submit', (e) => {
    e.preventDefault()
    let SodaID = $editSodaSubmit.attr('data-id')
    let data = {
        name: $editSodaName.val(),
        fizziness: $editSodaFizziness.val(),
        rating: $editTasteRating.val()
    }
    body = JSON.stringify(data)
    editSoda(SodaID, body)

    //clear out form values
    $editSodaName.val('')
    $editSodaFizziness.val('')
    $editTasteRating.val('')
})

async function editSoda(id, body) {
    const headers = {'Content-Type': "application/json"}
    let response = await fetch(`/api/soda/${id}`, {method: "PUT", headers, body})
    if (response.status === 200) {
        $editSodaAlert.empty()
                      .append(`
        <div id="editSodaSuccess" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> Your edits have been saved.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`)
        displaySodas()
    }
    else if (response.status === 400) {
        $editSodaAlert.append(`
        <div id="editSodaFail" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Oh no!</strong> Something went wrong.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`)
    }
}

const $editDinerSubmit = $('#editDinerSubmit')
const $editDinerAlert = $('#editDinerAlert')
const $editDinerName = $('#editDinerName')
const $editDinerLocation = $("#editDinerLocation")

function passDinerID(e) {
    //pass the _id of the diner to the editDiner modal
    $editDinerSubmit.attr('data-id', e.target.id)
}

$('#editDiner').on('submit', (e) => {
    e.preventDefault()
    let dinerID = $editDinerSubmit.attr('data-id')
    let data = {
        name: $editDinerName.val(),
        location: $editDinerLocation.val()
    }
    body = JSON.stringify(data)
    editDiner(dinerID, body)

    //clear out inputs
    $editDinerName.val('')
    $editDinerLocation.val('')
})

async function editDiner(id, body) {
    const headers = {'Content-Type': 'application/json'}
    let response = await fetch(`/api/diner/${id}`, {method: 'PUT', headers, body})
    if (response.status === 200) {
        $editDinerAlert.empty().append(`
        <div id="editDinerSuccess" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> Your edits have been saved.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`)
        displayDiners()
    }
    else if (response.status === 400) {
        $editDinerAlert.append(`
        <div id="editDinerFail" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <strong>Oh no!</strong> Something went wrong.
        <button type="button" class="close" data-dismiss="alert">
          <span>&times;</span>
        </button>
        </div>`)
    }
}

//******************************** Miscellaneous *******************************//
//******************************************************************************//

// determine color to use for semantic ui button based on name of soda
function sodaColor(name) {
    let color;

    switch (name.toLowerCase()) {
        case 'pepsi':
        case 'diet pepsi':
        case 'mountain dew code blue':
        case 'code blue':
            color = 'blue'
            break;

        case 'coke':
        case 'coca cola':
        case 'mountain dew code red':
        case 'code red':
            color = 'red'
            break;

        case 'sprite':
        case 'mountain dew':
        case "vernor's":
        case 'ginger ale':
        case 'canada dry':
        case '7up':
            color = 'green'
            break;

        case 'fanta':
        case 'a&w':
        case 'rootbeer':
        case 'crush':
            color = 'orange'
            break;

        case 'grape fanta':
        case 'crush grape':
        case 'grape crush':
            color = 'purple'
            break;

        case 'faygo':
            color = 'yellow'
            break;
        
        case 'coke zero':
        case 'pepsi max':
            color = 'black'
            break;
        
        default:
            break;
    }
    return color;
}


})//document ready 