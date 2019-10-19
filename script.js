var pokeSprite; //slika pokemona
var pokeName;   //ime pokemona
var pokeId;     //ID pokemona
var pokedexSprite;  //slika pokemona u pokedexu
var pokedexName;    //ime pokemona u pokedexu
var pokedexId;  //id pokemona u pokedexu
var pokedexIdPrev;  //id proslog oznacenog pokemona u pokedexu
var numbers = [];   //lista brojeva
var doing = false;  //provjera za request
var progress = $('.progress'); //progress default
var progressCount = $('.progress-count'); //progress nakon pogotka
var guessedArr = []; //lista koja oznacuje koji id je pogođen
var guessed = 0; //broj pogođenih pokemona
var hp; //varijabla za HP pokemona
var speed;  //varijabla za SPEED pokemona
var att;    //varijabla za ATTACK pokemona
var def;    //varijabla za DEFENCE pokemona

var modal = $('.pokedex-wrapper');  //selektiranje sadrzaja pokedexa
var pokedexButton = $('.pokedex-btn');  //selektiranje pokedex buttona
var closeButton = $('.close');  //selektiranje close buttona

//funkcija koja se obavlja nakon pokušaja - provjera odgovora
function funkcija () {
    if(guessed == 151) {
        alert('BRAVO! ZNATE SVE POKEMONE!');
        return;
    }

    guess = $('#inputPokemon').val();
    doing = false;
    if(guess.toLowerCase() == pokeName.toLowerCase()){
        alert('tocno!');

        guessed++;
        $('#inputPokemon').val('');
        progress.css('width', ((guessed*100)/151) + '%');
        progressCount.html(guessed + '/151');
        $('.pokedex-prog').html('(' + guessed + '/151)');

        $("img[value='" + pokeId + "']").attr('src', pokeSprite);

        //brisanje id-a pokemona iz liste brojeva
        for(var i = 0; i < numbers.length; i++) {
            if(numbers[i] == pokeId) {
                numbers.splice(i, 1);
                guessedArr[pokeId-1] = true;
            }
        }
        getPokemon();
    }
    else {
        alert('netocno!');
        $('#inputPokemon').val('');
        getPokemon();
    }
}

//funkcija za dohvacanje pokemona
function getPokemon () {
    var randomNum = Math.floor(Math.random() * numbers.length) + 1;
    pokeId = numbers[randomNum - 1];

    P.getPokemonByName(pokeId)
    .then(function(response){
        if(doing == false) {
        doing = true;
        pokeSprite = response.sprites.front_default;
        $(".pokemon-img").attr("src", pokeSprite)
        $(".pokemon-img").attr("alt", pokeName);
        pokeName = response.name;
        }
        });
}


$(document).ready(function(){

    //punjenje liste brojeva - od 0 do 150
    for(var i = 0; i < 151; i++) {
        numbers[i] = i + 1;
        guessedArr[i] = false;
        if(i < 150) {
            //dodavanje placeholdera u pokedex
            $(".pokedex-list").append('<span class="pokedex-img"><img value="'+ (i+2) + '" class="pokedex-img-placeholder" src="Images/placeholder.png" alt="placeholder image"/></span>');
        }
    }
    
    //random broj za dohvaćanje pokemona
    var randomNum = Math.floor(Math.random() * numbers.length) + 1;
    pokeId = numbers[randomNum - 1];

    //na klik guess buttona provjeri odgovor
    $('.guess-btn').on('click', function() {
        funkcija();
    });

    //pozivanje funkcije za provjeru nakon sto se stisne enter
    $('#inputPokemon').on('keypress',function(e) {
        if(e.which == 13) {
            funkcija();
        }
    });


    //dohvaćanje prvog pokemona
    getPokemon()


    //close button
    closeButton.on('click', function() {
        modal.css('display', 'none');
        $('.modal-body').css('display', 'block');
        $('#bs-or').css('background', 'white');
    });         

    //pokedex button
    pokedexButton.on('click', function () {
        modal.css('display', 'block');
        $('#bs-or').css('background', 'grey');
        $('.modal-body').css('display', 'none')
    });

    //dohvaćanje podataka o pokemonu na klik slike u pokedexu
    $('.pokedex-img-placeholder').on('click', function () {
        //dohvaćanje id-a kliknutog pokemona
        pokedexId = $(this).attr('value');
        if(guessedArr[pokedexId - 1] == true) {   
            $('.pokedex-img-placeholder[value="' + pokedexId + '"]').css('background-color', 'grey');
            $('.pokedex-img-placeholder[value="' + pokedexIdPrev + '"]').css('background-color', 'lightgray');
            
            //dohvaćanje podataka o pokemonu
            P.getPokemonByName(pokedexId)
            .then(function(response){
                
                pokedexName = response.name;
                pokedexSprite = response.sprites.front_default;
                hp = response.stats[5].base_stat;
                speed = response.stats[0].base_stat;
                att = response.stats[4].base_stat;
                def = response.stats[3].base_stat;
                $('.pokedex-img-placeholder[value="' + pokedexId + '"]').attr("src", pokedexSprite);
                $('.pokedex-img-placeholder[value="' + pokedexId + '"]').attr("alt", pokedexName);
                $(".info-placeholder").attr("src", pokedexSprite);
                $(".info-placeholder").attr("alt", pokedexName);
                $(".pokemon-name").html(pokedexName);
                $(".pokemon-id").html('#' + response.id);
                $(".hp-value").html(hp);
                $(".speed-value").html(speed);
                $(".att-value").html(att);
                $(".def-value").html(def);
                pokedexIdPrev = pokedexId;
            });
        }
    });
});