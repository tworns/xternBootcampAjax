var people = [];

$('#menuToggle').on('click', function() {
  $('nav ul').toggle(400);
});

$('a[data-remote="true"]').on('click', function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href') + '?callback=loadResults',
    method: 'get',
    dataType: 'jsonp'
  });
});

$('a[data-remote-mutants="true"]').on('click', function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href'),
    method: 'get',
    success: loadMutants
  });
});

$('a[data-remote-pokemon="true"]').on('click', function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href'),
    method: 'get',
    success: getAllPokemon
  });
});

$('a[data-add-mutants = "true"]').on('click',function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href'),
    method: 'post',
    headers: {
        "Content-Type": "application/json",
    },
    data: JSON.stringify({
      real_name: $('#realName').val(),
      mutant_name: $('#mutantName').val(),
      power: $('#mutantPower').val(),
    }),
    success: addedMutant,
      });
});
$('a[data-delete-mutants = "true"]').on('click',function(e){
  e.preventDefault();
  var id = $('#idNum').val();
  var delString = $(this).attr('href') + "/" + id;
  if(searchId(id) === true){
     delString = delString+id;
    console.log(delString+=id);
  }
  $.ajax({
    url: delString,
    method: 'delete',
    success : deletedMutant,
  });
});

$('a[data-clear = "true"]').on('click', clear);
 function clear (e) {
  e.preventDefault();
  $('#people').empty();
  $('#realName').val("");
  $('#mutantName').val("");
  $('#mutantPower').val("");
  $('#idNum').val("");
}

$('a[data-update-mutants = "true"]').on('click',updateMutant);

  function updateMutant(e) {
    e.preventDefault();
    var name = $('#real_name').val();
    var power = $('#mutant_power').val();
    var mName = $('#mutant_name').val();
    if(name === undefined || name === "") {
      name = "Placeholder";
    }
    if(power === undefined|| power === "") {
      power = "none";
    }
    if(mName === undefined|| mName === "") {
      mName = "Bob";
    }
    $.ajax({
      url : $(this).attr('href') + '/'+ $('#mutant_id').val(),
      method : 'put',
      success: clear(e),
      data : {
        mutant: {
          real_name : name,
          power : power,
          mutant_name :  mName,
        },
      },

    });
}

function searchId(id) {
  for(var i = 0; i < people.length; i++) {
    if(people[i].id === id) {
       people.splice(i,1);
       return true;
    }
  }
  return false;
}
function deletedMutant(data) {
  $('#people').empty();
  $('#idNum').val("");
}
function addedMutant(data) {
  $('#people').empty();
  $('#realName').val("");
  $('#mutantName').val("");
  $('#mutantPower').val("");
}

function loadResults(data) {
  if (data.firstName) {
    people.push(data);
  }
  else if (data.people) {
    people = people.concat(data.people);
  }
  listPeople();
}

function loadMutants(data) {
  $.each(data, function(i, mutant) {
    people.push({
      firstName: mutant.mutant_name,
      lastName: '[' + mutant.real_name + ']',
      secret: mutant.power
    });
  });
  listPeople();
}

function getAllPokemon(data) {
  $.each(data.results, function(i, pokemon) {
    $.ajax({
      url: pokemon.url,
      method: 'get',
      success: loadPokemon
    });
  });
  setTimeout(function() {
    listPeople();
  }, 5000);
}

function loadPokemon(pokemon) {
  people.push({
    firstName: pokemon.name,
    lastName: '',
    secret: pokemon.abilities[0].ability.name
  });
}

function listPeople() {
  $('#people').slideUp();
  $('#people').empty();
  $.each(people, function(index, person) {
    var item = $('#template').clone().attr('id', '');
    item.html(item.html().replace('{{ person.firstName }}', person.firstName)
      .replace('{{ person.lastName }}', person.lastName)
      .replace('{{ person.secret }}', person.secret))
      .removeClass('hide');
    $('#people').append(item);
  });

  $('#people').slideDown();
}


listPeople();
